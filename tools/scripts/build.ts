import { Broadcast } from 'lib/ericchase/Design Pattern/Observer/Broadcast.js';
import { RunSync } from 'lib/ericchase/Platform/Bun/Child Process.js';
import { GlobScanner } from 'lib/ericchase/Platform/Bun/Glob.js';
import { CleanDirectory, RenameFile } from 'lib/ericchase/Platform/Node/Fs.js';
import { Path } from 'lib/ericchase/Platform/Node/Path.js';
import { ConsoleLogWithDate, ConsoleNewline } from 'lib/ericchase/Utility/Console.js';
import { command_map } from 'tools/dev.js';
import { BuildRunner, copy, IntoPatterns, processHTML } from 'tools/lib/build.js';
import { Cache_FileStats_Lock, Cache_FileStats_Reset, Cache_FileStats_Unlock } from 'tools/lib/cache/FileStatsCache.js';
import { Cache_Unlock, TryLock, TryLockEach } from 'tools/lib/cache/LockCache.js';
import { ImportModuleRemapperPreprocessor } from 'tools/lib/preprocessors/FilePreprocessor_ImportModuleRemapper.js';
import { CustomComponentPreprocessor } from 'tools/lib/preprocessors/HTMLPreprocessor_CustomComponent.js';
import { ImportConverterPreprocessor } from 'tools/lib/preprocessors/HTMLPreprocessor_ImportConverter.js';

// user config
const source_extensions = ['.ts']; // extensions for source files for building
const module_suffixes = ['.module']; // bundled into modules      ie. `name.module.ts`
const script_suffixes = ['.script']; // bundled into iife scripts ie. `name.script.ts`

// directories
export const out_dir = new Path('public'); // final build will appear here
export const src_dir = new Path('src'); // all website files go here
export const lib_dir = new Path('lib'); // for exclusions

// temp directories
export const tmp_dir = out_dir.newBase(`${out_dir.base}_temp`); // temp folder for build process

// computed patterns
const source_patterns = IntoPatterns('**/*', source_extensions); // for build
const module_patterns = IntoPatterns('**/*', module_suffixes, source_extensions); // for build
const script_patterns = IntoPatterns('**/*', script_suffixes, source_extensions);
const external_import_patterns = IntoPatterns('*', module_suffixes, '.js'); // for build: external
const lib_patterns = [lib_dir.appendSegment('**/*').standard_path];
const component_patterns = ['components/**/*.html'];
const dot_component_patterns = ['components/**/.*.html']; // not included in regular scans

// preprocessors
// const iife_wrapper = new IIFEWrapperPreprocessor(script_suffixes.map((suffix) => `${suffix}.js`));
const import_module_remapper = new ImportModuleRemapperPreprocessor(module_suffixes.map((suffix) => `${suffix}.js`));
const custom_component = new CustomComponentPreprocessor();
const import_converter = new ImportConverterPreprocessor(
  ...source_extensions.map((ext) => [ext, '.js'] as const), //
);
const file_renamer: (readonly [string, string])[] = [];

// build mode
export const build_mode = {
  silent: false,
  watch: false,
};

// bundler
const bundler = new BuildRunner();
bundler.broadcast.subscribe(() => {
  for (const line of bundler.output) {
    if (line.length > 0) {
      onLog(`bund: ${line}`);
    }
  }
  bundler.output = [];
});

// step: clean
export async function buildStep_Clean() {
  bundler.killAll();
  Cache_FileStats_Reset();
  await CleanDirectory(out_dir);
  await CleanDirectory(tmp_dir);
}

