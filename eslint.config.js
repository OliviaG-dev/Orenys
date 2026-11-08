import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import { baseConfig } from "./packages/config/eslint.base.js";

export default [
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/.data/**", "**/coverage/**"],
  },
  ...baseConfig,
  {
    files: ["apps/web/**/*.{ts,tsx}", "packages/ui/**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
];
