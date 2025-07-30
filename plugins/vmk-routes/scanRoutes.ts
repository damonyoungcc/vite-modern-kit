// scanRoutes.ts
import fs from "fs";
import path from "path";

export interface RouteMeta {
  path: string; // URL route path, e.g. /a/:id/*
  componentPath: string; // Relative import path from src/
  layoutPaths: string[]; // Layout components from outer to inner
  isNoWrap: boolean; // Whether the page disables layout inheritance
}

const EXT = ".tsx";
const NO_WRAP_EXT = ".noWrap" + EXT;
const PAGE_BASE_NAME = "page";
const INDEX_PAGE_FILE = path.join("index", `${PAGE_BASE_NAME}${EXT}`);
const LAYOUT_FILE = `_layout${EXT}`;
const NOT_FOUND_PAGE_PATH = "pages/404/page"; // Global 404 fallback
const FALLBACK_DIR_NAME = "[...all]"; // Fallback folder indicator

/**
 * Scan the pages directory for route definitions.
 * - Collects all page components and their layouts.
 * - Normalizes route paths and checks for conflicts.
 *
 * @param pagesDir The root directory containing page components.
 * @returns An array of RouteMeta objects representing the routes.
 */
export function scanRoutes(pagesDir: string): RouteMeta[] {
  const routes: RouteMeta[] = [];
  const routeMap = new Map<string, string>();

  walk(pagesDir, [], []);

  return routes;

  function walk(dir: string, parentSegments: string[], parentLayouts: string[]) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    // Collect layouts from parent and current directory
    const layoutEntry = entries.find((e) => e.isFile() && e.name === LAYOUT_FILE);
    const currentLayouts = layoutEntry
      ? [...parentLayouts, path.join(dir, layoutEntry.name)]
      : [...parentLayouts];

    const hasPage = entries.some(
      (e) => e.name === `${PAGE_BASE_NAME}${EXT}` || e.name === `${PAGE_BASE_NAME}${NO_WRAP_EXT}`
    );
    const hasIndexPage = fs.existsSync(path.join(dir, INDEX_PAGE_FILE));

    // Throw conflict if both page.tsx and index/page.tsx exist
    if (hasPage && hasIndexPage) {
      throw new Error(
        `Route conflict in "${dir}": both ${PAGE_BASE_NAME}${EXT} and ${INDEX_PAGE_FILE} exist.`
      );
    }

    for (const entry of entries) {
      const absPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(absPath, [...parentSegments, entry.name], currentLayouts);
      } else if (
        entry.name === `${PAGE_BASE_NAME}${EXT}` ||
        entry.name === `${PAGE_BASE_NAME}${NO_WRAP_EXT}`
      ) {
        const isNoWrap = entry.name === `${PAGE_BASE_NAME}${NO_WRAP_EXT}`;

        const relPath = path.relative(pagesDir, dir);
        const segments = relPath.split(path.sep).filter(Boolean);

        const isRootCatchAll =
          segments.length === 2 && segments[0] === "index" && /^\[\.\.\..+\]$/.test(segments[1]);

        // ✅ Filter falsy values to prevent double slashes
        const rawRoutePath =
          segments.length === 0
            ? "/"
            : isRootCatchAll
              ? "/*"
              : "/" + segments.map(toRouteSegment).filter(Boolean).join("/");

        const componentPath = path.relative(path.resolve("src"), absPath).replace(/\\/g, "/");

        const normalizedPath = normalizeRoutePath(rawRoutePath, componentPath, segments);

        // Ensure no duplicate route paths
        if (routeMap.has(normalizedPath)) {
          throw new Error(
            `Route path conflict: "${routeMap.get(
              normalizedPath
            )}" and "${absPath}" both map to "${normalizedPath}"`
          );
        }
        routeMap.set(normalizedPath, absPath);

        // ✅ page.noWrap.tsx will not inherit any layout at all
        const layoutPaths = isNoWrap
          ? []
          : currentLayouts.map((p) => path.relative(path.resolve("src"), p).replace(/\\/g, "/"));

        routes.push({
          path: normalizedPath,
          componentPath,
          layoutPaths,
          isNoWrap,
        });
      }
    }
  }
}

/**
 * Convert folder name into route path segment.
 * e.g. [id] => :id, [...all] => *
 */
function toRouteSegment(segment: string): string | null {
  if (segment.startsWith("[") && segment.endsWith("]")) {
    const content = segment.slice(1, -1);
    return content.startsWith("...") ? "*" : `:${content}`;
  }
  return segment === "index" ? null : segment; // ✅ return null instead of ""
}

/**
 * Normalize route path:
 * - Convert root 404 page path to fallback "*"
 * - Convert nested [...all] directories into catch-all "*"
 * - Remove trailing slash except for root
 */
function normalizeRoutePath(routePath: string, componentPath: string, segments: string[]): string {
  const normalized =
    routePath !== "/" && routePath.endsWith("/") ? routePath.slice(0, -1) : routePath;

  // fallback route (root 404)
  const componentWithoutExt = componentPath.replace(/\.noWrap\.tsx$|\.tsx$/, "");
  if (componentWithoutExt === NOT_FOUND_PAGE_PATH) return "*";

  // nested catch-all via [...all] directory
  if (segments.includes(FALLBACK_DIR_NAME)) return "/*";

  return normalized;
}