// step: setup bundler
export async function buildStep_SetupBundler() {
  const external = [...external_import_patterns];
  const watch = build_mode.watch;
  // modules
  for (const entry of new GlobScanner().scan(src_dir, ...module_patterns).path_groups) {
    bundler.add({ entrypoint: entry, outdir: tmp_dir, sourcemap: 'none', target: 'node', external, watch });
  }
  // scripts
  for (const entry of new GlobScanner().scan(src_dir, ...script_patterns).path_groups) {
    bundler.add({ entrypoint: entry, outdir: tmp_dir, sourcemap: 'none', target: 'node', external: [], watch });
  }
  if (build_mode.watch === false) {
    await Promise.allSettled([...bundler.subprocess_map].map(([_, process]) => process.exited));
  }
}

// step: process html
export async function buildStep_ProcessHTMLFiles() {
  // add components
  for (const path_group of new GlobScanner().scan(src_dir, ...component_patterns).path_groups) {
    custom_component.registerComponentPath(Path.from(path_group).name, path_group);
  }
  // add dot components (notice `scanDot` and `registerComponentPath(,,true)`
  for (const path_group of new GlobScanner().scanDot(src_dir, ...dot_component_patterns).path_groups) {
    custom_component.registerComponentPath(Path.from(path_group).name.slice(1), path_group, true);
  }

  const processed_html_paths = await processHTML({
    out_dir: tmp_dir,
    to_process: new GlobScanner().scan(src_dir, '**/*.html'),
    to_exclude: new GlobScanner().scan(src_dir, ...component_patterns, ...lib_patterns),
    preprocessors: [custom_component, import_converter],
  });
  for (const path of processed_html_paths.paths) {
    onLog(`html: ${path}`);
  }

  if (build_mode.watch === false) {
    for (const [tag, count] of custom_component.component_usage_count) {
      // report component copy counters
      onLog(`${count === 1 ? '1 copy' : `${count} copies`} of ${tag}`);
    }
  }
}

// step: copy
export async function buildStep_Copy() {
  const copied_paths = await copy({
    out_dirs: [out_dir],
    to_copy: new GlobScanner().scan(src_dir, '**/*'),
    to_exclude: new GlobScanner().scan(src_dir, '**/*.html', ...component_patterns, ...lib_patterns, ...module_patterns, ...script_patterns, ...source_patterns),
  });
  for (const path of copied_paths.paths) {
    onLog(`copy: ${path}`);
  }
  if (build_mode.watch === false) {
    onLog(`${copied_paths.size} files copied.`);
  }
}

// step: copy temp
export async function buildStep_CopyTemp() {
  const copied_paths = await copy({
    out_dirs: [out_dir],
    to_copy: new GlobScanner().scan(tmp_dir, '**/*'), // exclude nothing
    preprocessors: [import_module_remapper],
  });
  for (const path of copied_paths.paths) {
    onLog(`copy: ${path}`);
  }
  if (build_mode.watch === false) {
    onLog(`${copied_paths.size} files copied.`);
  }
}

// step: rename
export async function buildStep_Rename() {
  for (const [from, to] of file_renamer) {
    for (const path_group of new GlobScanner().scan(out_dir, `**/*${from}`).path_groups) {
      const path = path_group.path;
      await RenameFile(path_group, new Path(path.slice(0, path.lastIndexOf(from)) + to));
      onLog(`move: ${path}`);
    }
  }
}

// logger
export const on_log = new Broadcast<void>();
export function onLog(data: string) {
  if (build_mode.silent === false) {
    ConsoleLogWithDate(data);
    on_log.send();
  }
}

// direct run
if (Bun.argv[1] === __filename) {
  TryLockEach([command_map.build, command_map.format]);

  RunSync.Bun('update');
  Cache_Unlock(command_map.format);
  RunSync.BunRun('format', 'silent');
  TryLock(command_map.format);

  ConsoleNewline();
  if (Cache_FileStats_Lock()) {
    await buildStep_Clean();
    await buildStep_SetupBundler();
    await buildStep_ProcessHTMLFiles();
    await buildStep_Copy();
    await buildStep_CopyTemp();
    await buildStep_Rename();
  }
  Cache_FileStats_Unlock();
  ConsoleNewline();

  Cache_Unlock(command_map.format);
  RunSync.BunRun('format');
}
