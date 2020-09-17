/*
 * The MurmurHash3 implementation is copy-pasted from
 * https://github.com/karanlyons/murmurHash3.js/blob/f53c3dd0791026c17d6af6b4b3c368853c4503e9/src/index.ts
 * The x86 implementation is removed.
 *
 * @todo Ignore by linter and TypeScript
 * @todo Checks that the implementation gives the same result as the old Pro agent implementation
 */

type Brand<Name, Type> = Type & {_type?: Name};
type u32 = Brand<'u32', number>;
type u64 = Brand<'u64', [u32, u32]>;
// 16bit chunks in big endian as u32s to allow carrying of overflows.
type u64spill = Brand<'u64spill', [u32, u32, u32, u32]>;


const strToBuf = TextEncoder.prototype.encode.bind(new TextEncoder());

const hexLUT = Array.from({ length: 256 }, (_, i) => `00${i.toString(16)}`.slice(-2));

function bufToHex(buf: Uint8Array = new Uint8Array(0)): string {
  let str = "";
  for (let i = 0; i < buf.byteLength; i++) {
    str += hexLUT[buf[i]];
  }

  return str;
}


function add64(m: u64, n: u64): u64 {
  const ms: u64spill = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
  const ns: u64spill = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
  const os: u64spill = [0x0, 0x0, 0x0, 0x0];

  os[3] += ms[3] + ns[3];
  os[2] += os[3] >>> 16;
  os[3] &= 0xffff;

  os[2] += ms[2] + ns[2];
  os[1] += os[2] >>> 16;
  os[2] &= 0xffff;

  os[1] += ms[1] + ns[1];
  os[0] += os[1] >>> 16;
  os[1] &= 0xffff;

  os[0] += ms[0] + ns[0];
  os[0] &= 0xffff;

  return [(os[0] << 16) | os[1], (os[2] << 16) | os[3]];
}

function mul64(m: u64, n: u64): u64 {
  const ms: u64spill = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
  const ns: u64spill = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
  const os: u64spill = [0x0, 0x0, 0x0, 0x0];

  os[3] += ms[3] * ns[3];
  os[2] += os[3] >>> 16;
  os[3] &= 0xffff;

  os[2] += ms[2] * ns[3];
  os[1] += os[2] >>> 16;
  os[2] &= 0xffff;

  os[2] += ms[3] * ns[2];
  os[1] += os[2] >>> 16;
  os[2] &= 0xffff;

  os[1] += ms[1] * ns[3];
  os[0] += os[1] >>> 16;
  os[1] &= 0xffff;

  os[1] += ms[2] * ns[2];
  os[0] += os[1] >>> 16;
  os[1] &= 0xffff;

  os[1] += ms[3] * ns[1];
  os[0] += os[1] >>> 16;
  os[1] &= 0xffff;

  os[0] += (ms[0] * ns[3]) + (ms[1] * ns[2]) + (ms[2] * ns[1]) + (ms[3] * ns[0]);
  os[0] &= 0xffff;

  return [(os[0] << 16) | os[1], (os[2] << 16) | os[3]];
}

function rol64(n: u64, r: number): u64 {
  r %= 64;

  // istanbul ignore if: here for completeness but never used.
  if (r === 32) {
    return [n[1], n[0]];
  } else if (r < 32) {
    return [
      (n[0] << r) | (n[1] >>> (32 - r)),
      (n[1] << r) | (n[0] >>> (32 - r)),
    ];
  } else {
    r -= 32;
    return [
      (n[1] << r) | (n[0] >>> (32 - r)),
      (n[0] << r) | (n[1] >>> (32 - r)),
    ];
  }
}

function shl64(n: u64, s: number): u64 {
  s %= 64;

  // istanbul ignore if: here for completeness but never used.
  if (s === 0) {
    return n;
  } else if (s < 32) {
    return [(n[0] << s) | (n[1] >>> (32 - s)), n[1] << s];
  } else {
    return [n[1] << (s - 32), 0x0];
  }
}

function xor64(a: u64, b: u64): u64 {
  return [a[0] ^ b[0], a[1] ^ b[1]];
}


function x64fmix64(h: u64): u64 {
  // [0x0, h[0] >>> 1] is a 33 bit shr.
  h = xor64(h, [0x0, h[0] >>> 1]);
  h = mul64(h, [0xff51afd7, 0xed558ccd]);
  h = xor64(h, [0x0, h[0] >>> 1]);
  h = mul64(h, [0xc4ceb9fe, 0x1a85ec53]);
  h = xor64(h, [0x0, h[0] >>> 1]);

  return h;
}


const x64hash128c1: u64 = [0x87c37b91, 0x114253d5];
const x64hash128c2: u64 = [0x4cf5ad43, 0x2745937f];

function x64mix128(h1: u64, h2: u64, k1: u64, k2: u64): [u64, u64] {
  k1 = mul64(k1, x64hash128c1);
  k1 = rol64(k1, 31);
  k1 = mul64(k1, x64hash128c2);
  h1 = xor64(h1, k1);

  h1 = rol64(h1, 27);
  h1 = add64(h1, h2);
  h1 = add64(mul64(h1, [0x0, 5]), [0x0, 0x52dce729]);

  k2 = mul64(k2, x64hash128c2);
  k2 = rol64(k2, 33);
  k2 = mul64(k2, x64hash128c1);
  h2 = xor64(h2, k2);

  h2 = rol64(h2, 31);
  h2 = add64(h2, h1);
  h2 = add64(mul64(h2, [0x0, 5]), [0x0, 0x38495ab5]);

  return [h1, h2];
}

