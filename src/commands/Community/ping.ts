import { ConsoleError } from 'lib/ericchase/Utility/Console.js';
import { HandleCommandError } from 'src/commands/Command.js';
import { SlashCommandBuilder, type Interaction } from 'src/discord/discord.module.js';

const name = 'ping';

export const ping = {
  name,

  // Command Builder
  data: new SlashCommandBuilder() //
    .setName(name)
    .setDescription('Replies with Pong!'),

  // Execute Function
  async execute(interaction: Interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        await interaction.reply('Pong!');
      } else {
        ConsoleError('unexpected', interaction);
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  },
};
