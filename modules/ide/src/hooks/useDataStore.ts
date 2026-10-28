import { useLocalStorage } from "@mantine/hooks";
import type { Dispatch, SetStateAction } from "react";
import type { Data, DataStore } from "#service/IDE/type";

type UseDataStoreReturnType = [
  DataStore[],
  Dispatch<SetStateAction<DataStore[]>>,
];

export default function useDataStore(): UseDataStoreReturnType {
  const [data, setData] = useLocalStorage<DataStore[]>({
    key: "ide:datastore",
    defaultValue: [],
    serialize: (value: DataStore[]) => {
      return JSON.stringify(value);
    },
    deserialize: (str: string | undefined) => {
      const store = JSON.parse(str ?? "[]") as DataStore[];
      return store;
    },
  });
  return [data, setData];
}
