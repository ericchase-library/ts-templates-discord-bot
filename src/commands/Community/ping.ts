import { Command, HandleCommandError } from 'src/commands/Command.js';
import { Interaction, SlashCommandBuilder } from 'src/external/discord/discord.module.js';
import { ConsoleError } from 'src/lib/ericchase/Utility/Console.js';

const name = 'ping';
export const command_ping: Command = {
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
