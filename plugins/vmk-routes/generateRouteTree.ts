import type { RouteMeta } from "./scanRoutes";

interface RouteTreeNode {
  id?: string;
  path?: string;
  element: string;
  children: RouteTreeNode[];
}

/**
 * Generate React Router route tree with:
 * - Infinite layout nesting
 * - Proper children aggregation under the same layout
 * - Support for page.noWrap.tsx (detached from parent layouts)
 */
export function generateRouteTreeCode(routes: RouteMeta[]): string {
  const imports: string[] = [`import React from "react";`, `import { lazy } from "react";`];
  const layoutCache = new Map<string, string>();
  const pageCache = new Map<string, string>();

  // Step 1: Import all pages and layouts
  routes.forEach((route, index) => {
    const pageId = `Page${index}`;
    pageCache.set(route.componentPath, pageId);
    imports.push(`const ${pageId} = lazy(() => import("@/${route.componentPath}"));`);

    if (!route.isNoWrap) {
      route.layoutPaths.forEach((layoutPath) => {
        if (!layoutCache.has(layoutPath)) {
          const layoutId = `Layout${layoutCache.size}`;
          layoutCache.set(layoutPath, layoutId);
          imports.push(`const ${layoutId} = lazy(() => import("@/${layoutPath}"));`);
        }
      });
    }
  });

  // Step 2: Build nested tree (grouping by layout paths)
  function buildTree(routes: RouteMeta[]): RouteTreeNode[] {
    const root: RouteTreeNode[] = [];

    for (const route of routes) {
      const pageId = pageCache.get(route.componentPath)!;

      // Skip layout inheritance for noWrap pages
      if (route.isNoWrap) {
        root.push({
          path: route.path,
          element: `React.createElement(${pageId})`,
          children: [],
        });
        continue;
      }

      let currentLevel = root;
      for (const layoutPath of route.layoutPaths) {
        const layoutId = layoutCache.get(layoutPath)!;
        let existing = currentLevel.find((n) => n.id === layoutId);

        if (!existing) {
          existing = {
            id: layoutId,
            element: `React.createElement(${layoutId})`,
            children: [],
          };
          currentLevel.push(existing);
        }
        currentLevel = existing.children;
      }

      currentLevel.push({
        path: route.path,
        element: `React.createElement(${pageId})`,
        children: [],
      });
    }

    return root;
  }

  const routeTree = buildTree(routes);

  // Step 3: Serialize tree to static code
  function serializeRoutes(nodes: RouteTreeNode[]): string {
    return `[${nodes
      .map((node) => {
        const children =
          node.children.length > 0 ? `, children: ${serializeRoutes(node.children)}` : "";
        const path = node.path ? `path: "${node.path}", ` : "";
        return `{ ${path}element: ${node.element}${children} }`;
      })
      .join(",\n")}]`;
  }

  return `
${imports.join("\n")}

export default ${serializeRoutes(routeTree)};
`;
}
