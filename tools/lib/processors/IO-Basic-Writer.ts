import { DefaultBuilder, ProcessorModule } from 'tools/lib/Builder.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export class Processor_IOBasicWriter implements ProcessorModule {
  builder = DefaultBuilder;

  async onFilesAdded(file_list: ProjectFile[]): Promise<void> {
    for (const file of file_list) {
      if (this.canWrite(file)) {
        file.processor_function_list.push(async (file) => {
          if (file.downstream_dirty === true) {
            await file.write();
          }
        });
      }
    }
  }

  canWrite(file: ProjectFile): boolean {
    // we want to copy all module and script source files
    if (file.src_file.path.endsWith('.module.ts')) return true;
    if (file.src_file.path.endsWith('.script.ts')) return true;

    // skip regular typescript files
    if (file.src_file.path.endsWith('.ts')) return false;
    // skip anything else in lib directory
    if (file.src_file.path.startsWith(this.builder.lib_dir.path)) return false;

    return true;
  }
}
