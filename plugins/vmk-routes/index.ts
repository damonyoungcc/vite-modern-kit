import type { Plugin, HotUpdateOptions, ViteDevServer } from "vite";
import path from "path";
import { scanRoutes } from "./scanRoutes";
import { generateRouteTreeCode } from "./generateRouteTree";

const virtualModuleId = "virtual:vmk-routes";
const resolvedId = "\0" + virtualModuleId;
const pagesDir = path.resolve("src/pages");

// Store the latest generated routes code
let routesCode = "";

/**
 * Generate routes code string from filesystem.
 */
function generateRoutesCode(): string {
  const routes = scanRoutes(pagesDir);
  return generateRouteTreeCode(routes);
}

/**
 * Invalidate the virtual module so Vite knows it must reload.
 */
function invalidateVirtualModule(server: ViteDevServer) {
  const module = server.moduleGraph.getModuleById(resolvedId);
  if (module) {
    server.moduleGraph.invalidateModule(module);
  }
}

/**
 * VmkRoutesPlugin
 * Automatically generates React Router routes from the filesystem
 * and updates them on file changes (with HMR support).
 */
export default function VmkRoutesPlugin(): Plugin {
  return {
    name: "vmk-routes",
    enforce: "pre",

    resolveId(id) {
      if (id === virtualModuleId) return resolvedId;
    },

    load(id) {
      if (id === resolvedId) {
        if (!routesCode) {
          routesCode = generateRoutesCode(); // Generate once on initial load
        }
        return routesCode;
      }
    },

    hotUpdate(options: HotUpdateOptions) {
      const { file, server, modules, type } = options;

      // Check if the file is a page or layout file can cause route changes
      const isPage = file.endsWith("page.tsx") || file.endsWith("page.noWrap.tsx");
      const isLayout = file.endsWith("_layout.tsx");
      const isRelevant = file.includes("/src/pages/") && (isPage || isLayout);

      if (!isRelevant) return;

      console.log(`[vmk-routes] File change detected: ${file}`);

      // If the change is in a page or layout file, we need to regenerate routes
      if (type === "create" || type === "delete") {
        console.log("[vmk-routes] Structural change → triggering full reload");

        routesCode = generateRoutesCode();
        invalidateVirtualModule(server);

        server.ws.send({ type: "full-reload" });
        return [];
      }

      // if just content change, we just need HMR update
      if (type === "update") {
        console.log("[vmk-routes] Content change → HMR update only");
        return modules;
      }
    },
  };
}
