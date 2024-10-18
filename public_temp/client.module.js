// src/lib/env.ts
function getVariable(key) {
  if (process.env[key] === undefined || process.env[key] === "") {
    throw new Error(`.env '${key}' is undefined`);
  }
  return process.env[key];
}
function getBotToken() {
  return getVariable("BOT_TOKEN");
}

// src/lib/ericchase/Utility/UpdateMarker.ts
class UpdateMarker {
  $manager;
  updated = false;
  constructor($manager) {
    this.$manager = $manager;
  }
  reset() {
    this.$manager.resetMarker(this);
  }
}

class UpdateMarkerManager {
  $marks = new Set;
  getNewMarker() {
    const marker = new UpdateMarker(this);
    this.$marks.add(marker);
    return marker;
  }
  resetMarker(mark) {
    mark.updated = false;
    this.$marks.add(mark);
  }
  updateMarkers() {
    for (const mark of this.$marks) {
      this.$marks.delete(mark);
      mark.updated = true;
    }
  }
}

class DataSetMarker {
  $manager;
  dataset = new Set;
  constructor($manager) {
    this.$manager = $manager;
  }
  reset() {
    this.$manager.resetMarker(this);
  }
}

class DataSetMarkerManager {
  $marks = new Set;
  getNewMarker() {
    const marker = new DataSetMarker(this);
    this.$marks.add(marker);
    return marker;
  }
  resetMarker(mark) {
    mark.dataset.clear();
    this.$marks.add(mark);
  }
  updateMarkers(data) {
    for (const mark of this.$marks) {
      mark.dataset.add(data);
    }
  }
}

// src/lib/ericchase/Utility/Console.ts
var marker_manager = new UpdateMarkerManager;
var newline_count = 0;
function ConsoleError(...items) {
  console["error"](...items);
  newline_count = 0;
  marker_manager.updateMarkers();
}
function ConsoleLog(...items) {
  console["log"](...items);
  newline_count = 0;
  marker_manager.updateMarkers();
}

// src/commands/Command.ts
async function HandleCommandError(error, interaction) {
  ConsoleError(error);
  if (interaction.isChatInputCommand()) {
    await interaction.reply({
      content: "Oops! Something went wrong while processing your request. Please try again later.",
      ephemeral: true
    });
  }
}

// src/commands/Community/ping.ts
import { SlashCommandBuilder } from "src/discord/discord.module.js";
var name = "ping";
var ping = {
  name,
  data: new SlashCommandBuilder().setName(name).setDescription("Replies with Pong!"),
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        await interaction.reply("Pong!");
      } else {
        ConsoleError("unexpected", interaction);
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  }
};

// src/commands/Community/server-icon.ts
import { EmbedBuilder, SlashCommandBuilder as SlashCommandBuilder2 } from "src/discord/discord.module.js";
var name2 = "server-icon";
var server_icon = {
  name: name2,
  data: new SlashCommandBuilder2().setName(name2).setDescription("Get the Server Icon of this Server"),
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        if (interaction.guild) {
          const icon = interaction.guild.iconURL();
          const name3 = interaction.guild.name;
          const embed = new EmbedBuilder().setColor("Green").setTitle(`${name3}'s Icon`).setImage(icon);
          await interaction.reply({ embeds: [embed] });
        }
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  }
};

// src/commands/Community/server-info.ts
import { EmbedBuilder as EmbedBuilder2, GuildVerificationLevel, SlashCommandBuilder as SlashCommandBuilder3 } from "src/discord/discord.module.js";
var name3 = "server-info";
var server_info = {
  name: name3,
  data: new SlashCommandBuilder3().setName(name3).setDescription("This gets some server info"),
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        if (interaction.guild) {
          const { guild } = interaction;
          const { memberCount, name: name4, ownerId } = guild;
          const user = interaction.options.getUser("user") ?? interaction.user;
          const member = await interaction.guild.members.fetch(user.id);
          const emojis = guild.emojis.cache.size;
          const icon = guild.iconURL() ?? undefined;
          const roles = guild.roles.cache.size;
          const embed = new EmbedBuilder2().setColor("Blue").setThumbnail(icon ?? null).setAuthor({ name: name4, iconURL: icon }).setFooter({ text: `Server ID: ${guild.id}`, iconURL: icon }).setTimestamp().addFields({ name: "Name", value: `${name4}`, inline: false }).addFields({ name: "Date Created", value: guild.createdAt?.toLocaleDateString() ?? "???", inline: true }).addFields({ name: "Joined", value: member.joinedAt?.toLocaleDateString() ?? "???", inline: true }).addFields({ name: "Server Owner", value: `<@${ownerId}>`, inline: true }).addFields({ name: "Members", value: `${memberCount}`, inline: true }).addFields({ name: "Roles", value: `${roles}`, inline: true }).addFields({ name: "Emojis", value: `${emojis}`, inline: true }).addFields({ name: "Verification Level", value: `${getGuildVerificationLevel(guild.verificationLevel)}`, inline: true }).addFields({ name: "Boosts", value: `${guild.premiumSubscriptionCount}`, inline: true });
          await interaction.reply({ embeds: [embed] });
        }
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  }
};
function getGuildVerificationLevel(verificationLevel) {
  switch (verificationLevel) {
    case GuildVerificationLevel.None:
      return "None";
    case GuildVerificationLevel.Low:
      return "Low";
    case GuildVerificationLevel.Medium:
      return "Medium";
    case GuildVerificationLevel.High:
      return "High";
    case GuildVerificationLevel.VeryHigh:
      return "Very High";
  }
}

