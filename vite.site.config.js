import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: resolve(__dirname, "site"),
  build: {
    outDir: resolve(__dirname, "dist-site"),
    emptyOutDir: true,
    cssCodeSplit: false,
  },
  base: "/universal-doh/",
  define: {
    __LIB_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
