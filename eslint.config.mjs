import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettierPlugin from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "**/dist",
      "**/node_modules",
      "postcss.config.js",
      "tailwind.config.ts",
      "vite.config.ts",
    ],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      prettier: prettierPlugin,
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
    },
    rules: {
      // ✅ Prettier integration
      "prettier/prettier": [
        "error",
        {
          semi: true,
          singleQuote: false,
          trailingComma: "all",
          printWidth: 80,
          tabWidth: 2,
          endOfLine: "auto",
        },
      ],

      // ✅ General JS rules
      eqeqeq: ["error", "always"],
      "no-var": "error",
      "prefer-const": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",

      // ✅ TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-floating-promises": "error",

      // ✅ React rules
      "react/react-in-jsx-scope": "off", // not needed in React 17+
      "react/prop-types": "off", // using TS instead
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // ✅ Accessibility
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",

      // ✅ Import rules
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
        },
      ],
      "import/no-unresolved": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        // 👇 Add both resolvers
        typescript: {
          project: [
            "./tsconfig.json", // root
            "./app/client/tsconfig.json", // client
            "./app/server/tsconfig.json", // server
          ],
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },
];
