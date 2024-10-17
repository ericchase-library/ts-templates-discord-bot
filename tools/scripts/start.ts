import { RunSync } from 'lib/ericchase/Platform/Bun/Child Process.js';
import { src_dir } from 'tools/scripts/build.js';

RunSync.Bun.Silent('update');
RunSync.BunRun.Silent('format', 'silent');
RunSync.Bun(src_dir.appendSegment('client.module.ts').path);
