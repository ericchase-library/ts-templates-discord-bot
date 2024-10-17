import { getBotToken, getClientID } from 'lib/env.js';
import { REST, Routes } from 'src/discord/discord.module.js';

const rest = new REST({ version: '10' }).setToken(getBotToken());

async function unregisterCommand(command_id: string) {
  try {
    await rest.delete(Routes.applicationCommand(getClientID(), command_id));
    // await rest.delete(Routes.applicationGuildCommand(CLIENT_ID, guildId, commandId));
    console.log(`Successfully deleted command with ID: ${command_id}`);
  } catch (error) {
    console.error('Failed to delete command:', error);
  }
}
// unregisterCommand();
