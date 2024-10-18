import { GuildMember, type Interaction, type User } from 'src/discord/discord.module.js';

export async function getGuildMember(interaction: Interaction) {
  if (interaction.member) {
    if (interaction.member instanceof GuildMember) {
      return interaction.member;
    }
    if (interaction.guild) {
      return await interaction.guild.members.fetch(interaction.member.user.id);
    }
  }
  return undefined;
}

export function getUsernameString(user: User, member: GuildMember) {
  return `${user.displayName} (${member.user.username})`;
}
