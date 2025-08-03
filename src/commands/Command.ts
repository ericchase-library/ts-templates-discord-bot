import { Interaction, SlashCommandOptionsOnlyBuilder } from '../external/discord/discord.module.js';
import { Core_Console_Error } from '../lib/ericchase/Core_Console_Error.js';

export type Command = {
  name: string;
  data: SlashCommandOptionsOnlyBuilder;
  execute(interaction: Interaction): Promise<void>;
};

export async function HandleCommandError(error: any, interaction: Interaction) {
  Core_Console_Error(error);
  if (interaction.isChatInputCommand()) {
    await interaction.reply({
      content: 'Oops! Something went wrong while processing your request. Please try again later.',
      ephemeral: true,
    });
  }
}
