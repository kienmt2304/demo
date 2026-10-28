import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
    },
  },
  server: {
    watch: {
      ignored: ["**/build/**", "**/.cache/**"],
    },
  },
  optimizeDeps: {
    include: [
      "@mantine/core",
      "@mantine/hooks",
      "@mantine/form",
      "@mantine/notifications",
    ],
  },
});
