// import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from 'src/discord/discord.module.js';

// module.exports = {
//   data: new SlashCommandBuilder().setName('verify2').setDescription('This is the description message.'),
//   async execute(interaction, client) {
//     console.log('verfiy2');
//     console.log(interaction);

//     if (!interaction.member.permission.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You must be an admin to create a verification message.', ephemeral: true });

//     const button = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('button').setEmoji('✅').setLabel('Verify').setStyle(ButtonStyle.Success));

//     const embed = new EmbedBuilder().setColor('Blue').setTitle('Server Verification').setDescription(`Click te button below to verify yourself within the server.`);

//     await interaction.reply({ embeds: [embed], components: [button] });

//     const collector = await interaction.channel.createMessageComponentCollector();

//     collector.on('collect', async (i) => {
//       await i.update({ embeds: [embed], components: [button] });

//       const role = interaction.guild.roles.cache.find((r) => r.name === 'Verified');

//       const member = i.member;

//       member.roles.add(role);

//       i.user.send(`You are now verified within **${i.guild.name}**`).catch((err) => {
//         return;
//       });
//     });
//   },
// };
