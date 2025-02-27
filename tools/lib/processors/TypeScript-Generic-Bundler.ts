import { Path } from 'src/lib/ericchase/Platform/Node/Path.js';
import { ConsoleError, ConsoleLog } from 'src/lib/ericchase/Utility/Console.js';
import { DefaultBuilder, ProcessorModule } from 'tools/lib/Builder.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

type BuildConfig = Pick<Parameters<typeof Bun.build>[0], 'external' | 'sourcemap' | 'target'>;

export class Processor_TypeScriptGenericBundler implements ProcessorModule {
  builder = DefaultBuilder;
  config: Parameters<typeof Bun.build>[0];

  constructor({ external = [], sourcemap = 'linked', target = 'browser' }: BuildConfig) {
    this.config = {
      entrypoints: [],
      external: ['*.module.js', ...(external ?? [])],
      format: 'esm',
      minify: {
        identifiers: false,
        syntax: false,
        whitespace: false,
      },
      sourcemap: sourcemap ?? 'none',
      target: target ?? 'browser',
    };
  }

  async onFilesAdded(file_list: ProjectFile[]) {
    // const transpiler = new Bun.Transpiler({
    //   loader: 'tsx',
    // });

    for (const file of file_list) {
      if (file.src_file.path.endsWith('.module.ts') === false) continue;

      file.out_file = file.out_file.newExt('.js');

      file.processor_function_list.push(async (file) => {
        // const { imports } = transpiler.scan(await file.getText());
        // for (const { path } of imports) {
        //   const import_text = await this.builder.getProjectFile(this.builder.src_dir.appendSegment(path).newExt('.ts').path)?.getText();
        //   if (import_text) {
        //     const { imports } = transpiler.scan(import_text);
        //     console.log(path, imports);
        //   }
        // }

        // await file.write(file.tmp_file);

        this.config.entrypoints = [file.src_file.path];
        const result = await Bun.build(this.config);
        if (result.success === true) {
          for (const artifact of result.outputs) {
            switch (artifact.kind) {
              case 'entry-point':
                file.setText(await artifact.text());
                break;
              case 'sourcemap':
                await Bun.write(file.out_file.newBase(new Path(artifact.path).base).path, await artifact.text());
                break;
            }
          }
        } else {
          ConsoleError('Error:\n', file.src_file.path);
          for (const log of result.logs) {
            ConsoleLog(log.message);
          }
          ConsoleLog();
        }
      });
    }
  }
}
