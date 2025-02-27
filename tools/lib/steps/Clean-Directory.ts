import { CleanDirectory } from 'src/lib/ericchase/Platform/Node/Fs.js';
import { Path } from 'src/lib/ericchase/Platform/Node/Path.js';
import { BuildStep, DefaultBuilder } from 'tools/lib/Builder.js';

export class Step_CleanDirectory implements BuildStep {
  builder = DefaultBuilder;

  constructor(readonly paths: Path[]) {}

  async run() {
    for (const path of this.paths) {
      await CleanDirectory(path);
    }
  }
}
