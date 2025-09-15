import baseConfig, { defineConfig } from "@hiredtobe/eslint-config";

export default defineConfig(...baseConfig, {
  languageOptions: {
    parserOptions: {
      project: [
        "./tsconfig.json",
        "./tsconfig.app.json",
        "./tsconfig.node.json",
      ],
    },
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: [
          "./tsconfig.json",
          "./tsconfig.app.json",
          "./tsconfig.node.json",
        ],
      },
    },
  },
});
