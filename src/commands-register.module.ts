import { getBotToken, getClientID } from 'lib/env.js';
import { ConsoleError, ConsoleLog } from 'lib/ericchase/Utility/Console.js';
import { Sleep } from 'lib/ericchase/Utility/Sleep.js';
import { command_name_map } from 'src/commands/setup.js';
import { Client, GatewayIntentBits, REST, Routes, type ApplicationCommand, type SlashCommandOptionsOnlyBuilder } from 'src/discord/discord.module.js';

const rest = new REST({ version: '10' }).setToken(getBotToken());
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const delay = 500; // restricted to 200 route calls per 60 seconds

const command_data_list: SlashCommandOptionsOnlyBuilder[] = [];
for (const [_, command] of command_name_map) {
  command_data_list.push(command.data);
}

client.once('ready', async () => {
  try {
    console.log(`Logged in as ${client.user?.tag ?? '[APP]'}`);
    console.log(
      'Registering commands:',
      command_data_list.map((data) => data.name),
    );
    const guilds = await client.guilds.fetch();
    console.log(`for ${guilds.size} guilds...`);
    for (const [_, guild] of guilds) {
      try {
        const existingCommands = await rest.get(Routes.applicationGuildCommands(getClientID(), guild.id));
        for (const command of existingCommands as ApplicationCommand[]) {
          if (command_name_map.has(command.name) === false) {
            try {
              ConsoleLog(`Deleting command [${command.id}] for guild [${guild.id}]`);
              await rest.delete(Routes.applicationGuildCommand(getClientID(), guild.id, command.id));
              ConsoleLog('Success');
            } catch (error) {
              ConsoleError(`Error deleting command [${command.id}] for guild [${guild.id}]:`, error);
            }
            await Sleep(delay);
          }
        }
        ConsoleLog(`Registering commands for guild [${guild.id}]`);
        await rest.put(Routes.applicationGuildCommands(getClientID(), guild.id), { body: command_data_list });
        ConsoleLog('Success');
      } catch (error) {
        ConsoleError(`Error registering commands for guild [${guild.id}]:`, error);
      }
      await Sleep(delay);
    }
    console.log('Finished registering commands for all guilds!');
  } catch (error) {
    console.error('Error fetching guilds:', error);
  } finally {
    client.destroy();
  }
});
client.login(getBotToken());
