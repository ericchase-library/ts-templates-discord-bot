// @bun
// src/lib/lib.discord.module.ts
import { GuildMember } from "../external/discord/discord.module.js";
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
function getUsernameString(user) {
  return `${user.displayName} (${user.username})`;
}
export {
  getUsernameString,
  getGuildMember
};

//# debugId=362F2E59B062AA7C64756E2164756E21
//# sourceMappingURL=lib.discord.module.js.map
