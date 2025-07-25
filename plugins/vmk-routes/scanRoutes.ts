import fs from "fs";
import path from "path";

export interface RouteMeta {
  path: string;              // URL route path, e.g. /a/:id/*
  absolutePath: string;      // Absolute file path to the page component
  componentPath: string;     // Relative import path from src/
  layoutPaths: string[];     // Layout components from outer to inner
  disableLayout?: boolean;   // Whether to skip layout wrapping
}

const PAGE_FILE = "page.tsx";
const LAYOUT_FILE = "_layout.tsx";

export function scanRoutes(pagesDir: string): RouteMeta[] {
  const routes: RouteMeta[] = [];
  const routeMap = new Map<string, string>(); // Detect route path conflicts

  function walk(
    dir: string,
    parentSegments: string[],
    parentLayouts: string[]
  ) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    // Inherit parent layouts and append current _layout.tsx if exists
    const layoutPath = files.find((f) => f.isFile() && f.name === LAYOUT_FILE);
    const currentLayouts = layoutPath
      ? [...parentLayouts, path.join(dir, layoutPath.name)]
      : [...parentLayouts];

    for (const file of files) {
      const absPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        // Detect conflicting page.tsx and index/page.tsx in same directory
        const hasPage = fs.existsSync(path.join(absPath, PAGE_FILE));
        const hasIndexPage = fs.existsSync(
          path.join(absPath, "index", PAGE_FILE)
        );
        if (hasPage && hasIndexPage) {
          throw new Error(
            `Route conflict in "${absPath}": both page.tsx and index/page.tsx exist.`
          );
        }
        walk(absPath, [...parentSegments, file.name], currentLayouts);
      } else if (file.name === PAGE_FILE) {
        const relPath = path.relative(pagesDir, dir);
        const segments = relPath.split(path.sep).filter(Boolean);

        // Convert segments like [id], [...all], etc. to route params
        const rawRoutePath =
          segments.length === 0
            ? "/"
            : "/" + segments.map(toRouteSegment).join("/");

        const componentPath = path
          .relative(path.resolve("src"), path.join(dir, PAGE_FILE))
          .replace(/\\/g, "/");

        // Normalize path for fallback (*) and trailing slash cleanup
        const normalizedPath = normalizePath(rawRoutePath, componentPath);

        // Check route path conflicts
        if (routeMap.has(normalizedPath)) {
          throw new Error(
            `Route path conflict: "${routeMap.get(
              normalizedPath
            )}" and "${absPath}" both map to "${normalizedPath}"`
          );
        }

        routeMap.set(normalizedPath, absPath);

        routes.push({
          path: normalizedPath,
          absolutePath: path.join(dir, PAGE_FILE),
          componentPath,
          layoutPaths: currentLayouts.map((p) =>
            path.relative(path.resolve("src"), p).replace(/\\/g, "/")
          ),
          disableLayout: checkDisableLayout(path.join(dir, PAGE_FILE)),
        });
      }
    }
  }

  walk(pagesDir, [], []);
  return routes;
}

/**
 * Convert directory segment to route-friendly syntax.
 * e.g. [id] => :id, [...all] => *
 */
function toRouteSegment(segment: string): string {
  if (segment.startsWith("[") && segment.endsWith("]")) {
    const content = segment.slice(1, -1);
    return content.startsWith("...") ? "*" : `:${content}`;
  }
  return segment === "index" ? "" : segment;
}

/**
 * Normalize route path:
 * - Remove trailing slash (except "/")
 * - Convert 404/page.tsx to "*"
 */
function normalizePath(routePath: string, componentPath: string): string {
  if (componentPath === "pages/404/page.tsx") return "*";

  const clean = routePath.replace(/\/+$/, "");
  return clean === "" ? "/" : clean;
}

/**
 * Naively detect `disableLayout` from content keyword.
 * You can later replace this with `export const disableLayout = true` analysis.
 */
function checkDisableLayout(filePath: string): boolean {
  const content = fs.readFileSync(filePath, "utf-8");
  return content.includes("disableLayout");
}
