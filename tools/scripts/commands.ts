import { RunSync } from 'lib/ericchase/Platform/Bun/Child Process.js';
import { out_dir } from 'tools/scripts/build.js';

switch (Bun.argv[2]) {
  case 'register':
    RunSync.Bun(out_dir.appendSegment('commands-register.module.js').path);
    break;
  case 'unregister':
    RunSync.Bun(out_dir.appendSegment('commands-unregister.module.js').path);
    break;
  default:
    RunSync.Bun(out_dir.appendSegment('commands-list.module.js').path);
    break;
}
