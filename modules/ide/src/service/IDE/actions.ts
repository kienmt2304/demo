import type { Dispatch, SetStateAction } from "react";
import type { Data, DataStore } from "./type";
import { getEntriesOfFileOrFolder } from "./utils";

type NewFileProps = {
  name: string;
  path: string;
  setData: Dispatch<SetStateAction<DataStore[]>>;
};

export function newFile({ name, path, setData }: NewFileProps) {
  setData((data) => [
    ...data,
    {
      id: `${path}/${name}`,
      name,
      parent: path,
      type: "file",
    },
  ]);
}

export function newFolder({ name, path, setData }: NewFileProps) {
  setData((data) => [
    ...data,
    {
      id: `${path}/${name}`,
      name,
      parent: path,
      type: "folder",
    },
  ]);
}

type OpenFileProps = {
  name: string;
  setOpenedFiles: Dispatch<SetStateAction<string[]>>;
  setActiveFile: Dispatch<
    SetStateAction<{
      prev?: string[];
      current?: string;
    }>
  >;
  setExpandedState: Dispatch<SetStateAction<Record<string, boolean>>>;
};

export function openFile({
  name,
  setOpenedFiles,
  setActiveFile,
  setExpandedState,
}: OpenFileProps) {
  const entries = getEntriesOfFileOrFolder(name);
  setExpandedState((state) => ({
    ...state,
    ...entries.reduce<Record<string, boolean>>((prev, curr) => {
      prev[curr] = true;
      return prev;
    }, {}),
  }));
  setOpenedFiles((values) => Array.from(new Set([...values, name])));
  setActiveFile((prev) => ({
    current: name,
    prev: [...(prev.prev ?? []), prev.current ?? ""].filter(Boolean),
  }));
}

type OpenFolderProps = {
  name: string;
  setExpandedState: Dispatch<SetStateAction<Record<string, boolean>>>;
};

export function openFolder({ name, setExpandedState }: OpenFolderProps) {
  const entries = getEntriesOfFileOrFolder(name);
  setExpandedState((state) => ({
    ...state,
    ...entries.reduce<Record<string, boolean>>((prev, curr) => {
      prev[curr] = true;
      return prev;
    }, {}),
  }));
}
