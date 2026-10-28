import type { Settings } from "./types";

type Compact<P> = {
  [K in keyof P as [P[K]] extends [undefined] ? never : K]: Exclude<
    P[K],
    undefined
  >;
};

export default function compact<P extends Partial<Settings>>(
  input: P & Record<Exclude<keyof P, keyof Settings>, never>,
): Compact<P> {
  const res: Partial<Record<keyof P, unknown>> = {};
  for (const key of Object.keys(input) as Array<keyof P>) {
    if (input[key] !== undefined) res[key] = input[key];
  }
  return res as unknown as Compact<P>;
}
