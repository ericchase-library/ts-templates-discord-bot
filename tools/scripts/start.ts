import { RunSync } from 'lib/ericchase/Platform/Bun/Child Process.js';
import { out_dir, src_dir } from 'tools/scripts/build.js';

async function start() {
  switch (Bun.argv[2]) {
    case 'js':
      RunSync.Bun(out_dir.appendSegment('client.module.js').path);
      break;
    default:
      RunSync.Bun(src_dir.appendSegment('client.module.ts').path);
  }
  setTimeout(start, 1000);
}
start();
