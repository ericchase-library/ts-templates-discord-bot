import { ConsoleError } from 'lib/ericchase/Utility/Console.js';
import { out_dir, src_dir } from 'tools/scripts/build.js';

const args = new Set(Bun.argv.slice(2));

const env = {
  DEBUG: args.has('debug') ? '1' : '0',
};

const path = args.has('js') //
  ? out_dir.appendSegment('client.module.js')
  : src_dir.appendSegment('client.module.ts');

async function start() {
  try {
    Bun.spawnSync(['bun', path.path], { env, stdout: 'inherit', stderr: 'inherit' });
  } catch (error) {
    ConsoleError(error);
  }
  setTimeout(start, 1000);
}
start();