// src/commands/Community/user-avatar.ts
import { EmbedBuilder as EmbedBuilder3, SlashCommandBuilder as SlashCommandBuilder4 } from "src/discord/discord.module.js";
var name4 = "user-avatar";
var user_avatar = {
  name: name4,
  data: new SlashCommandBuilder4().setName(name4).setDescription("Get your avatar or the Avatar from someone else").addUserOption((option) => option.setName("user").setDescription("The User you want to Avatar from").setRequired(false)),
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const user = interaction.options.getUser("user") ?? interaction.user;
        if (interaction.guild) {
          const member = await interaction.guild.members.fetch(user.id);
          const avatar = user.displayAvatarURL();
          const color = member.displayHexColor ?? "Blue";
          const Embed = new EmbedBuilder3().setColor(color).setTitle(`Here is ${user.username}'s Avatar`).setImage(avatar);
          await interaction.reply({ embeds: [Embed], ephemeral: false });
        } else {
          const avatar = user.displayAvatarURL();
          const color = "Blue";
          const Embed = new EmbedBuilder3().setColor(color).setTitle(`Here is ${user.username}'s Avatar`).setImage(avatar);
          await interaction.reply({ embeds: [Embed], ephemeral: false });
        }
      } else {
        ConsoleError("unexpected", interaction);
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  }
};

// src/commands/Community/user-info.ts
import { EmbedBuilder as EmbedBuilder4, SlashCommandBuilder as SlashCommandBuilder5 } from "src/discord/discord.module.js";
var name5 = "user-info";
var user_info = {
  name: name5,
  data: new SlashCommandBuilder5().setName(name5).setDescription("Get info on a user").addUserOption((option) => option.setName("user").setDescription("The user to get info on").setRequired(false)),
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        if (interaction.guild) {
          const user = interaction.options.getUser("user") ?? interaction.user;
          const member = await interaction.guild.members.fetch(user.id);
          const icon = user.displayAvatarURL();
          const tag = user.tag;
          const embed = new EmbedBuilder4().setColor("Blue").setAuthor({ name: tag, iconURL: icon }).setThumbnail(icon).addFields({ name: "User", value: `${user}`, inline: false }).addFields({ name: "Roles", value: `${member.roles.cache.map((r) => r).join(" ")}`, inline: false }).addFields({ name: "Joined Server", value: member.joinedAt?.toLocaleDateString() ?? "???", inline: true }).addFields({ name: "Joined Discord", value: user.createdAt?.toLocaleDateString() ?? "???", inline: true }).setFooter({ text: `User ID: ${user.id}`, iconURL: icon }).setTimestamp();
          await interaction.reply({ embeds: [embed] });
        }
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  }
};

// src/commands/setup.ts
var enabled_commands = [
  ping,
  server_icon,
  server_info,
  user_avatar,
  user_info
];
var command_name_map = new Map;
for (const command of enabled_commands) {
  command_name_map.set(command.name, command);
}

// src/client.module.ts
import { Client, GatewayIntentBits, GuildMember } from "src/discord/discord.module.js";
var client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once("clientReady", () => {
  ConsoleLog("Bot is online.");
});
client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const command = command_name_map.get(interaction.commandName);
    if (command !== undefined) {
      try {
        if (interaction.member instanceof GuildMember) {
          ConsoleLog(`${interaction.member.displayName} (${interaction.member?.user.username}) is executing command "${command.name}".`);
        } else {
          ConsoleLog(`${interaction.member?.user.username} is executing command "${command.name}".`);
        }
        await command.execute(interaction);
      } catch (error) {
        ConsoleError(error);
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
      }
    }
  }
});
ConsoleLog("Attempting to log in.");
client.login(getBotToken());
