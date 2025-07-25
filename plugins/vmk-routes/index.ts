// plugins/vmk-routes/index.ts
import type { Plugin } from "vite";
import path from "path";
import { scanRoutes } from "./scanRoutes";

export default function VmkRoutesPlugin(): Plugin {
  const virtualModuleId = "virtual:vmk-routes";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vmk-routes",
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) return;

      const pagesDir = path.resolve("src/pages");
      const routes = scanRoutes(pagesDir);

      const imports: string[] = [];
      const routeDefs: string[] = [];

      routes.forEach((route, index) => {
        const importName = `Page${index}`;
        // 用 "@/..." 替换相对路径
        const importPath = `@/${route.componentPath}`;
        imports.push(
          `const ${importName} = lazy(() => import("${importPath}"));`
        );

        routeDefs.push(
          `{ path: "${route.path}", element: React.createElement(${importName}) }`
        );
      });

      return `
        import { lazy } from "react";
        import React from "react";

        ${imports.join("\n")}

        export default [
          ${routeDefs.join(",\n")}
        ];
      `;
    },
  };
}
