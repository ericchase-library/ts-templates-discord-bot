import { RunSync } from 'lib/ericchase/Platform/Bun/Child Process.js';
import { ConsoleError } from 'lib/ericchase/Utility/Console.js';
import { out_dir, src_dir } from 'tools/scripts/build.js';

async function start() {
  try {
    switch (Bun.argv[2]) {
      case 'js':
        RunSync.Bun(out_dir.appendSegment('client.module.js').path);
        break;
      default:
        RunSync.Bun(src_dir.appendSegment('client.module.ts').path);
    }
  } catch (error) {
    ConsoleError(error);
  }
  setTimeout(start, 1000);
}
start();
