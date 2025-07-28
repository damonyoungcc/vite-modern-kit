import type { Plugin, ResolvedConfig } from "vite";

export default function logScannedDeps(): Plugin {
  let resolvedConfig: ResolvedConfig;
  let logged = false; // 用于保证只运行一次

  return {
    name: "log-scanned-deps",
    apply: "serve", // 仅 dev 模式
    configResolved(config) {
      resolvedConfig = config;
    },
    async buildStart() {
      if (logged) return; // 避免 HMR 重复运行
      logged = true;

      const includes = resolvedConfig.optimizeDeps?.include || [];
      const excludes = resolvedConfig.optimizeDeps?.exclude || [];
      console.log("\n[log-scanned-deps] ===== Vite Dependency Scan =====");
      console.log("✅ Includes:", includes.length ? includes : "(auto)");
      console.log("🚫 Excludes:", excludes.length ? excludes : "(none)");
    },
  };
}
