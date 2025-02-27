import { Builder } from 'tools/lib/Builder.js';
import { Processor_IOBasicWriter } from 'tools/lib/processors/IO-Basic-Writer.js';
import { Processor_TypeScriptGenericBundler } from 'tools/lib/processors/TypeScript-Generic-Bundler.js';
import { Processor_TypeScriptImportRemapper } from 'tools/lib/processors/TypeScript-Import-Remapper.js';
import { Step_BunInstall } from 'tools/lib/steps/Bun-Install.js';
import { Step_CleanDirectory } from 'tools/lib/steps/Clean-Directory.js';
import { Step_Format } from 'tools/lib/steps/Format.js';

const builder = new Builder({});

builder.setPreBuildSteps(
  //
  new Step_BunInstall(),
  new Step_CleanDirectory([builder.out_dir]),
  new Step_Format(),
);

builder.setProcessorModules(
  //
  new Processor_TypeScriptGenericBundler({ target: 'bun' }),
  new Processor_TypeScriptImportRemapper(),
  new Processor_IOBasicWriter(),
);

await builder.start();
