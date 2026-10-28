import { useLocalStorage } from "@mantine/hooks";
import type { SetStateAction } from "react";

export type UseLocalStorageSet<T> = {
  key: string;
  defaultValue: Set<T>;
};

export type UseLocalStorageSetReturnValue<T> = [
  Set<T>,
  (_val: SetStateAction<Set<T>>) => void,
];

export default function useLocalStorageSet<T>({
  key,
  defaultValue,
}: UseLocalStorageSet<T>): UseLocalStorageSetReturnValue<T> {
  const [value, setValue] = useLocalStorage<Set<T>>({
    key,
    defaultValue,
    serialize: (val: Set<T>) => JSON.stringify(Array.from(val)),
    deserialize: (val) => new Set(Array.from(JSON.parse(val ?? "[]"))),
  });

  return [value, setValue];
}
