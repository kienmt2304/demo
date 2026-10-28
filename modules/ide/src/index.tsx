import IDE from "./components/IDE";
import IDEProvider from "./components/Providers/IDEProvider";

export default function IDEDemo() {
  return (
    <IDEProvider>
      <IDE />
    </IDEProvider>
  );
}
