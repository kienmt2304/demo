import type { MantineColorShade, MantineColorsTuple } from "@mantine/core";

type Oklch = { l: number; c: number; h: number };

// Target lightness per shade, modeled on Mantine's default palettes.
const LIGHTNESS = [0.97, 0.93, 0.87, 0.8, 0.73, 0.67, 0.61, 0.55, 0.49, 0.42];

// Relative chroma per shade (1 = full chroma of the base color's position).
const CHROMA = [0.12, 0.28, 0.5, 0.72, 0.88, 0.97, 1, 0.97, 0.9, 0.82];

// ---------- hex <-> sRGB ----------

function parseHex(input: string): [number, number, number] {
  let hex = input.trim().replace(/^#/, "");
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((ch) => ch + ch)
      .join("");
  if (!/^[0-9a-f]{6}$/i.test(hex)) {
    throw new Error(`Invalid hex color: "${input}". Use #rgb or #rrggbb.`);
  }
  const n = parseInt(hex, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function toHex([r, g, b]: [number, number, number]): string {
  const ch = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${ch(r)}${ch(g)}${ch(b)}`;
}

// ---------- sRGB <-> OKLCH ----------

const toLinear = (v: number) =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
const fromLinear = (v: number) =>
  v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;

function rgbToOklch(rgb: [number, number, number]): Oklch {
  const [r, g, b] = rgb.map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const h = (Math.atan2(B, A) * 180) / Math.PI;
  return { l: L, c: Math.hypot(A, B), h: h < 0 ? h + 360 : h };
}

/** Returns linear-sRGB (may be out of [0,1] if out of gamut). */
function oklchToLinearRgb({ l: L, c, h }: Oklch): [number, number, number] {
  const rad = (h * Math.PI) / 180;
  const A = c * Math.cos(rad);
  const B = c * Math.sin(rad);

  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb: number[]) =>
  rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** Reduces chroma (keeping lightness and hue) until the color fits in sRGB. */
function oklchToHex(color: Oklch): string {
  let { c } = color;
  if (!inGamut(oklchToLinearRgb(color))) {
    let lo = 0;
    let hi = c;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToLinearRgb({ ...color, c: mid }))) lo = mid;
      else hi = mid;
    }
    c = lo;
  }
  const lin = oklchToLinearRgb({ ...color, c });
  return toHex(lin.map(fromLinear) as [number, number, number]);
}

// ---------- generator ----------

export interface GeneratedColors {
  colors: MantineColorsTuple;
  /** Index (0-9) where the input color sits unchanged. */
  baseIndex: MantineColorShade;
}

function transformShade(index: number): MantineColorShade {
  return index as MantineColorShade;
}

export function generateColors(baseHex: string): GeneratedColors {
  const base = rgbToOklch(parseHex(baseHex));

  // 1. Which shade does the input belong to?
  let baseIndex = 0;
  LIGHTNESS.forEach((l, i) => {
    if (Math.abs(l - base.l) < Math.abs(LIGHTNESS[baseIndex] - base.l))
      baseIndex = i;
  });

  // 2. Shift the lightness scale so the base index matches the input exactly,
  //    fading the shift out toward both ends so 0 stays light and 9 stays dark.
  const delta = base.l - LIGHTNESS[baseIndex];
  const lightness = LIGHTNESS.map((l, i) => {
    if (i === baseIndex) return base.l;
    const span = i < baseIndex ? baseIndex : 9 - baseIndex;
    const weight = span === 0 ? 0 : 1 - Math.abs(i - baseIndex) / (span + 1);
    return Math.min(0.99, Math.max(0.05, l + delta * weight));
  });

  // 3. Scale chroma relative to the base shade's position.
  //    Grays/near-grays (tiny chroma) stay neutral automatically.
  const chroma = CHROMA.map((f) => (base.c * f) / CHROMA[baseIndex]);

  // 4. Build the tuple; the base shade is returned verbatim.
  const normalizedBase = toHex(parseHex(baseHex));
  const colors = lightness.map((l, i) =>
    i === baseIndex
      ? normalizedBase
      : oklchToHex({ l, c: chroma[i], h: base.h }),
  ) as unknown as MantineColorsTuple;

  return { colors, baseIndex: transformShade(baseIndex) };
}
