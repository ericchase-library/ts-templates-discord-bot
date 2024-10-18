import { HandleCommandError } from 'src/commands/Command.js';
import { EmbedBuilder, SlashCommandBuilder, type Interaction } from 'src/discord/discord.module.js';

const name = 'server-icon';

export const server_icon = {
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
