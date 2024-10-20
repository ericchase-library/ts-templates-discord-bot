import { HandleCommandError, type Command } from 'src/commands/Command.js';
import { EmbedBuilder, SlashCommandBuilder, type Interaction } from 'src/discord/discord.module.js';

const name = 'userinfo';
export const command_user_info: Command = {
  name,

  // Command Builder
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription('Get info on a user')
    .addUserOption((option) => option.setName('user').setDescription('The user to get info on').setRequired(false)),

  // Execute Function
  async execute(interaction: Interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        if (interaction.guild) {
          const target_user = interaction.options.getUser('user') ?? interaction.user;
          const target_member = await interaction.guild.members.fetch(target_user.id);
          const target_icon = target_user.displayAvatarURL();

          const embed = new EmbedBuilder()
            .setColor('Blue')
            .setAuthor({ name: target_user.tag, iconURL: target_icon })
            .setThumbnail(target_icon)
            .addFields({ name: 'User', value: `${target_user}`, inline: false })
            .addFields({ name: 'Roles', value: `${target_member.roles.cache.map((r) => r).join(' ')}`, inline: false })
            .addFields({ name: 'Joined Server', value: target_member.joinedAt?.toLocaleDateString() ?? '???', inline: true })
            .addFields({ name: 'Joined Discord', value: target_user.createdAt?.toLocaleDateString() ?? '???', inline: true })
            .setFooter({ text: `User ID: ${target_user.id}`, iconURL: target_icon })
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        }
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  },
};
