import { ConsoleError } from 'lib/ericchase/Utility/Console.js';
import { HandleCommandError } from 'src/commands/Command.js';
import { EmbedBuilder, SlashCommandBuilder, type GuildMember, type Interaction } from 'src/discord/discord.module.js';

const name = 'avatar';

export const avatar = {
  name,

  // Command Builder
  data: new SlashCommandBuilder() //
    .setName(name)
    .setDescription('Get your avatar or the Avatar from someone else')
    .addUserOption((option) =>
      option
        .setName('user') //
        .setDescription('The User you want to Avatar from')
        .setRequired(false),
    ),

  // Execute Function
  async execute(interaction: Interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const user = interaction.options.getUser('user') ?? interaction.user;
        if (interaction.guild) {
          const member = (await interaction.guild.members.fetch(user.id)) as GuildMember;
          const avatar = user.displayAvatarURL();
          const color = member.displayHexColor ?? 'Blue';
          const Embed = new EmbedBuilder().setColor(color).setTitle(`Here is ${user.username}'s Avatar`).setImage(avatar);
          await interaction.reply({ embeds: [Embed], ephemeral: false });
        } else {
          const avatar = user.displayAvatarURL();
          const color = 'Blue';
          const Embed = new EmbedBuilder().setColor(color).setTitle(`Here is ${user.username}'s Avatar`).setImage(avatar);
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
