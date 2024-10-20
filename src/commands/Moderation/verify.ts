import { ConsoleError } from 'lib/ericchase/Utility/Console.js';
import { getGuildMember, getUsernameString } from 'lib/lib.discord.module.js';
import { HandleCommandError, type Command } from 'src/commands/Command.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, type Interaction } from 'src/discord/discord.module.js';

const verification_role_name = 'Verified';

const name = 'verify';
export const command_verify: Command = {
  name,

  // Command Builder
  data: new SlashCommandBuilder() //
    .setName(name)
    .setDescription('Verify a member of the server.')
    .addUserOption((option) => option.setName('user').setDescription('The user to get info on').setRequired(true)),

  // Execute Function
  async execute(interaction: Interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const guild = interaction.guild ?? undefined;
        if (guild === undefined) {
          await interaction.reply({ content: 'Error: Failed to retrieve GUILD data.', ephemeral: true });
          return;
        }

        {
          const member = (await getGuildMember(interaction)) ?? undefined;
          if (member === undefined) {
            await interaction.reply({ content: 'Error: Failed to retrieve MEMBER data.', ephemeral: true });
            return;
          }
          if (member.permissions.has(PermissionsBitField.Flags.ModerateMembers) === false) {
            await interaction.reply({ content: 'Permissions Error: You must be a MODERATOR to create a verification message.', ephemeral: true });
            return;
          }
        }

        const target_user = interaction.options.getUser('user') ?? interaction.user;
        const target_member = await guild.members.fetch(target_user.id);
        const target_user_string = getUsernameString(target_user);

        const embed = new EmbedBuilder() //
          .setColor('Blue')
          .setTitle('Server Verification')
          .setDescription(`Click the button below to verify ${target_user_string} within the server.`);

        const button = new ActionRowBuilder<ButtonBuilder>() //
          .addComponents(
            new ButtonBuilder() //
              .setCustomId('button')
              .setEmoji('✅')
              .setLabel('Verify')
              .setStyle(ButtonStyle.Success),
          );

        const reply_message = await interaction.reply({
          embeds: [embed],
          components: [button],
          fetchReply: true,
        });

        const collector = reply_message.createMessageComponentCollector({});
        collector.on('collect', async (followup_interaction) => {
          const description = (() => {
            const role = guild.roles.cache.find((role) => role.name === verification_role_name);
            if (role) {
              target_member.roles.add(role);
              if (target_member.roles.cache.has(role.id)) {
                return `${target_user_string} is now verified!`;
              }
              return `Error: Roles for ${target_user_string} could not be updated.`;
            }
            return `Error: Failed to retrieve ROLE data. Does the role "${verification_role_name}" exist?`;
          })();
          embed.setDescription(description);
          await followup_interaction.update({ embeds: [embed], components: [] });
          collector.stop();
        });
      } else {
        ConsoleError('unexpected', interaction);
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  },
};
