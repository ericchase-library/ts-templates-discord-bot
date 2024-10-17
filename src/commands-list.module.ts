import { getBotToken, getClientID } from 'lib/env.js';
import { ConsoleError, ConsoleLog } from 'lib/ericchase/Utility/Console.js';
import { type ApplicationCommand, REST, Routes } from 'src/discord/discord.module.js';

const rest = new REST({ version: '10' }).setToken(getBotToken());

async function getCommands() {
  try {
    const commands = await rest.get(Routes.applicationCommands(getClientID()));
    for (const command of commands as ApplicationCommand[]) {
      ConsoleLog(`Command Name: ${command.name}, Command ID: ${command.id}`);
    }
  } catch (error) {
    ConsoleError('Failed to fetch commands:', error);
  }
}
getCommands();
