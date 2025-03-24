import { describe, expect, test } from 'bun:test';
import { Events } from './discord.module.js';

describe('Discord.Events', () => {
  test('ApplicationCommandPermissionsUpdate', () => {
    const key = 'ApplicationCommandPermissionsUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.ApplicationCommandPermissionsUpdate as string).toBe('applicationCommandPermissionsUpdate');
  });
  test('AutoModerationActionExecution', () => {
    const key = 'AutoModerationActionExecution';
    expect(key in Events).toBeTrue();
    expect(Events.AutoModerationActionExecution as string).toBe('autoModerationActionExecution');
  });
  test('AutoModerationRuleCreate', () => {
    const key = 'AutoModerationRuleCreate';
    expect(key in Events).toBeTrue();
    expect(Events.AutoModerationRuleCreate as string).toBe('autoModerationRuleCreate');
  });
  test('AutoModerationRuleDelete', () => {
    const key = 'AutoModerationRuleDelete';
    expect(key in Events).toBeTrue();
    expect(Events.AutoModerationRuleDelete as string).toBe('autoModerationRuleDelete');
  });
  test('AutoModerationRuleUpdate', () => {
    const key = 'AutoModerationRuleUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.AutoModerationRuleUpdate as string).toBe('autoModerationRuleUpdate');
  });
  test('CacheSweep', () => {
    const key = 'CacheSweep';
    expect(key in Events).toBeTrue();
    expect(Events.CacheSweep as string).toBe('cacheSweep');
  });
  test('ChannelCreate', () => {
    const key = 'ChannelCreate';
    expect(key in Events).toBeTrue();
    expect(Events.ChannelCreate as string).toBe('channelCreate');
  });
  test('ChannelDelete', () => {
    const key = 'ChannelDelete';
    expect(key in Events).toBeTrue();
    expect(Events.ChannelDelete as string).toBe('channelDelete');
  });
  test('ChannelPinsUpdate', () => {
    const key = 'ChannelPinsUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.ChannelPinsUpdate as string).toBe('channelPinsUpdate');
  });
  test('ChannelUpdate', () => {
    const key = 'ChannelUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.ChannelUpdate as string).toBe('channelUpdate');
  });
  test('ClientReady', () => {
    const key = 'ClientReady';
    expect(key in Events).toBeTrue();
    expect(Events.ClientReady as string).toBe('clientReady');
  });
  test('Debug', () => {
    const key = 'Debug';
    expect(key in Events).toBeTrue();
    expect(Events.Debug as string).toBe('debug');
  });
  test('EntitlementCreate', () => {
    const key = 'EntitlementCreate';
    expect(key in Events).toBeTrue();
    expect(Events.EntitlementCreate as string).toBe('entitlementCreate');
  });
  test('EntitlementUpdate', () => {
    const key = 'EntitlementUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.EntitlementUpdate as string).toBe('entitlementUpdate');
  });
  test('EntitlementDelete', () => {
    const key = 'EntitlementDelete';
    expect(key in Events).toBeTrue();
    expect(Events.EntitlementDelete as string).toBe('entitlementDelete');
  });
  test('Error', () => {
    const key = 'Error';
    expect(key in Events).toBeTrue();
    expect(Events.Error as string).toBe('error');
  });
  test('GuildAuditLogEntryCreate', () => {
    const key = 'GuildAuditLogEntryCreate';
    expect(key in Events).toBeTrue();
    expect(Events.GuildAuditLogEntryCreate as string).toBe('guildAuditLogEntryCreate');
  });
  test('GuildAvailable', () => {
    const key = 'GuildAvailable';
    expect(key in Events).toBeTrue();
    expect(Events.GuildAvailable as string).toBe('guildAvailable');
  });
  test('GuildBanAdd', () => {
    const key = 'GuildBanAdd';
    expect(key in Events).toBeTrue();
    expect(Events.GuildBanAdd as string).toBe('guildBanAdd');
  });
  test('GuildBanRemove', () => {
    const key = 'GuildBanRemove';
    expect(key in Events).toBeTrue();
    expect(Events.GuildBanRemove as string).toBe('guildBanRemove');
  });
  test('GuildCreate', () => {
    const key = 'GuildCreate';
    expect(key in Events).toBeTrue();
    expect(Events.GuildCreate as string).toBe('guildCreate');
  });
  test('GuildDelete', () => {
    const key = 'GuildDelete';
    expect(key in Events).toBeTrue();
    expect(Events.GuildDelete as string).toBe('guildDelete');
  });
  test('GuildEmojiCreate', () => {
    const key = 'GuildEmojiCreate';
    expect(key in Events).toBeTrue();
    expect(Events.GuildEmojiCreate as string).toBe('emojiCreate');
  });
  test('GuildEmojiDelete', () => {
    const key = 'GuildEmojiDelete';
    expect(key in Events).toBeTrue();
    expect(Events.GuildEmojiDelete as string).toBe('emojiDelete');
  });
  test('GuildEmojiUpdate', () => {
    const key = 'GuildEmojiUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.GuildEmojiUpdate as string).toBe('emojiUpdate');
  });
  test('GuildIntegrationsUpdate', () => {
    const key = 'GuildIntegrationsUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.GuildIntegrationsUpdate as string).toBe('guildIntegrationsUpdate');
  });
  test('GuildMemberAdd', () => {
    const key = 'GuildMemberAdd';
    expect(key in Events).toBeTrue();
    expect(Events.GuildMemberAdd as string).toBe('guildMemberAdd');
  });
  test('GuildMemberAvailable', () => {
    const key = 'GuildMemberAvailable';
    expect(key in Events).toBeTrue();
    expect(Events.GuildMemberAvailable as string).toBe('guildMemberAvailable');
  });
  test('GuildMemberRemove', () => {
    const key = 'GuildMemberRemove';
    expect(key in Events).toBeTrue();
    expect(Events.GuildMemberRemove as string).toBe('guildMemberRemove');
  });
  test('GuildMembersChunk', () => {
    const key = 'GuildMembersChunk';
    expect(key in Events).toBeTrue();
    expect(Events.GuildMembersChunk as string).toBe('guildMembersChunk');
  });
  test('GuildMemberUpdate', () => {
    const key = 'GuildMemberUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.GuildMemberUpdate as string).toBe('guildMemberUpdate');
  });
  test('GuildRoleCreate', () => {
    const key = 'GuildRoleCreate';
    expect(key in Events).toBeTrue();
    expect(Events.GuildRoleCreate as string).toBe('roleCreate');
  });
  test('GuildRoleDelete', () => {
    const key = 'GuildRoleDelete';
    expect(key in Events).toBeTrue();
    expect(Events.GuildRoleDelete as string).toBe('roleDelete');
  });
  test('GuildRoleUpdate', () => {
    const key = 'GuildRoleUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.GuildRoleUpdate as string).toBe('roleUpdate');
  });
  test('GuildScheduledEventCreate', () => {
    const key = 'GuildScheduledEventCreate';
    expect(key in Events).toBeTrue();
    expect(Events.GuildScheduledEventCreate as string).toBe('guildScheduledEventCreate');
  });
  test('GuildScheduledEventDelete', () => {
    const key = 'GuildScheduledEventDelete';
    expect(key in Events).toBeTrue();
    expect(Events.GuildScheduledEventDelete as string).toBe('guildScheduledEventDelete');
  });
  test('GuildScheduledEventUpdate', () => {
    const key = 'GuildScheduledEventUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.GuildScheduledEventUpdate as string).toBe('guildScheduledEventUpdate');
  });
  test('GuildScheduledEventUserAdd', () => {
    const key = 'GuildScheduledEventUserAdd';
    expect(key in Events).toBeTrue();
    expect(Events.GuildScheduledEventUserAdd as string).toBe('guildScheduledEventUserAdd');
  });
  test('GuildScheduledEventUserRemove', () => {
    const key = 'GuildScheduledEventUserRemove';
    expect(key in Events).toBeTrue();
    expect(Events.GuildScheduledEventUserRemove as string).toBe('guildScheduledEventUserRemove');
  });
  test('GuildStickerCreate', () => {
    const key = 'GuildStickerCreate';
    expect(key in Events).toBeTrue();
    expect(Events.GuildStickerCreate as string).toBe('stickerCreate');
  });
  test('GuildStickerDelete', () => {
    const key = 'GuildStickerDelete';
    expect(key in Events).toBeTrue();
    expect(Events.GuildStickerDelete as string).toBe('stickerDelete');
  });
  test('GuildStickerUpdate', () => {
    const key = 'GuildStickerUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.GuildStickerUpdate as string).toBe('stickerUpdate');
  });
  test('GuildUnavailable', () => {
    const key = 'GuildUnavailable';
    expect(key in Events).toBeTrue();
    expect(Events.GuildUnavailable as string).toBe('guildUnavailable');
  });
  test('GuildUpdate', () => {
    const key = 'GuildUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.GuildUpdate as string).toBe('guildUpdate');
  });
  test('InteractionCreate', () => {
    const key = 'InteractionCreate';
    expect(key in Events).toBeTrue();
    expect(Events.InteractionCreate as string).toBe('interactionCreate');
  });
  test('Invalidated', () => {
    const key = 'Invalidated';
    expect(key in Events).toBeTrue();
    expect(Events.Invalidated as string).toBe('invalidated');
  });
  test('InviteCreate', () => {
    const key = 'InviteCreate';
    expect(key in Events).toBeTrue();
    expect(Events.InviteCreate as string).toBe('inviteCreate');
  });
  test('InviteDelete', () => {
    const key = 'InviteDelete';
    expect(key in Events).toBeTrue();
    expect(Events.InviteDelete as string).toBe('inviteDelete');
  });
  test('MessageBulkDelete', () => {
    const key = 'MessageBulkDelete';
    expect(key in Events).toBeTrue();
    expect(Events.MessageBulkDelete as string).toBe('messageDeleteBulk');
  });
  test('MessageCreate', () => {
    const key = 'MessageCreate';
    expect(key in Events).toBeTrue();
    expect(Events.MessageCreate as string).toBe('messageCreate');
  });
  test('MessageDelete', () => {
    const key = 'MessageDelete';
    expect(key in Events).toBeTrue();
    expect(Events.MessageDelete as string).toBe('messageDelete');
  });
  test('MessagePollVoteAdd', () => {
    const key = 'MessagePollVoteAdd';
    expect(key in Events).toBeTrue();
    expect(Events.MessagePollVoteAdd as string).toBe('messagePollVoteAdd');
  });
  test('MessagePollVoteRemove', () => {
    const key = 'MessagePollVoteRemove';
    expect(key in Events).toBeTrue();
    expect(Events.MessagePollVoteRemove as string).toBe('messagePollVoteRemove');
  });
  test('MessageReactionAdd', () => {
    const key = 'MessageReactionAdd';
    expect(key in Events).toBeTrue();
    expect(Events.MessageReactionAdd as string).toBe('messageReactionAdd');
  });
  test('MessageReactionRemove', () => {
    const key = 'MessageReactionRemove';
    expect(key in Events).toBeTrue();
    expect(Events.MessageReactionRemove as string).toBe('messageReactionRemove');
  });
  test('MessageReactionRemoveAll', () => {
    const key = 'MessageReactionRemoveAll';
    expect(key in Events).toBeTrue();
    expect(Events.MessageReactionRemoveAll as string).toBe('messageReactionRemoveAll');
  });
  test('MessageReactionRemoveEmoji', () => {
    const key = 'MessageReactionRemoveEmoji';
    expect(key in Events).toBeTrue();
    expect(Events.MessageReactionRemoveEmoji as string).toBe('messageReactionRemoveEmoji');
  });
  test('MessageUpdate', () => {
    const key = 'MessageUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.MessageUpdate as string).toBe('messageUpdate');
  });
  test('PresenceUpdate', () => {
    const key = 'PresenceUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.PresenceUpdate as string).toBe('presenceUpdate');
  });
  test('StageInstanceCreate', () => {
    const key = 'StageInstanceCreate';
    expect(key in Events).toBeTrue();
    expect(Events.StageInstanceCreate as string).toBe('stageInstanceCreate');
  });
  test('StageInstanceDelete', () => {
    const key = 'StageInstanceDelete';
    expect(key in Events).toBeTrue();
    expect(Events.StageInstanceDelete as string).toBe('stageInstanceDelete');
  });
  test('StageInstanceUpdate', () => {
    const key = 'StageInstanceUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.StageInstanceUpdate as string).toBe('stageInstanceUpdate');
  });
  test('ThreadCreate', () => {
    const key = 'ThreadCreate';
    expect(key in Events).toBeTrue();
    expect(Events.ThreadCreate as string).toBe('threadCreate');
  });
  test('ThreadDelete', () => {
    const key = 'ThreadDelete';
    expect(key in Events).toBeTrue();
    expect(Events.ThreadDelete as string).toBe('threadDelete');
  });
  test('ThreadListSync', () => {
    const key = 'ThreadListSync';
    expect(key in Events).toBeTrue();
    expect(Events.ThreadListSync as string).toBe('threadListSync');
  });
  test('ThreadMembersUpdate', () => {
    const key = 'ThreadMembersUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.ThreadMembersUpdate as string).toBe('threadMembersUpdate');
  });
  test('ThreadMemberUpdate', () => {
    const key = 'ThreadMemberUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.ThreadMemberUpdate as string).toBe('threadMemberUpdate');
  });
  test('ThreadUpdate', () => {
    const key = 'ThreadUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.ThreadUpdate as string).toBe('threadUpdate');
  });
  test('TypingStart', () => {
    const key = 'TypingStart';
    expect(key in Events).toBeTrue();
    expect(Events.TypingStart as string).toBe('typingStart');
  });
  test('UserUpdate', () => {
    const key = 'UserUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.UserUpdate as string).toBe('userUpdate');
  });
  test('VoiceServerUpdate', () => {
    const key = 'VoiceServerUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.VoiceServerUpdate as string).toBe('voiceServerUpdate');
  });
  test('VoiceStateUpdate', () => {
    const key = 'VoiceStateUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.VoiceStateUpdate as string).toBe('voiceStateUpdate');
  });
  test('Warn', () => {
    const key = 'Warn';
    expect(key in Events).toBeTrue();
    expect(Events.Warn as string).toBe('warn');
  });
  test('WebhooksUpdate', () => {
    const key = 'WebhooksUpdate';
    expect(key in Events).toBeTrue();
    expect(Events.WebhooksUpdate as string).toBe('webhooksUpdate');
  });
});
