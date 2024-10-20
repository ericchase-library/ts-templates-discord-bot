import { ConsoleError, ConsoleLog } from 'lib/ericchase/Utility/Console.js';
import { getBotToken } from 'lib/lib.env.js';
import { command_name_map } from 'src/commands/enabled.js';
import { Client, Events, GatewayIntentBits, GuildMember, type Interaction } from 'src/discord/discord.module.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

if (process.env.DEBUG === '1') {
  client.on(Events.Debug, (message) => {
    console.log('debug:', message);
  });
}

client.once(Events.ClientReady, () => {
  ConsoleLog('Bot is online.');
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (interaction.isCommand()) {
    const command = command_name_map.get(interaction.commandName);
    if (command !== undefined) {
      try {
        if (interaction.member instanceof GuildMember) {
          ConsoleLog(`${interaction.member.displayName} (${interaction.member?.user.username}) is executing command "${command.name}".`);
        } else {
          ConsoleLog(`${interaction.member?.user.username} is executing command "${command.name}".`);
        }
        await command.execute(interaction);
      } catch (error) {
        ConsoleError(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
});

ConsoleLog('Attempting to log in.');
client.login(getBotToken());
