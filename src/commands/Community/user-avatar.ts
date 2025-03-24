import { EmbedBuilder, GuildMember, Interaction, SlashCommandBuilder } from '../../external/discord/discord.module.js';
import { ConsoleError } from '../../lib/ericchase/Utility/Console.js';
import { Command, HandleCommandError } from '../Command.js';

const name = 'useravatar';
export const command_user_avatar: Command = {
  name,

  // Command Builder
  data: new SlashCommandBuilder() //
    .setName(name)
    .setDescription('Get your avatar or the Avatar from someone else')
    .addUserOption((option) =>
      option //
        .setName('user')
        .setDescription('The User you want to Avatar from')
        .setRequired(false),
    ),

  // Execute Function
  async execute(interaction: Interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const target_user = interaction.options.getUser('user') ?? interaction.user;

        if (interaction.guild) {
          const member = (await interaction.guild.members.fetch(target_user.id)) as GuildMember;
          const avatar = target_user.displayAvatarURL();
          const color = member.displayHexColor ?? 'Blue';
          const Embed = new EmbedBuilder().setColor(color).setTitle(`Here is ${target_user.username}'s Avatar`).setImage(avatar);

          await interaction.reply({ embeds: [Embed], ephemeral: false });
        } else {
          const avatar = target_user.displayAvatarURL();
          const color = 'Blue';
          const Embed = new EmbedBuilder().setColor(color).setTitle(`Here is ${target_user.username}'s Avatar`).setImage(avatar);

          await interaction.reply({ embeds: [Embed], ephemeral: false });
        }
      } else {
        ConsoleError('unexpected', interaction);
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  },
};
