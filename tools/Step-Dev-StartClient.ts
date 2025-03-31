import { Subprocess } from 'bun';
import { U8StreamReadLines } from '../src/lib/ericchase/Algorithm/Stream.js';
import { Path } from '../src/lib/ericchase/Platform/FilePath.js';
import { Debounce } from '../src/lib/ericchase/Utility/Debounce.js';
import { Logger } from '../src/lib/ericchase/Utility/Logger.js';
import { Orphan } from '../src/lib/ericchase/Utility/Promise.js';
import { RestartableTaskChain } from '../src/lib/ericchase/Utility/Task_RestartableTaskChain.js';
import { BuilderInternal, Step } from './lib/Builder.js';

const logger = Logger(Step_StartClient.name);

export function Step_StartClient(): Step {
  return new CStep_StartClient();
}

class CStep_StartClient implements Step {
  channel = logger.newChannel();

  process_register?: Subprocess<'ignore', 'pipe', 'pipe'>;
  process_client?: Subprocess<'ignore', 'pipe', 'pipe'>;
  taskchain: ReturnType<typeof RestartableTaskChain> | undefined;
  debouncedRestart = Debounce(() => {
    this.taskchain?.restart();
  }, 250);

  async onStartUp(builder: BuilderInternal): Promise<void> {
    // only start server if in watch mode
    if (builder.watchmode !== true) return;

    this.channel.log('Start Client');
    this.taskchain = RestartableTaskChain(
      [
        async () => {
          this.process_register = Bun.spawn(['bun', 'run', Path(builder.dir.out, 'commands-register.module.js').standard], { stderr: 'pipe', stdout: 'pipe' });
          const { stderr, stdout } = this.process_register;
          await Promise.allSettled([
            U8StreamReadLines(stderr, (line) => this.channel.error(line)),
            U8StreamReadLines(stdout, (line) => this.channel.log(line)), //
          ]);
        },
        async () => {
          this.process_client = Bun.spawn(['bun', 'run', Path(builder.dir.out, 'client.module.js').standard], { stderr: 'pipe', stdout: 'pipe' });
          const { stderr, stdout } = this.process_client;
          Orphan(U8StreamReadLines(stderr, (line) => this.channel.error(line)));
          Orphan(U8StreamReadLines(stdout, (line) => this.channel.log(line)));
        },
      ],
      {
        onAbort: () => {
          this.process_register?.kill();
          this.process_client?.kill();
        },
        onEnd: () => {
          this.process_register = undefined;
          this.process_client = undefined;
        },
      },
    );
  }
  async onRun(builder: BuilderInternal): Promise<void> {
    this.debouncedRestart();
  }
  async onCleanUp(builder: BuilderInternal): Promise<void> {
    this.taskchain?.abort();
  }
}
