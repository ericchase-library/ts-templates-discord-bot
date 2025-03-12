// @bun
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
import { SlashCommandBuilder } from "..\external\discord\discord.module.js";
var name = "ping";
var command_ping = {
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

// src/commands/enabled.ts
var enabled_commands = [
  command_ping
];
var command_name_map = new Map;
for (const command of enabled_commands) {
  command_name_map.set(command.name, command);
}

// src/client.module.ts
import { Client, Events, GatewayIntentBits, GuildMember } from "..\external\discord\discord.module.js";

// src/lib/lib.env.ts
function getVariable(key) {
  if (process.env[key] === undefined || process.env[key] === "") {
    throw new Error(`.env '${key}' is undefined`);
  }
  return process.env[key];
}
function getBotToken() {
  return getVariable("BOT_TOKEN");
}

// src/client.module.ts
var client = new Client({ intents: [GatewayIntentBits.Guilds] });
if (process.env.DEBUG === "1") {
  client.on(Events.Debug, (message) => {
    console.log("debug:", message);
  });
}
client.once(Events.ClientReady, () => {
  ConsoleLog("Bot is online.");
});
client.on(Events.InteractionCreate, async (interaction) => {
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
