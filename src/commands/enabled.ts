import { Command } from 'src/commands/Command.js';
import { command_ping } from 'src/commands/Community/ping.js';
import { command_server_icon } from 'src/commands/Community/server-icon.js';
import { command_server_info } from 'src/commands/Community/server-info.js';
import { command_user_avatar } from 'src/commands/Community/user-avatar.js';
import { command_user_check_troll } from 'src/commands/Community/User-Check-Troll.js';
import { command_user_info } from 'src/commands/Community/user-info.js';
import { command_verify } from 'src/commands/Moderation/verify.js';

const enabled_commands = [
  //
  command_ping,
  command_server_icon,
  command_server_info,
  command_user_avatar,
  command_user_check_troll,
  command_user_info,
  command_verify,
];

export const command_name_map = new Map<string, Command>();
for (const command of enabled_commands) {
  command_name_map.set(command.name, command);
}
