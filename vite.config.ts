import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";

function resolveViteCacheDir(): string {
  const fromEnv = process.env.VITE_CACHE_DIR?.trim();
  if (fromEnv) {
    const dir = path.resolve(fromEnv);
    fs.mkdirSync(dir, { recursive: true });
    return dir;
  }
  try {
    if (fs.existsSync("E:\\")) {
      const dir = "E:/lanchonete-vite-cache";
      fs.mkdirSync(dir, { recursive: true });
      return dir;
    }
  } catch {
    /* fallback */
  }
  return path.resolve(__dirname, "node_modules/.vite");
}

export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE?.trim() || "/",
  cacheDir: resolveViteCacheDir(),
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
