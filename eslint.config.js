import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
  {
    ignores: ["dist/**/*", "dist-site/**/*", "coverage/**/*"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
);
