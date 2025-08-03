import { EmbedBuilder, GuildMember, Interaction, SlashCommandBuilder } from '../../external/discord/discord.module.js';
import { Core_Console_Error } from '../../lib/ericchase/Core_Console_Error.js';
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

          await interaction.reply({ embeds: [Embed] });
        } else {
          const avatar = target_user.displayAvatarURL();
          const color = 'Blue';
          const Embed = new EmbedBuilder().setColor(color).setTitle(`Here is ${target_user.username}'s Avatar`).setImage(avatar);

          await interaction.reply({ embeds: [Embed] });
        }
      } else {
        Core_Console_Error('unexpected', interaction);
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  },
};
