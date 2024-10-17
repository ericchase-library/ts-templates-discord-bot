import type { Interaction } from 'discord.js';

export { ActionRowBuilder, ApplicationCommand, ButtonBuilder, ButtonStyle, ChannelType, Client, Collection, EmbedBuilder, GatewayIntentBits, GuildMember, Partials, PermissionsBitField, REST, Routes, SlashCommandBuilder } from 'discord.js';
export type { Interaction, SlashCommandOptionsOnlyBuilder } from 'discord.js';
export type CommandExecuteFunction = (interaction: Interaction) => Promise<void>;
