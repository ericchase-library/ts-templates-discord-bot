import { Command } from 'src/commands/Command.js';
import { command_ping } from 'src/commands/Community/ping.js';

const enabled_commands = [
  //
  command_ping,
  // command_server_icon,
  // command_server_info,
  // command_user_avatar,
  // command_user_check_troll,
  // command_user_info,
  // command_verify,
];

export const command_name_map = new Map<string, Command>();
for (const command of enabled_commands) {
  command_name_map.set(command.name, command);
}
