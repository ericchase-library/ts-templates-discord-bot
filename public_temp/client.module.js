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

// src/commands/Community/avatar.ts
import { EmbedBuilder, SlashCommandBuilder } from "src/discord/discord.module.js";
var name = "avatar";
var avatar = {
  name,
  data: new SlashCommandBuilder().setName(name).setDescription("Get your avatar or the Avatar from someone else").addUserOption((option) => option.setName("user").setDescription("The User you want to Avatar from").setRequired(false)),
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const user = interaction.options.getUser("user") ?? interaction.user;
        if (interaction.guild) {
          const member = await interaction.guild.members.fetch(user.id);
          const avatar2 = user.displayAvatarURL();
          const color = member.displayHexColor ?? "Blue";
          const Embed = new EmbedBuilder().setColor(color).setTitle(`Here is ${user.username}'s Avatar`).setImage(avatar2);
          await interaction.reply({ embeds: [Embed], ephemeral: false });
        } else {
          const avatar2 = user.displayAvatarURL();
          const color = "Blue";
          const Embed = new EmbedBuilder().setColor(color).setTitle(`Here is ${user.username}'s Avatar`).setImage(avatar2);
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

// src/commands/Community/ping.ts
import { SlashCommandBuilder as SlashCommandBuilder2 } from "src/discord/discord.module.js";
var name2 = "ping";
var ping = {
  name: name2,
  data: new SlashCommandBuilder2().setName(name2).setDescription("Replies with Pong!"),
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
import { EmbedBuilder as EmbedBuilder2, SlashCommandBuilder as SlashCommandBuilder3 } from "src/discord/discord.module.js";
var name3 = "server-icon";
var serverIcon = {
  name: name3,
  data: new SlashCommandBuilder3().setName(name3).setDescription("Get the Server Icon of this Server"),
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        if (interaction.guild) {
          const icon = interaction.guild.iconURL();
          const name4 = interaction.guild.name;
          const embed = new EmbedBuilder2().setColor("Green").setTitle(`${name4}'s Icon`).setImage(icon);
          await interaction.reply({ embeds: [embed] });
        }
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  }
};

// src/commands/setup.ts
var enabled_commands = [avatar, ping, serverIcon];
var command_name_map = new Map;
for (const command of enabled_commands) {
  command_name_map.set(command.name, command);
}

// src/client.module.ts
import { Client, GatewayIntentBits } from "src/discord/discord.module.js";
var client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once("ready", () => {
  console.log("Bot is online.");
});
client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const command = command_name_map.get(interaction.commandName);
    if (command !== undefined) {
      try {
        const user = getUser(interaction);
        ConsoleLog(`${user} is executing command "${command.name}".`);
        await command.execute(interaction);
      } catch (error) {
        ConsoleError(error);
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
      }
    }
  }
});
client.login(getBotToken());
function getUser(interaction) {
  if (interaction.isCommand()) {
    let user = undefined;
    if ("getUser" in interaction.options) {
      user = interaction.options.getUser("user");
    }
    user = user ?? interaction.user;
    return `${user.displayName} [${user.id}]`;
  }
}
