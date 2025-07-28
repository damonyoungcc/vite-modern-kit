import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vmkRoutes from "./plugins/vmk-routes";
import path from "path";

export default defineConfig({
  plugins: [react(), vmkRoutes()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@/styles/_variables.scss" as *;
        `,
      },
    },
  },
});
