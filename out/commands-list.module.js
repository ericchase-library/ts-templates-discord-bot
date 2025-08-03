// @bun
// src/commands-list.module.ts
import { REST, Routes } from "./external/discord/discord.module.js";

// src/lib/ericchase/Core_Console_Error.ts
function Core_Console_Error(...items) {
  console["error"](...items);
}

// src/lib/ericchase/Core_Console_Log.ts
function Core_Console_Log(...items) {
  console["log"](...items);
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
    Core_Console_Log("Fetching global commands.");
    const commands = await rest.get(Routes.applicationCommands(getClientID()));
    if (commands.length === 0) {
      Core_Console_Log("No global commands registered.");
    } else {
      for (const command of commands) {
        Core_Console_Log(`Command Name: ${command.name}, Command ID: ${command.id}`);
      }
    }
  } catch (error) {
    Core_Console_Error("Failed to fetch commands:", error);
  }
}
getCommands();

//# debugId=73972DE93528446164756E2164756E21
//# sourceMappingURL=commands-list.module.js.map
