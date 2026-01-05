import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Determine base path for GitHub Pages deployments.
// Priority:
// 1. VITE_GH_PAGES_BASE env var (recommended)
// 2. `homepage` field in package.json (if provided) -> uses its pathname
// 3. fallback to '/'
function resolveBase() {
  if (process.env.VITE_GH_PAGES_BASE) return process.env.VITE_GH_PAGES_BASE;
  if (process.env.npm_package_homepage) {
    try {
      const u = new URL(process.env.npm_package_homepage);
      return u.pathname.endsWith('/') ? u.pathname : `${u.pathname}/`;
    } catch {
      // not a full URL, maybe it's already a path
      return process.env.npm_package_homepage;
    }
  }
  return '/';
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  base: resolveBase(),
  plugins: [react()],
}))