type x64hash128State = {
  h1: u64,
  h2: u64,
  len: number,
  rem: Uint8Array,
};

function x64hash128(
  buf?: Uint8Array,
  state?: u32 | x64hash128State,
  finalize?: true,
): Uint8Array;
function x64hash128(
  buf: string,
  state?: u32 | x64hash128State,
  finalize?: true,
): string;
function x64hash128(
  buf: Uint8Array | string,
  state?: u32 | x64hash128State,
  finalize?: false,
): x64hash128State;
function x64hash128(
  buf: Uint8Array | string = new Uint8Array(0),
  state: u32 | x64hash128State = 0x0,
  finalize: boolean = true,
): Uint8Array | string | x64hash128State {
  let str;
  if (typeof buf === 'string') {
    buf = strToBuf(buf);
    str = true;
  } else {
    str = false;
  }

  let h1: u64;
  let h2: u64;
  let i: number;
  let len: number;
  if (typeof state === 'number') {
    h1 = [0x0, state];
    h2 = [0x0, state];
    i = 0;
    len = 0;
  } else {
    ({ h1, h2, len } = state as x64hash128State);
    const rem = (state as x64hash128State).rem;

    if (rem.byteLength === 0) {
      i = 0;
    } else if (rem.byteLength + buf.byteLength >= 16) {
      len += 16;
      i = 16 - rem.byteLength;

      const blk = new Uint8Array(16);
      const dtv = new DataView(blk.buffer);
      blk.set(rem);
      blk.set(buf.subarray(0, i), rem.byteLength);

      [h1, h2] = x64mix128(
        h1, h2,
        [dtv.getUint32(4, true), dtv.getUint32(0, true)],
        [dtv.getUint32(12, true), dtv.getUint32(8, true)],
      );
    } else {
      const newBuf = new Uint8Array(buf.byteLength + rem.byteLength);
      newBuf.set(rem);
      newBuf.set(buf, rem.byteLength);
      buf = newBuf;
      i = 0;
    }
  }

  const dtv = new DataView(buf.buffer, buf.byteOffset);
  const remainder = (buf.byteLength - i) % 16;
  const bytes = buf.byteLength - i - remainder;
  len += bytes;

  for (; i < bytes; i += 16) {
    [h1, h2] = x64mix128(
      h1, h2,
      [dtv.getUint32(i + 4, true), dtv.getUint32(i, true)],
      [dtv.getUint32(i + 12, true), dtv.getUint32(i + 8, true)],
    );
  }

  if (!finalize) {
    return {
      h1, h2,
      len,
      rem: buf.subarray(buf.byteLength - remainder),
    };
  } else {
    len += remainder;
    let k1: u64 = [0x0, 0x0];
    let k2: u64 = [0x0, 0x0];

    switch (remainder) {
      case 15: k2 = xor64(k2, shl64([0x0, buf[i + 14]], 48));
      case 14: k2 = xor64(k2, shl64([0x0, buf[i + 13]], 40));
      case 13: k2 = xor64(k2, shl64([0x0, buf[i + 12]], 32));
      case 12: k2 = xor64(k2, shl64([0x0, buf[i + 11]], 24));
      case 11: k2 = xor64(k2, shl64([0x0, buf[i + 10]], 16));
      case 10: k2 = xor64(k2, shl64([0x0, buf[i + 9]], 8));
      case 9:
        k2 = xor64(k2, [0x0, buf[i + 8]]);
        k2 = mul64(k2, x64hash128c2);
        k2 = rol64(k2, 33);
        k2 = mul64(k2, x64hash128c1);
        h2 = xor64(h2, k2);
      case 8: k1 = xor64(k1, shl64([0x0, buf[i + 7]], 56));
      case 7: k1 = xor64(k1, shl64([0x0, buf[i + 6]], 48));
      case 6: k1 = xor64(k1, shl64([0x0, buf[i + 5]], 40));
      case 5: k1 = xor64(k1, shl64([0x0, buf[i + 4]], 32));
      case 4: k1 = xor64(k1, shl64([0x0, buf[i + 3]], 24));
      case 3: k1 = xor64(k1, shl64([0x0, buf[i + 2]], 16));
      case 2: k1 = xor64(k1, shl64([0x0, buf[i + 1]], 8));
      case 1:
        k1 = xor64(k1, [0x0, buf[i]]);
        k1 = mul64(k1, x64hash128c1);
        k1 = rol64(k1, 31);
        k1 = mul64(k1, x64hash128c2);
        h1 = xor64(h1, k1);
    }

    h1 = xor64(h1, [0x0, len & 0xffffffff]);
    h2 = xor64(h2, [0x0, len & 0xffffffff]);

    h1 = add64(h1, h2);
    h2 = add64(h2, h1);

    h1 = x64fmix64(h1);
    h2 = x64fmix64(h2);

    h1 = add64(h1, h2);
    h2 = add64(h2, h1);

    const hash = new DataView(new ArrayBuffer(16));
    hash.setUint32(0, h1[0], false);
    hash.setUint32(4, h1[1], false);
    hash.setUint32(8, h2[0], false);
    hash.setUint32(12, h2[1], false);

    return str
      ? bufToHex(new Uint8Array(hash.buffer))
      : new Uint8Array(hash.buffer);
  }
}

export { x64hash128 }
