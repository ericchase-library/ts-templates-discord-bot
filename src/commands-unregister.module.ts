import { REST, Routes } from './external/discord/discord.module.js';
import { Core_Console_Error } from './lib/ericchase/Core_Console_Error.js';
import { Core_Console_Log } from './lib/ericchase/Core_Console_Log.js';
import { getBotToken, getClientID } from './lib/lib.env.js';

const rest = new REST({ version: '10' }).setToken(getBotToken());

async function unregisterCommand(command_id: string) {
  try {
    await rest.delete(Routes.applicationCommand(getClientID(), command_id));
    // await rest.delete(Routes.applicationGuildCommand(CLIENT_ID, guildId, commandId));
    Core_Console_Log(`Successfully deleted command with ID: ${command_id}`);
  } catch (error) {
    Core_Console_Error('Failed to delete command:', error);
  }
}
// unregisterCommand();
