import { GlobScanner } from 'src/lib/ericchase/Platform/Bun/Glob.js';
import { Path } from 'src/lib/ericchase/Platform/Node/Path.js';
import { ConsoleLogWithDate } from 'src/lib/ericchase/Utility/Console.js';
import { TryLockEach } from 'tools/lib/cache/LockCache.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export interface BuildStep {
  builder: Builder;
  run: () => Promise<void>;
}

export interface ProcessorModule {
  builder: Builder;
  onFilesAdded: (file_list: ProjectFile[]) => Promise<void>;
}
export type ProcessorFunction = (file: ProjectFile) => Promise<void>;

export class Builder {
  readonly src_dir: Path;
  readonly lib_dir: Path;
  readonly out_dir: Path;

  $pre_build_step_list = new Array<BuildStep>();
  $post_build_step_list = new Array<BuildStep>();
  $processor_module_list = new Array<ProcessorModule>();
  $source_map = new Map<string, ProjectFile>();

  constructor({ src_dir = './src/', lib_dir = './src/lib/', out_dir = './out/' }) {
    this.src_dir = new Path(src_dir);
    this.lib_dir = new Path(lib_dir);
    this.out_dir = new Path(out_dir);
  }

  setPreBuildSteps(...steps: BuildStep[]) {
    this.$pre_build_step_list = steps;
    for (const build_step of steps) {
      build_step.builder = this;
    }
  }

  setPostBuildSteps(...steps: BuildStep[]) {
    this.$post_build_step_list = steps;
    for (const build_step of steps) {
      build_step.builder = this;
    }
  }

  setProcessorModules(...modules: ProcessorModule[]) {
    this.$processor_module_list = modules;
    for (const processor_module of modules) {
      processor_module.builder = this;
    }
  }

  getProjectFile(path: string) {
    return this.$source_map.get(path);
  }

  async start() {
    TryLockEach(['Build', 'Format']);

    for (const build_step of this.$pre_build_step_list) {
      ConsoleLogWithDate(build_step.constructor.name);
      await build_step.run();
    }

    for (const path_group of new GlobScanner().scanDot(this.src_dir, '**/*').path_groups) {
      this.$source_map.set(
        path_group.path,
        new ProjectFile(
          //
          this.src_dir.appendSegment(path_group.relative_path),
          this.out_dir.appendSegment(path_group.relative_path),
        ),
      );
    }
    await this.processAddedFiles([...this.$source_map.values()]);

    for (const build_step of this.$post_build_step_list) {
      ConsoleLogWithDate(build_step.constructor.name);
      await build_step.run();
    }

    // setup file watchers with debounce
    // on trigger
    // add any dependencies for modified file to process queue
    // add modified file itself to process queue

    // after debounce time
    // run each processor in processor list on every file in the process queue
  }

  async processAddedFiles(file_list: ProjectFile[]) {
    // run through processor's onFilesAdded method
    // first time run through each file's processor function list
    // send to processUpdatedFiles method

    for (const processor_module of this.$processor_module_list) {
      await processor_module.onFilesAdded(file_list);
    }
    for (const file of file_list) {
      file.downstream_dirty = true;
      for (const processor_function of file.processor_function_list) {
        await processor_function(file);
      }
    }
    await this.processUpdatedFiles(file_list);
  }

  async processUpdatedFiles(file_list: ProjectFile[]) {
    // downstream sorting algorithm
    // - map each file and downstream file to a counter
    // - increment counter every time file is found in a downstream list
    // - after all files and downstream lists are iterated, sort entries by counter ascending

    const downstream_counter_map = new Map<ProjectFile, number>();
    for (const file of file_list) {
      downstream_counter_map.set(file, 0);
      for (const downstream_file of file.downstream_set) {
        downstream_counter_map.set(downstream_file, (downstream_counter_map.get(downstream_file) ?? 0) + 1);
      }
    }
    for (const [file] of Array.from(downstream_counter_map.entries()).sort(([, a], [, b]) => a - b)) {
      file.resetBytes();
      for (const processor_function of file.processor_function_list) {
        await processor_function(file);
      }
    }
  }
}

export const DefaultBuilder = new Builder({});
