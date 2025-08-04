import { BunPlatform_Args_Has } from '../src/lib/ericchase/BunPlatform_Args_Has.js';
import { Step_Dev_Format } from './core-dev/step/Step_Dev_Format.js';
import { Builder } from './core/Builder.js';
import { Processor_Set_Writable } from './core/processor/Processor_Set_Writable.js';
import { PATTERN, Processor_TypeScript_Generic_Bundler } from './core/processor/Processor_TypeScript_Generic_Bundler.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_FS_Clean_Directory } from './core/step/Step_FS_Clean_Directory.js';
import { Step_Dev_Client } from './lib-discord-bot/steps/Dev-Client.js';

// Use command line arguments to set watch mode.
if (BunPlatform_Args_Has('--dev')) {
  Builder.SetMode(Builder.MODE.DEV);
}
Builder.SetVerbosity(Builder.VERBOSITY._2_DEBUG);

// These steps are run during the startup phase only.
Builder.SetStartUpSteps(
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }),
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_FS_Clean_Directory(Builder.Dir.Out),
  Step_Dev_Format({ showlogs: false }),
  //
);

// These steps are run before each processing phase.
Builder.SetBeforeProcessingSteps();

// Basic setup for a typescript powered project. Typescript files that match
// "*.module.ts" and "*.iife.ts" are bundled and written to the out folder.
// The other typescript files do not produce bundles. Module ("*.module.ts")
// files will not bundle other module files. Instead, they'll import whatever
// exports are needed from other module files. IIFE ("*.iife.ts") files, on
// the other hand, produce fully contained bundles. They do not import anything
// from anywhere. Use them accordingly.

// HTML custom components are a lightweight alternative to web components made
// possible by the processors below.

// The processors are run for every file that added them during every
// processing phase.
Builder.SetProcessorModules(
  // Bundle the modules.
  Processor_TypeScript_Generic_Bundler({ target: 'bun', sourcemap: 'linked' }),
  // Write non-bundle files and non-library files.
  Processor_Set_Writable({ include_patterns: ['**/*'], exclude_patterns: ['**/*.ts'] }, { include_libdir: false }),
  // Write bundled files.
  Processor_Set_Writable({ include_patterns: [`**/*${PATTERN.MODULE_IIFE}`] }, { include_libdir: true }),
  //
);

// These steps are run after each processing phase.
Builder.SetAfterProcessingSteps(
  // During "dev" mode (when "--watch" is passed as an argument), the bot
  // client will start running with automatic re-running when output files
  // change. Look in the "Dev-StartClient.ts" file to see how it works.
  Step_Dev_Client(),
  //
);

// These steps are run during the shutdown phase only.
Builder.SetCleanUpSteps();

await Builder.Start();
