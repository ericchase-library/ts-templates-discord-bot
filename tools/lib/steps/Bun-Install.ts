import { RunSync } from 'src/lib/ericchase/Platform/Bun/Child Process.js';
import { BuildStep, DefaultBuilder } from 'tools/lib/Builder.js';

export class Step_BunInstall implements BuildStep {
  builder = DefaultBuilder;

  async run() {
    RunSync.Bun('install');
  }
}
