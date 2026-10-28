import { ScrollArea } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  type FocusInput,
  type TerminalJob as TerminalJobType,
} from "#service/IDE/type";
import TerminalJob from "./TerminalJob";
import TerminalNew from "./TerminalNew";
import { useRef } from "react";

export default function Terminal() {
  const [activeSession] = useLocalStorage({
    key: "ide:terminal:activesession",
    defaultValue: crypto.randomUUID(),
    getInitialValueInEffect: false,
  });

  const [session] = useLocalStorage<TerminalJobType[]>({
    key: `ide:terminal:session_${activeSession}`,
    defaultValue: [],
  });
  const ref = useRef<FocusInput>(null);

  return (
    <ScrollArea
      h="100%"
      style={{ cursor: "text" }}
      onClick={ref.current?.focus}
      type="always"
    >
      {session.map((job) => (
        <TerminalJob job={job} />
      ))}
      <TerminalNew ref={ref} />
    </ScrollArea>
  );
}
