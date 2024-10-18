// src/lib/lib.discord.module.ts
import { GuildMember } from "src/discord/discord.module.js";
async function getGuildMember(interaction) {
  if (interaction.member) {
    if (interaction.member instanceof GuildMember) {
      return interaction.member;
    }
    if (interaction.guild) {
      return await interaction.guild.members.fetch(interaction.member.user.id);
    }
  }
  return;
}
function getUsernameString(user, member) {
  return `${user.displayName} (${member.user.username})`;
}
export {
  getUsernameString,
  getGuildMember
};
