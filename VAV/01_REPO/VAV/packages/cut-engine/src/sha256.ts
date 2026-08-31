// Standard Pure-JS SHA-256 implementation with strict TypeScript types

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

const K: readonly number[] = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

export function sha256(ascii: string): string {
  const maxWord = 4294967296; // 2^32
  let result = "";

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  const hash: number[] = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  let compositeAscii = ascii + "\x80";
  while (compositeAscii.length % 64 !== 56) {
    compositeAscii += "\x00";
  }

  for (let i = 0; i < compositeAscii.length; i++) {
    const j = compositeAscii.charCodeAt(i);
    const wordIdx = i >> 2;
    words[wordIdx] = (words[wordIdx] ?? 0) | (j << ((3 - (i % 4)) * 8));
  }

  const wordLen = words.length;
  words[wordLen] = (asciiBitLength / maxWord) | 0;
  words[wordLen + 1] = asciiBitLength | 0;

  for (let j = 0; j < words.length; j += 16) {
    const w: number[] = [];
    for (let k = 0; k < 16; k++) {
      w[k] = words[j + k] ?? 0;
    }
    const oldHash = [...hash];

    for (let i = 0; i < 64; i++) {
      if (i >= 16) {
        const w15 = w[i - 15] ?? 0;
        const w2 = w[i - 2] ?? 0;
        const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        w[i] = ((w[i - 16] ?? 0) + s0 + (w[i - 7] ?? 0) + s1) | 0;
      }

      const a = hash[0] ?? 0;
      const b = hash[1] ?? 0;
      const c = hash[2] ?? 0;
      const d = hash[3] ?? 0;
      const e = hash[4] ?? 0;
      const f = hash[5] ?? 0;
      const g = hash[6] ?? 0;
      const h = hash[7] ?? 0;

      const s0_a = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (s0_a + maj) | 0;
      const s1_e = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ ((~e) & g);
      const t1 = (h + s1_e + ch + (K[i] ?? 0) + (w[i] ?? 0)) | 0;

      hash[0] = (t1 + t2) | 0;
      hash[1] = a;
      hash[2] = b;
      hash[3] = c;
      hash[4] = (d + t1) | 0;
      hash[5] = e;
      hash[6] = f;
      hash[7] = g;
    }

    for (let i = 0; i < 8; i++) {
      hash[i] = ((hash[i] ?? 0) + (oldHash[i] ?? 0)) | 0;
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 3; j >= 0; j--) {
      const b = ((hash[i] ?? 0) >> (j * 8)) & 255;
      result += (b < 16 ? "0" : "") + b.toString(16);
    }
  }

  return result;
}
