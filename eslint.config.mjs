import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "tests/**",
  ]),
  {
    rules: {
      // Content pages have apostrophes/quotes — safe
      "react/no-unescaped-entities": "off",

      // Pre-existing patterns in codebase — downgrade to warn until refactored
      "@next/next/no-img-element": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": "warn",

      // Next.js 16 / React 19 stricter rules — warn only until code is updated
      "@next/next/no-sync-scripts": "warn",
    },
  },
]);

export default eslintConfig;
