import { REST, Routes } from 'src/external/discord/discord.module.js';
import { ConsoleError, ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';
import { getBotToken, getClientID } from 'src/lib/lib.env.js';

const rest = new REST({ version: '10' }).setToken(getBotToken());

async function unregisterCommand(command_id: string) {
  try {
    await rest.delete(Routes.applicationCommand(getClientID(), command_id));
    // await rest.delete(Routes.applicationGuildCommand(CLIENT_ID, guildId, commandId));
    ConsoleLog(`Successfully deleted command with ID: ${command_id}`);
  } catch (error) {
    ConsoleError('Failed to delete command:', error);
  }
}
// unregisterCommand();
