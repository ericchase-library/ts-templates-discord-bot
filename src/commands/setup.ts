import type { Command } from 'src/commands/Command.js';
import { avatar } from 'src/commands/Community/avatar.js';
import { ping } from 'src/commands/Community/ping.js';
import { serverIcon } from 'src/commands/Community/server-icon.js';

const enabled_commands = [avatar, ping, serverIcon];

export const command_name_map = new Map<string, Command>();
for (const command of enabled_commands) {
  command_name_map.set(command.name, command);
}
