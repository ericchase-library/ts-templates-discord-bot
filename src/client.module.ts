import { getBotToken } from 'lib/env.js';
import { ConsoleError, ConsoleLog } from 'lib/ericchase/Utility/Console.js';
import { command_name_map } from 'src/commands/setup.js';
import { Client, GatewayIntentBits, type Interaction } from 'src/discord/discord.module.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  ConsoleLog('Bot is online.');
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (interaction.isCommand()) {
    const command = command_name_map.get(interaction.commandName);
    if (command !== undefined) {
      try {
        const user = getUser(interaction);
        ConsoleLog(`${user} is executing command "${command.name}".`);
        await command.execute(interaction);
      } catch (error) {
        ConsoleError(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
});

client.login(getBotToken());

function getUser(interaction: Interaction) {
  if (interaction.isCommand()) {
    let user = undefined;
    if ('getUser' in interaction.options) {
      user = interaction.options.getUser('user');
    }
    user = user ?? interaction.user;
    return `${user.displayName} [${user.id}]`;
  }
}
