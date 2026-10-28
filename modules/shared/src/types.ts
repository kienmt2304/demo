import type { ReactNode } from "react";

export type ReactElementWithChildren = {
  children: ReactNode;
};

export type Page = {
  name: string;
  link: `/${string}`;
  title: string;
  number: number;
  mask?: boolean;
};

export type Modifier = "mod" | "meta" | "ctrl" | "alt" | "shift";

export type Shortcut =
  | "/"
  | `${Modifier}+${string}`
  | `${Modifier}+${Modifier}+${string}`;
