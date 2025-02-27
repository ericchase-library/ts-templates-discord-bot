import { Path } from 'src/lib/ericchase/Platform/Node/Path.js';
import { ProcessorFunction } from 'tools/lib/Builder.js';

export class ProjectFile {
  constructor(
    public src_file: Path,
    public out_file: Path,
  ) {}

  processor_function_list = new Array<ProcessorFunction>();

  downstream_set = new Set<ProjectFile>();
  upstream_set = new Set<ProjectFile>();

  /** When true, downstream files need to be re-processed. */
  downstream_dirty = false;
  /** When false, $bytes/$text are no longer from the original file. */
  original_bytes = true;
  /** When true,  */
  unsaved = false;

  $bytes?: Uint8Array;
  $text?: string;

  async getBytes(): Promise<Uint8Array> {
    if (this.$bytes === undefined) {
      if (this.$text === undefined) {
        this.$bytes = await Bun.file(this.src_file.path).bytes();
      } else {
        this.$bytes = new TextEncoder().encode(this.$text);
        this.$text = undefined;
      }
    }
    return this.$bytes;
  }
  async getText(): Promise<string> {
    if (this.$text === undefined) {
      if (this.$bytes === undefined) {
        this.$text = await Bun.file(this.src_file.path).text();
      } else {
        this.$text = new TextDecoder().decode(this.$bytes);
        this.$bytes = undefined;
      }
    }
    return this.$text;
  }

  setBytes(bytes: Uint8Array) {
    this.downstream_dirty = true;
    this.original_bytes = false;
    this.unsaved = true;
    this.$bytes = bytes;
    this.$text = undefined;
  }
  setText(text: string) {
    this.downstream_dirty = true;
    this.original_bytes = false;
    this.unsaved = true;
    this.$bytes = undefined;
    this.$text = text;
  }

  resetBytes() {
    this.downstream_dirty = false;
    this.original_bytes = true;
    this.unsaved = false;
    this.$bytes = undefined;
    this.$text = undefined;
  }

  async write(out_file = this.out_file) {
    await Bun.write(out_file.path, this.$text !== undefined ? this.$text : await this.getBytes());
    this.unsaved = false;
  }
}
