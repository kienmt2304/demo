import { useContext } from "react";
import IDEContext from "#components/Providers/IDEProvider/context";

export default function useIDEContext() {
  const props = useContext(IDEContext);
  return props;
}
