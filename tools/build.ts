import { Builder } from 'tools/lib/Builder.js';
import { Processor_IOBasicWriter } from 'tools/lib/processors/IO-Basic-Writer.js';
import { Processor_TypeScriptGenericBundlerImportRemapper } from 'tools/lib/processors/TypeScript-Generic-Bundler-Import-Remapper.js';
import { Processor_TypeScriptGenericBundler } from 'tools/lib/processors/TypeScript-Generic-Bundler.js';

const builder = new Builder(Bun.argv[2] === '--watch' ? 'watch' : 'build');

builder.setStartupSteps([
  // BuildStep_BunInstall(),
  // BuildStep_FSCleanDirectory([builder.dir.out]),
  // BuildStep_IOFormat(),
  //
]);

builder.setProcessorModules([
  Processor_TypeScriptGenericBundler({ sourcemap: 'none', target: 'bun' }),
  Processor_TypeScriptGenericBundlerImportRemapper(),
  Processor_IOBasicWriter(['**/*'], ['**/*.ts', `${builder.dir.lib.standard}/**/*`]), // all files except for .ts and lib files
  Processor_IOBasicWriter(['**/*.module.ts', '**/*.script.ts'], []), // all module and script files
  //
]);

await builder.start();
