import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import type { RouteMeta } from "../../plugins/vmk-routes/scanRoutes";

export function generateRoutes(metas: RouteMeta[]): RouteObject[] {
  const sorted = [...metas].sort((a, b) => a.path.length - b.path.length);

  const routes: RouteObject[] = [];
  let fallbackRoute: RouteObject | null = null;

  for (const meta of sorted) {
    const Component = lazy(() => import(`../${meta.componentPath}`));

    // fallback 特殊处理
    if (meta.path === "/404") {
      fallbackRoute = {
        path: "*",
        element: <Component />,
      };
      continue;
    }

    let node: React.ReactNode = <Component />;

    if (!meta.disableLayout && meta.layoutPaths.length > 0) {
      const layouts = meta.layoutPaths.map((layoutPath) =>
        lazy(() => import(`../${layoutPath}`))
      );

      for (let i = layouts.length - 1; i >= 0; i--) {
        const Layout = layouts[i];
        const Inner = node;
        node = <Layout>{Inner}</Layout>;
      }
    }

    routes.push({
      path: normalizeRoute(meta.path),
      element: node,
    });
  }

  // fallback 放最后
  if (fallbackRoute) routes.push(fallbackRoute);

  return routes;
}

// 修正路径，如末尾有 / 就干掉（除了 "/" 本身）
function normalizeRoute(path: string): string {
  return path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
}
