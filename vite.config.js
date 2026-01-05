/* eslint-env node */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// Determine base path for GitHub Pages deployments.
// Priority:
// 1. VITE_GH_PAGES_BASE env var (recommended)
// 2. `homepage` field in package.json (if provided) -> uses its pathname
// 3. fallback to '/'
function resolveBase() {
  const ghPagesEnv = globalThis.process?.env?.VITE_GH_PAGES_BASE;
  if (ghPagesEnv) return ghPagesEnv;

  // Try env provided by npm scripts
  const npmHomepageEnv = globalThis.process?.env?.npm_package_homepage;
  if (npmHomepageEnv) {
    try {
      const u = new URL(npmHomepageEnv);
      return u.pathname.endsWith("/") ? u.pathname : `${u.pathname}/`;
    } catch {
      return npmHomepageEnv;
    }
  }

  // Fallback: read package.json directly (more reliable in some CI environments)
  try {
    const cwd = globalThis.process?.cwd?.() ?? ".";
    const pkgPath = path.resolve(cwd, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    if (pkg && pkg.homepage) {
      try {
        const u = new URL(pkg.homepage);
        return u.pathname.endsWith("/") ? u.pathname : `${u.pathname}/`;
      } catch {
        return pkg.homepage;
      }
    }
  } catch (e) {
    // ignore and fall back to '/'
  }

  return "/";
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  base: resolveBase(),
  plugins: [react()],
}));
