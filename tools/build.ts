import { Subprocess } from 'bun';
import { Debounce } from 'src/lib/ericchase/Utility/Debounce.js';
import { Builder } from 'tools/lib/Builder.js';
import { BuilderInternal, BuildStep } from 'tools/lib/BuilderInternal.js';
import { Processor_IOBasicWriter } from 'tools/lib/processors/IO-Basic-Writer.js';
import { Processor_TypeScriptGenericBundlerImportRemapper } from 'tools/lib/processors/TypeScript-Generic-Bundler-Import-Remapper.js';
import { Processor_TypeScriptGenericBundler } from 'tools/lib/processors/TypeScript-Generic-Bundler.js';
import { BuildStep_BunInstall } from 'tools/lib/steps/Bun-Install.js';
import { BuildStep_FSCleanDirectory } from 'tools/lib/steps/FS-CleanDirectory.js';
import { BuildStep_IOFormat } from 'tools/lib/steps/IO-Format.js';

const builder = new Builder(Bun.argv[2] === '--watch' ? 'watch' : 'build');

builder.setStartupSteps([
  BuildStep_BunInstall(),
  BuildStep_FSCleanDirectory([builder.dir.out]),
  BuildStep_IOFormat(),
  // run the client during dev mode
  new (class implements BuildStep {
    child_process: Subprocess<'ignore', 'inherit', 'inherit'> | undefined;
    onchange = Debounce(() => {
      this.child_process?.kill();
      Bun.spawnSync(['bun', 'out/commands-register.module.js'], { stderr: 'inherit', stdout: 'inherit' });
      this.child_process = Bun.spawn(['bun', 'out/client.module.js'], { stderr: 'inherit', stdout: 'inherit' });
    }, 5000);
    async run(builder: BuilderInternal) {
      if (builder.watchmode === true) {
        builder.platform.Directory.watch(builder.dir.out, () => this.onchange());
      }
    }
  })(),
]);

builder.setProcessorModules([
  Processor_TypeScriptGenericBundler({ sourcemap: 'none', target: 'bun' }),
  Processor_TypeScriptGenericBundlerImportRemapper(),
  Processor_IOBasicWriter(['**/*'], ['**/*.ts', `${builder.dir.lib.standard}/**/*`]), // all files except for .ts and lib files
  Processor_IOBasicWriter(['**/*.module.ts', '**/*.script.ts'], []), // all module and script files
  //
]);

await builder.start();
