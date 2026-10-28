import { Text } from "@mantine/core";
import {
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type Ref,
} from "react";
import type { FocusInput } from "#service/IDE/type";

export default function TerminalNew({ ref }: { ref: Ref<FocusInput> }) {
  const offsetRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [indent, setIndent] = useState(0);

  useLayoutEffect(() => {
    setIndent((offsetRef.current?.offsetWidth ?? 0) + 8);
  }, []);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  const onInput = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== "Enter") {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
    },
    [],
  );

  return (
    <Text
      component="pre"
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        display: "block",
        padding: ".5rem",
      }}
    >
      <Text pos="absolute" top={".5rem"} left={".5rem"} ref={offsetRef}>
        @User root {">"}
      </Text>
      <textarea
        style={{
          textIndent: indent,
          width: "100%",
          border: "none",
          outline: "none",
          resize: "none",
        }}
        cols={20}
        ref={inputRef}
        onKeyDown={onInput}
      />
    </Text>
  );
}
