import { Interaction, SlashCommandBuilder } from '../../external/discord/discord.module.js';
import { Core_Console_Error } from '../../lib/ericchase/Core_Console_Error.js';
import { Command, HandleCommandError } from '../Command.js';

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
        Core_Console_Error('unexpected', interaction);
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  },
};
