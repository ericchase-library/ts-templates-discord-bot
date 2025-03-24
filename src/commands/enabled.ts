import { Command } from './Command.js';
import { command_ping } from './Community/ping.js';
import { command_server_icon } from './Community/server-icon.js';
import { command_server_info } from './Community/server-info.js';
import { command_user_avatar } from './Community/user-avatar.js';
import { command_user_check_troll } from './Community/User-Check-Troll.js';
import { command_user_info } from './Community/user-info.js';
import { command_verify } from './Moderation/verify.js';

const enabled_commands = [
  command_ping,
  command_server_icon,
  command_server_info,
  command_user_avatar,
  command_user_check_troll,
  command_user_info,
  command_verify,
  //
];

export const command_name_map = new Map<string, Command>();
for (const command of enabled_commands) {
  command_name_map.set(command.name, command);
}
