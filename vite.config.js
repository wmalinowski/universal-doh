/// <reference types="vitest/config" />

import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "universal-doh",
    },
    sourcemap: "hidden",
  },
  define: {
    __LIB_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
  test: {
    coverage: {
      include: ["lib/**/*.ts"],
      thresholds: {
        functions: 70,
      },
    },
  },
});
