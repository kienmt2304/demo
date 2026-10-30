import { Routes, Route } from "react-router";
import { lazy } from "react";

/* import */
const DemoIde = lazy(() => import("@demo/ide"));
const DemoOnboarding = lazy(() => import("@demo/onboarding"));
const DemoTable = lazy(() => import("@demo/table"));

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
