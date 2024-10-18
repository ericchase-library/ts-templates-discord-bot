import type { Command } from 'src/commands/Command.js';
import { ping } from 'src/commands/Community/ping.js';
import { server_icon } from 'src/commands/Community/server-icon.js';
import { server_info } from 'src/commands/Community/server-info.js';
import { user_avatar } from 'src/commands/Community/user-avatar.js';
import { user_info } from 'src/commands/Community/user-info.js';
import { verify } from 'src/commands/Moderation/verify.js';

const enabled_commands = [
  //
  ping,
  server_icon,
  server_info,
  user_avatar,
  user_info,
  verify,
];

export const command_name_map = new Map<string, Command>();
for (const command of enabled_commands) {
  command_name_map.set(command.name, command);
}
