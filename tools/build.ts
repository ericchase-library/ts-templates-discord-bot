import { Step_StartClient } from './Step-Dev-StartClient.js';
import { Builder } from './lib/Builder.js';
import { Processor_BasicWriter } from './lib/processors/FS-BasicWriter.js';
import { Processor_TypeScript_GenericBundlerImportRemapper } from './lib/processors/TypeScript-GenericBundler-ImportRemapper.js';
import { Processor_TypeScript_GenericBundler } from './lib/processors/TypeScript-GenericBundler.js';
import { Step_Bun_Run } from './lib/steps/Bun-Run.js';
import { Step_CleanDirectory } from './lib/steps/FS-CleanDirectory.js';
import { Step_Format } from './lib/steps/FS-Format.js';

// Use command line arguments to set watch mode.
const builder = new Builder(Bun.argv[2] === '--watch' ? 'watch' : 'build');

// These steps are run during the startup phase only.
builder.setStartupSteps(
  Step_Bun_Run({ cmd: ['bun', 'install'] }, 'quiet'),
  Step_CleanDirectory(builder.dir.out),
  Step_Format('quiet'),
  //
);

// These steps are run before each processing phase.
builder.setBeforeProcessingSteps();

// Basic setup for a general typescript project. Typescript files that match
// "*.module.ts" and "*.script.ts" are bundled and written to the out folder.
// The other typescript files do not produce bundles. Module ("*.module.ts")
// files will not bundle other module files. Instead, they'll import whatever
// exports are needed from other module files. Script ("*.script.ts") files, on
// the other hand, produce fully contained bundles. They do not import anything
// from anywhere. Use them accordingly.
builder.setProcessorModules(
  Processor_TypeScript_GenericBundler({ sourcemap: 'none', target: 'bun' }),
  Processor_TypeScript_GenericBundlerImportRemapper(),
  // all files except for .ts and lib files
  Processor_BasicWriter(['**/*'], ['**/*{.ts,.tsx,.jsx}', `${builder.dir.lib.standard}/**/*`]),
  // all module and script files
  Processor_BasicWriter(['**/*{.module,.script}{.ts,.tsx,.jsx}'], []),
  //
);

// The processors are run for every file that added them during every
// processing phase.
builder.setAfterProcessingSteps(
  // During "dev" mode (when "--watch" is passed as an argument), the bot
  // client will start running with automatic re-running when output files
  // change. Look in the "Dev-StartClient.ts" file to see how it works.
  Step_StartClient(),
  //
);

// These steps are run after each processing phase.
builder.setCleanupSteps();

await builder.start();
