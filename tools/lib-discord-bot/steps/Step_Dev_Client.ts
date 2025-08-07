import { Subprocess } from 'bun';
import { Core_Promise_Orphan } from '../../../src/lib/ericchase/Core_Promise_Orphan.js';
import { Async_Core_Stream_Uint8_Read_Lines } from '../../../src/lib/ericchase/Core_Stream_Uint8_Read_Lines.js';
import { Core_Utility_Debounce } from '../../../src/lib/ericchase/Core_Utility_Debounce.js';
import { NODE_PATH } from '../../../src/lib/ericchase/NodePlatform.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';

export function Step_Dev_Client(): Builder.Step {
  return new Class();
}
class Class implements Builder.Step {
  StepName = Step_Dev_Client.name;
  channel = Logger(this.StepName).newChannel();

  process_register?: Subprocess<'ignore', 'pipe', 'pipe'>;
  process_client?: Subprocess<'ignore', 'pipe', 'pipe'>;
  killProcesses() {
    this.process_register?.kill(0);
    this.process_register = undefined;
    this.process_client?.kill(0);
    this.process_client = undefined;
  }
  debouncedStartUp = Core_Utility_Debounce(async () => {
    this.killProcesses();

    {
      this.channel.log('Register Commands');
      this.process_register = Bun.spawn(['bun', 'run', NODE_PATH.join(Builder.Dir.Out, 'commands-register.module.js')], { stderr: 'pipe', stdout: 'pipe' });
      const { stderr, stdout } = this.process_register;
      await Promise.allSettled([
        Async_Core_Stream_Uint8_Read_Lines(stderr, (line) => this.channel.error(line)),
        Async_Core_Stream_Uint8_Read_Lines(stdout, (line) => this.channel.log(line)), //
      ]);
      await this.process_register.exited;
      this.process_register = undefined;
    }

    {
      this.channel.log('Start Client');
      this.process_client = Bun.spawn(['bun', 'run', NODE_PATH.join(Builder.Dir.Out, 'client.module.js')], { stderr: 'pipe', stdout: 'pipe' });
      const { stderr, stdout } = this.process_client;
      Core_Promise_Orphan(Async_Core_Stream_Uint8_Read_Lines(stderr, (line) => this.channel.error(line)));
      Core_Promise_Orphan(Async_Core_Stream_Uint8_Read_Lines(stdout, (line) => this.channel.log(line)));
    }
  }, 250);

  async onStartUp(): Promise<void> {}
  async onRun(): Promise<void> {
    // only start server if in dev mode
    if (Builder.GetMode() !== Builder.MODE.DEV) return;
    await this.debouncedStartUp();
  }
  async onCleanUp(): Promise<void> {
    this.killProcesses();
  }
}
