// plugins/vmk-routes/generateRouteTree.ts
import type { RouteMeta } from "./scanRoutes";

/**
 * Generate static code string for virtual:vmk-routes
 * Handles lazy-loading page and layout components, and wraps layouts correctly.
 */
export function generateRouteTreeCode(routes: RouteMeta[]): string {
  const imports: string[] = [
    `import React from "react";`,
    `import { lazy } from "react";`,
  ];
  const layoutCache = new Map<string, string>();
  const routeDefs: string[] = [];

  routes.forEach((route, index) => {
    const pageId = `Page${index}`;
    imports.push(
      `const ${pageId} = lazy(() => import("@/${route.componentPath}"));`
    );

    let element = `React.createElement(${pageId})`;

    // ✅ layoutPaths 是从外到内，反向包裹
    [...route.layoutPaths].reverse().forEach((layoutPath) => {
      const layoutId =
        layoutCache.get(layoutPath) || `Layout${layoutCache.size}`;
      if (!layoutCache.has(layoutPath)) {
        imports.push(
          `const ${layoutId} = lazy(() => import("@/${layoutPath}"));`
        );
        layoutCache.set(layoutPath, layoutId);
      }
      element = `React.createElement(${layoutId}, null, ${element})`;
    });

    routeDefs.push(`{ path: "${route.path}", element: ${element} }`);
  });

  return `
${imports.join("\n")}

export default [
  ${routeDefs.join(",\n")}
];
`;
}
