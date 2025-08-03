import { command_name_map } from './commands/enabled.js';
import { Client, Events, GatewayIntentBits, GuildMember, Interaction } from './external/discord/discord.module.js';
import { Core_Console_Error } from './lib/ericchase/Core_Console_Error.js';
import { Core_Console_Log } from './lib/ericchase/Core_Console_Log.js';
import { getBotToken } from './lib/lib.env.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

if (process.env.DEBUG === '1') {
  client.on(Events.Debug, (message) => {
    console.log('debug:', message);
  });
}

client.once(Events.ClientReady, () => {
  Core_Console_Log('Bot is online.');
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (interaction.isCommand()) {
    const command = command_name_map.get(interaction.commandName);
    if (command !== undefined) {
      try {
        if (interaction.member instanceof GuildMember) {
          Core_Console_Log(`${interaction.member.displayName} (${interaction.member?.user.username}) is executing command "${command.name}".`);
        } else {
          Core_Console_Log(`${interaction.member?.user.username} is executing command "${command.name}".`);
        }
        await command.execute(interaction);
      } catch (error) {
        Core_Console_Error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
});

Core_Console_Log('Attempting to log in.');
client.login(getBotToken());
