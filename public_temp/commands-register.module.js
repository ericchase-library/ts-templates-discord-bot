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
function getClientID() {
  return getVariable("CLIENT_ID");
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

// src/lib/ericchase/Utility/Sleep.ts
async function Sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
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

// src/commands-register.module.ts
import { Client, GatewayIntentBits, REST, Routes } from "src/discord/discord.module.js";
var rest = new REST({ version: "10" }).setToken(getBotToken());
var client = new Client({ intents: [GatewayIntentBits.Guilds] });
var delay = 500;
var command_data_list = [];
for (const [_, command] of command_name_map) {
  command_data_list.push(command.data);
}
client.once("ready", async () => {
  try {
    console.log(`Logged in as ${client.user?.tag ?? "[APP]"}`);
    console.log("Registering commands:", command_data_list.map((data) => data.name));
    const guilds = await client.guilds.fetch();
    console.log(`for ${guilds.size} guilds...`);
    for (const [_, guild] of guilds) {
      try {
        const existingCommands = await rest.get(Routes.applicationGuildCommands(getClientID(), guild.id));
        for (const command of existingCommands) {
          if (command_name_map.has(command.name) === false) {
            try {
              ConsoleLog(`Deleting command [${command.id}] for guild [${guild.id}]`);
              await rest.delete(Routes.applicationGuildCommand(getClientID(), guild.id, command.id));
              ConsoleLog("Success");
            } catch (error) {
              ConsoleError(`Error deleting command [${command.id}] for guild [${guild.id}]:`, error);
            }
            await Sleep(delay);
          }
        }
        ConsoleLog(`Registering commands for guild [${guild.id}]`);
        await rest.put(Routes.applicationGuildCommands(getClientID(), guild.id), { body: command_data_list });
        ConsoleLog("Success");
      } catch (error) {
        ConsoleError(`Error registering commands for guild [${guild.id}]:`, error);
      }
      await Sleep(delay);
    }
    console.log("Finished registering commands for all guilds!");
  } catch (error) {
    console.error("Error fetching guilds:", error);
  } finally {
    client.destroy();
  }
});
client.login(getBotToken());
