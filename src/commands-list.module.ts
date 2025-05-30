import { ApplicationCommand, REST, Routes } from './external/discord/discord.module.js';
import { ConsoleError, ConsoleLog } from './lib/ericchase/Utility/Console.js';
import { getBotToken, getClientID } from './lib/lib.env.js';

const rest = new REST({ version: '10' }).setToken(getBotToken());

async function getCommands() {
  try {
    ConsoleLog('Fetching global commands.');
    const commands = (await rest.get(Routes.applicationCommands(getClientID()))) as ApplicationCommand[];
    if (commands.length === 0) {
      ConsoleLog('No global commands registered.');
    } else {
      for (const command of commands) {
        ConsoleLog(`Command Name: ${command.name}, Command ID: ${command.id}`);
      }
    }
  } catch (error) {
    ConsoleError('Failed to fetch commands:', error);
  }
}

getCommands();
