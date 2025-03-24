// @bun
// src/commands-list.module.ts
import { REST, Routes } from "./external/discord/discord.module.js";

// src/lib/ericchase/Utility/Console.ts
var newline_count = 0;
function ConsoleError(...items) {
  console["error"](...items);
  newline_count = 0;
}
function ConsoleLog(...items) {
  console["log"](...items);
  newline_count = 0;
}

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
function getClientID() {
  return getVariable("CLIENT_ID");
}

// src/commands-list.module.ts
var rest = new REST({ version: "10" }).setToken(getBotToken());
async function getCommands() {
  try {
    ConsoleLog("Fetching global commands.");
    const commands = await rest.get(Routes.applicationCommands(getClientID()));
    if (commands.length === 0) {
      ConsoleLog("No global commands registered.");
    } else {
      for (const command of commands) {
        ConsoleLog(`Command Name: ${command.name}, Command ID: ${command.id}`);
      }
    }
  } catch (error) {
    ConsoleError("Failed to fetch commands:", error);
  }
}
getCommands();
