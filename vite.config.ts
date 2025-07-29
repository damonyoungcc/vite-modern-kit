import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vmkRoutes from "./plugins/vmk-routes";
import logScannedDeps from "./plugins/logScannedDeps";
import path from "path";
import mdx from "@mdx-js/rollup";
import rehypePrism from "rehype-prism-plus";

export default defineConfig({
  plugins: [
    logScannedDeps(),
    react(),
    vmkRoutes(),
    mdx({
      rehypePlugins: [rehypePrism], // 启用代码高亮
    }),
  ],
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
