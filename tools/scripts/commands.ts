import { RunSync } from 'lib/ericchase/Platform/Bun/Child Process.js';
import { src_dir } from 'tools/scripts/build.js';

switch (Bun.argv[2]) {
  case 'ls':
  case 'list':
    RunSync.Bun(src_dir.appendSegment('commands-list.module.ts').path);
    break;
  case 'unregister':
    RunSync.Bun(src_dir.appendSegment('commands-unregister.module.ts').path);
    break;
  default:
    RunSync.Bun(src_dir.appendSegment('commands-register.module.ts').path);
    break;
}
