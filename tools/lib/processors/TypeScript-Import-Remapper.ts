import node_path from 'node:path';

import { MatchAny } from 'src/lib/ericchase/Algorithm/String/Search/WildcardMatcher.js';
import { Path } from 'src/lib/ericchase/Platform/Node/Path.js';
import { DefaultBuilder, ProcessorModule } from 'tools/lib/Builder.js';
import { ProjectFile } from 'tools/lib/ProjectFile.js';

export class Processor_TypeScriptImportRemapper implements ProcessorModule {
  builder = DefaultBuilder;

  async onFilesAdded(file_list: ProjectFile[]) {
    const src_dir = this.builder.src_dir.path;

    for (const file of file_list) {
      if (file.src_file.path.endsWith('.module.ts') === false) continue;

      file.processor_function_list.push(async (file) => {
        let text = await file.getText();
        let result = findImportPath(text);
        while (result.indexStart !== -1) {
          if (result.importPath.startsWith(src_dir)) {
            const new_import_path = getRelativePath(file.src_file, new Path(result.importPath));
            text = text.slice(0, result.indexStart) + new_import_path + text.slice(result.indexEnd);
            result.indexEnd = result.indexStart + new_import_path.length;
          }
          result = findImportPath(text, result.indexEnd);
        }
        file.setText(text);
      });
    }
  }
}

function indexOf(source: string, target: string, position = 0) {
  const index = source.indexOf(target, position);
  return { start: index, end: index + target.length };
}
function lastIndexOf(source: string, target: string, position = 0) {
  const index = source.lastIndexOf(target, position);
  return { start: index, end: index + target.length };
}
function findImportPath(text: string, indexStart = 0) {
  while (indexStart !== -1) {
    const index_import = indexOf(text, 'import', indexStart);
    if (-1 === index_import.start) {
      break;
    }
    const index_semicolon = indexOf(text, ';', index_import.end);
    if (-1 === index_semicolon.start) {
      break;
    }

    const index_from = lastIndexOf(text.slice(index_import.end, index_semicolon.start), 'from', index_semicolon.start);
    index_from.start += index_import.end;
    index_from.end += index_import.end;
    if (-1 === index_from.start || index_from.start > index_semicolon.start) {
      break;
    }

    const import_slice = text.slice(index_from.end, index_semicolon.start).trim();
    if (MatchAny(import_slice, "'*.js'") || MatchAny(import_slice, '"*.js"')) {
      const { start, end } = indexOf(text, import_slice.slice(1, -1), index_from.end);
      return { indexStart: start, indexEnd: end, importPath: text.slice(start, end) };
    }
    indexStart = index_import.end;
  }

  return { indexStart: -1, indexEnd: -1, importPath: '' };
}

function getRelativePath(source_path: Path, import_path: Path) {
  const relative = new Path(node_path.relative(source_path.path, import_path.path)).standard_path;
  return relative.startsWith('../../') ? relative.slice(3) : relative.slice(1);
}
