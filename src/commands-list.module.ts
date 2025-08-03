import { ApplicationCommand, REST, Routes } from './external/discord/discord.module.js';
import { Core_Console_Error } from './lib/ericchase/Core_Console_Error.js';
import { Core_Console_Log } from './lib/ericchase/Core_Console_Log.js';
import { getBotToken, getClientID } from './lib/lib.env.js';

const rest = new REST({ version: '10' }).setToken(getBotToken());

async function getCommands() {
  try {
    Core_Console_Log('Fetching global commands.');
    const commands = (await rest.get(Routes.applicationCommands(getClientID()))) as ApplicationCommand[];
    if (commands.length === 0) {
      Core_Console_Log('No global commands registered.');
    } else {
      for (const command of commands) {
        Core_Console_Log(`Command Name: ${command.name}, Command ID: ${command.id}`);
      }
    }
  } catch (error) {
    Core_Console_Error('Failed to fetch commands:', error);
  }
}

getCommands();
