import type { RouteMeta } from "./scanRoutes";
interface RouteTreeNode {
  id?: string;
  path?: string;
  element: string;
  children: RouteTreeNode[];
}

/**
 * Generate React Router route tree using nested structure and lazy loading.
 * Supports layout nesting using `children` and `Outlet`.
 * Pages with `page.noWrap.tsx` will not inherit parent layouts.
 */
export function generateRouteTreeCode(routes: RouteMeta[]): string {
  const imports: string[] = [`import React from "react";`, `import { lazy } from "react";`];
  const layoutCache = new Map<string, string>();
  const pageCache = new Map<string, string>();

  // Create import statements for all unique pages and layouts
  routes.forEach((route, index) => {
    const pageId = `Page${index}`;
    pageCache.set(route.componentPath, pageId);
    imports.push(`const ${pageId} = lazy(() => import("@/${route.componentPath}"));`);

    route.layoutPaths.forEach((layoutPath) => {
      if (!layoutCache.has(layoutPath)) {
        const layoutId = `Layout${layoutCache.size}`;
        layoutCache.set(layoutPath, layoutId);
        imports.push(`const ${layoutId} = lazy(() => import("@/${layoutPath}"));`);
      }
    });
  });

  // Convert flat routes into a tree based on layout nesting
  function buildTree(routes: RouteMeta[]): RouteTreeNode[] {
    const root: RouteTreeNode[] = [];

    for (const route of routes) {
      const pageId = pageCache.get(route.componentPath)!;
      const layoutChain = route.layoutPaths.map((layoutPath) => ({
        layoutPath,
        layoutId: layoutCache.get(layoutPath)!,
      }));

      let currentLevel = root;
      for (const { layoutId } of layoutChain) {
        let existing = currentLevel.find((r) => r.id === layoutId);
        if (!existing) {
          existing = {
            id: layoutId,
            element: `React.createElement(${layoutId}, null, React.createElement(React.Fragment))`,
            children: [],
            path: undefined, // layout 路由不写 path（非 index page）
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

  // Convert tree to static code
  function serializeRoutes(nodes: RouteTreeNode[]): string {
    return `[${nodes
      .map((node) => {
        const children =
          node.children && node.children.length > 0
            ? `, children: ${serializeRoutes(node.children)}`
            : "";
        const path = node.path !== undefined ? `path: "${node.path}", ` : "";
        return `{ ${path}element: ${node.element}${children} }`;
      })
      .join(",\n")}]`;
  }

  return `
${imports.join("\n")}

export default ${serializeRoutes(routeTree)};
`;
}
