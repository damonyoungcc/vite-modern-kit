import type { Plugin } from "vite";
import path from "path";
import { scanRoutes } from "./scanRoutes";
import { generateRouteTreeCode } from "./generateRouteTree.ts";

export default function VmkRoutesPlugin(): Plugin {
  const virtualModuleId = "virtual:vmk-routes";
  const resolvedId = "\0" + virtualModuleId;

  return {
    name: "vmk-routes",
    resolveId(id) {
      if (id === virtualModuleId) return resolvedId;
    },
    load(id) {
      if (id !== resolvedId) return;
      const pagesDir = path.resolve("src/pages");
      const routes = scanRoutes(pagesDir);
      console.log("🚀 ~ file: index.ts:15 ~ load ~ routes:", routes);
      return generateRouteTreeCode(routes); // 🟢 用你写的封装函数
    },
  };
}
