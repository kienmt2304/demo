import { useEffect, useMemo, useRef, useState } from "react";
import type { IDECommandContext } from "#service/IDE/type";

export default function useTerminalStore(id: string) {
  const [contentStream, setContentStream] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [ctxid, setID] = useState(() => id);

  return { contentStream, inputRef };
}
