import { Subprocess } from 'bun';
import { AsyncLineReader } from 'src/lib/ericchase/Algorithm/Stream.js';
import { U8ToString } from 'src/lib/ericchase/Algorithm/Uint8Array.js';
import { Debounce } from 'src/lib/ericchase/Utility/Debounce.js';
import { Logger } from 'src/lib/ericchase/Utility/Logger.js';
import { Sleep } from 'src/lib/ericchase/Utility/Sleep.js';
import { BuilderInternal, Step } from 'tools/lib/Builder.js';

const logger = Logger(Step_StartClient.name);

export function Step_StartClient(): Step {
  return new CStep_StartClient();
}

class CStep_StartClient implements Step {
  logger = logger.newChannel();

  child_process?: Subprocess<'ignore', 'pipe', 'pipe'>;

  onchange() {
    try {
      this.child_process?.kill();
      const p0 = Bun.spawnSync(['bun', 'run', 'out/commands-register.module.js'], { stderr: 'pipe', stdout: 'pipe' });
      logger.logNotEmpty(U8ToString(p0.stdout));
      logger.errorNotEmpty(U8ToString(p0.stderr));
      const p1 = Bun.spawn(['bun', 'run', 'out/client.module.js'], { stderr: 'pipe', stdout: 'pipe' });
      (async () => {
        for await (const lines of AsyncLineReader(p1.stdout)) {
          logger.log(...lines);
        }
      })();
      (async () => {
        for await (const lines of AsyncLineReader(p1.stderr)) {
          logger.error(...lines);
        }
      })();
      this.child_process = p1;
    } catch (error) {}
  }
  unwatch?: () => void;

  async run(builder: BuilderInternal) {
    if (builder.watchmode === true) {
      const onchange = Debounce(() => this.onchange(), 5000);
      this.unwatch = builder.platform.Directory.watch(builder.dir.out, onchange);
      Sleep(1000).then(() => {
        onchange();
      });
    }
  }
}
