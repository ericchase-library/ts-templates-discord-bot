import { U8FromUint32, U8ToHex } from 'src/lib/ericchase/Algorithm/Uint8Array.js';

export function Uint32ToHex(uint: number) {
  return U8ToHex(U8FromUint32(uint));
}
