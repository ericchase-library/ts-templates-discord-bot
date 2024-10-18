import { HandleCommandError, type Command } from 'src/commands/Command.js';
import { EmbedBuilder, GuildVerificationLevel, SlashCommandBuilder, type Interaction } from 'src/discord/discord.module.js';

const name = 'server-info';
export const server_info: Command = {
  name,

  // Command Builder
  data: new SlashCommandBuilder() //
    .setName(name)
    .setDescription('This gets some server info'),

  // Execute Function
  async execute(interaction: Interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        if (interaction.guild) {
          const { guild } = interaction;
          const { memberCount, name, ownerId } = guild;
          const user = interaction.options.getUser('user') ?? interaction.user;
          const member = await interaction.guild.members.fetch(user.id);
          const emojis = guild.emojis.cache.size;
          const icon = guild.iconURL() ?? undefined;
          const roles = guild.roles.cache.size;

          const embed = new EmbedBuilder()
            .setColor('Blue')
            .setThumbnail(icon ?? null)
            .setAuthor({ name: name, iconURL: icon })
            .setFooter({ text: `Server ID: ${guild.id}`, iconURL: icon })
            .setTimestamp()
            .addFields({ name: 'Name', value: `${name}`, inline: false })
            .addFields({ name: 'Date Created', value: guild.createdAt?.toLocaleDateString() ?? '???', inline: true })
            .addFields({ name: 'Joined', value: member.joinedAt?.toLocaleDateString() ?? '???', inline: true })
            .addFields({ name: 'Server Owner', value: `<@${ownerId}>`, inline: true })
            .addFields({ name: 'Members', value: `${memberCount}`, inline: true })
            .addFields({ name: 'Roles', value: `${roles}`, inline: true })
            .addFields({ name: 'Emojis', value: `${emojis}`, inline: true })
            .addFields({ name: 'Verification Level', value: `${getGuildVerificationLevel(guild.verificationLevel)}`, inline: true })
            .addFields({ name: 'Boosts', value: `${guild.premiumSubscriptionCount}`, inline: true });

          await interaction.reply({ embeds: [embed] });
        }
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  },
};

function getGuildVerificationLevel(verificationLevel: GuildVerificationLevel) {
  switch (verificationLevel) {
    case GuildVerificationLevel.None:
      return 'None';
    case GuildVerificationLevel.Low:
      return 'Low';
    case GuildVerificationLevel.Medium:
      return 'Medium';
    case GuildVerificationLevel.High:
      return 'High';
    case GuildVerificationLevel.VeryHigh:
      return 'Very High';
  }
}
