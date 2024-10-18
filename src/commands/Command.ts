import { ConsoleError } from 'lib/ericchase/Utility/Console.js';
import type { Interaction, SlashCommandOptionsOnlyBuilder } from 'src/discord/discord.module.js';

export type Command = {
  name: string;
  data: SlashCommandOptionsOnlyBuilder;
  execute(interaction: Interaction): Promise<void>;
};

export async function HandleCommandError(error: any, interaction: Interaction) {
  ConsoleError(error);
  if (interaction.isChatInputCommand()) {
    await interaction.reply({
      content: 'Oops! Something went wrong while processing your request. Please try again later.',
      ephemeral: true,
    });
  }
}
