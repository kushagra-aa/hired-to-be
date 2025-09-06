import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:8000", // Wrangler dev server
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
