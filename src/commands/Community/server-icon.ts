import { Command, HandleCommandError } from 'src/commands/Command.js';
import { EmbedBuilder, Interaction, SlashCommandBuilder } from 'src/external/discord/discord.module.js';

const name = 'servericon';
export const command_server_icon: Command = {
  name,

  // Command Builder
  data: new SlashCommandBuilder() //
    .setName(name)
    .setDescription('Get the Server Icon of this Server'),

  // Execute Function
  async execute(interaction: Interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        if (interaction.guild) {
          const icon = interaction.guild.iconURL();
          const name = interaction.guild.name;
          const embed = new EmbedBuilder().setColor('Green').setTitle(`${name}'s Icon`).setImage(icon);
          await interaction.reply({ embeds: [embed] });
        }
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  },
};
