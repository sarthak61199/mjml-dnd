import path from "path";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  {
    ignores: ["node_modules", "dist", "build", ".vscode", ".idea", ".git", "*.d.ts"],
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
        JSX: "readonly",
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          paths: ["src"],
          alias: {
            "@": path.resolve("src"),
          },
        },
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react: reactPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      prettier: prettierPlugin,
    },
    rules: {
      // Base ESLint rules
      ...js.configs.recommended.rules,

      // React rules
      ...reactHooks.configs.recommended.rules,
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-pascal-case": "error",
      "react/no-direct-mutation-state": "error",
      "react/require-render-return": "error",

      // React Refresh
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // Import rules - relaxed for path aliases
      "import/no-unresolved": "off", // Turned off because we're using path aliases
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // Accessibility rules
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/role-has-required-aria-props": "error",

      // Prettier integration
      "prettier/prettier": "error",

      // General best practices
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z_]",
          argsIgnorePattern: "^_",
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "no-duplicate-imports": "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-case-declarations": "off", // Allow declarations in case blocks
      eqeqeq: ["error", "always", { null: "ignore" }],
    },
  },
];
