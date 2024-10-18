import { getBotToken } from 'lib/env.js';
import { ConsoleError, ConsoleLog } from 'lib/ericchase/Utility/Console.js';
import { command_name_map } from 'src/commands/setup.js';
import { Client, GatewayIntentBits, type Interaction } from 'src/discord/discord.module.js';

// Client Events
// {
//   ApplicationCommandPermissionsUpdate: "applicationCommandPermissionsUpdate",
//   AutoModerationActionExecution: "autoModerationActionExecution",
//   AutoModerationRuleCreate: "autoModerationRuleCreate",
//   AutoModerationRuleDelete: "autoModerationRuleDelete",
//   AutoModerationRuleUpdate: "autoModerationRuleUpdate",
//   CacheSweep: "cacheSweep",
//   ChannelCreate: "channelCreate",
//   ChannelDelete: "channelDelete",
//   ChannelPinsUpdate: "channelPinsUpdate",
//   ChannelUpdate: "channelUpdate",
//   ClientReady: "clientReady",
//   Debug: "debug",
//   EntitlementCreate: "entitlementCreate",
//   EntitlementUpdate: "entitlementUpdate",
//   EntitlementDelete: "entitlementDelete",
//   Error: "error",
//   GuildAuditLogEntryCreate: "guildAuditLogEntryCreate",
//   GuildAvailable: "guildAvailable",
//   GuildBanAdd: "guildBanAdd",
//   GuildBanRemove: "guildBanRemove",
//   GuildCreate: "guildCreate",
//   GuildDelete: "guildDelete",
//   GuildEmojiCreate: "emojiCreate",
//   GuildEmojiDelete: "emojiDelete",
//   GuildEmojiUpdate: "emojiUpdate",
//   GuildIntegrationsUpdate: "guildIntegrationsUpdate",
//   GuildMemberAdd: "guildMemberAdd",
//   GuildMemberAvailable: "guildMemberAvailable",
//   GuildMemberRemove: "guildMemberRemove",
//   GuildMembersChunk: "guildMembersChunk",
//   GuildMemberUpdate: "guildMemberUpdate",
//   GuildRoleCreate: "roleCreate",
//   GuildRoleDelete: "roleDelete",
//   GuildRoleUpdate: "roleUpdate",
//   GuildScheduledEventCreate: "guildScheduledEventCreate",
//   GuildScheduledEventDelete: "guildScheduledEventDelete",
//   GuildScheduledEventUpdate: "guildScheduledEventUpdate",
//   GuildScheduledEventUserAdd: "guildScheduledEventUserAdd",
//   GuildScheduledEventUserRemove: "guildScheduledEventUserRemove",
//   GuildStickerCreate: "stickerCreate",
//   GuildStickerDelete: "stickerDelete",
//   GuildStickerUpdate: "stickerUpdate",
//   GuildUnavailable: "guildUnavailable",
//   GuildUpdate: "guildUpdate",
//   InteractionCreate: "interactionCreate",
//   Invalidated: "invalidated",
//   InviteCreate: "inviteCreate",
//   InviteDelete: "inviteDelete",
//   MessageBulkDelete: "messageDeleteBulk",
//   MessageCreate: "messageCreate",
//   MessageDelete: "messageDelete",
//   MessagePollVoteAdd: "messagePollVoteAdd",
//   MessagePollVoteRemove: "messagePollVoteRemove",
//   MessageReactionAdd: "messageReactionAdd",
//   MessageReactionRemove: "messageReactionRemove",
//   MessageReactionRemoveAll: "messageReactionRemoveAll",
//   MessageReactionRemoveEmoji: "messageReactionRemoveEmoji",
//   MessageUpdate: "messageUpdate",
//   PresenceUpdate: "presenceUpdate",
//   StageInstanceCreate: "stageInstanceCreate",
//   StageInstanceDelete: "stageInstanceDelete",
//   StageInstanceUpdate: "stageInstanceUpdate",
//   ThreadCreate: "threadCreate",
//   ThreadDelete: "threadDelete",
//   ThreadListSync: "threadListSync",
//   ThreadMembersUpdate: "threadMembersUpdate",
//   ThreadMemberUpdate: "threadMemberUpdate",
//   ThreadUpdate: "threadUpdate",
//   TypingStart: "typingStart",
//   UserUpdate: "userUpdate",
//   VoiceServerUpdate: "voiceServerUpdate",
//   VoiceStateUpdate: "voiceStateUpdate",
//   Warn: "warn",
//   WebhooksUpdate: "webhooksUpdate",
// }

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// client.on('debug', (message) => {
//   console.log('debug:', message);
// });

client.once('clientReady', () => {
  ConsoleLog('Bot is online.');
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (interaction.isCommand()) {
    const command = command_name_map.get(interaction.commandName);
    if (command !== undefined) {
      try {
        const user = getUser(interaction);
        ConsoleLog(`${user} is executing command "${command.name}".`);
        await command.execute(interaction);
      } catch (error) {
        ConsoleError(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
});

ConsoleLog('Attempting to log in.');
client.login(getBotToken());

function getUser(interaction: Interaction) {
  if (interaction.isCommand()) {
    let user = undefined;
    if ('getUser' in interaction.options) {
      user = interaction.options.getUser('user');
    }
    user = user ?? interaction.user;
    return `${user.displayName} [${user.id}]`;
  }
}
