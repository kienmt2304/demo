import { BrowserRouter, Routes, Route } from "react-router";

/* import */
import DemoIde from "@demo/ide";
import DemoOnboarding from "@demo/onboarding";
import DemoTable from "@demo/table";

export default function Modules() {
  return (
    <Routes>
      {/* route modules */}
      <Route path="/ide" element={<DemoIde />} />
      <Route path="/onboarding" element={<DemoOnboarding />} />
      <Route path="/table" element={<DemoTable />} />
      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}
