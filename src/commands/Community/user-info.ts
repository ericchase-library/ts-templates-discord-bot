import { HandleCommandError } from 'src/commands/Command.js';
import { EmbedBuilder, SlashCommandBuilder, type Interaction } from 'src/discord/discord.module.js';

const name = 'user-info';

export const user_info = {
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
          const user = interaction.options.getUser('user') ?? interaction.user;
          const member = await interaction.guild.members.fetch(user.id);
          const icon = user.displayAvatarURL();
          const tag = user.tag;

          const embed = new EmbedBuilder()
            .setColor('Blue')
            .setAuthor({ name: tag, iconURL: icon })
            .setThumbnail(icon)
            .addFields({ name: 'User', value: `${user}`, inline: false })
            .addFields({ name: 'Roles', value: `${member.roles.cache.map((r) => r).join(' ')}`, inline: false })
            .addFields({ name: 'Joined Server', value: member.joinedAt?.toLocaleDateString() ?? '???', inline: true })
            .addFields({ name: 'Joined Discord', value: user.createdAt?.toLocaleDateString() ?? '???', inline: true })
            .setFooter({ text: `User ID: ${user.id}`, iconURL: icon })
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        }
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  },
};
