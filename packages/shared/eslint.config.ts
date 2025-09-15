import baseConfig, { defineConfig } from "@hiredtobe/eslint-config";

export default defineConfig(...baseConfig, {
  languageOptions: {
    parserOptions: {
      project: ["./tsconfig.json"],
    },
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: ["./tsconfig.json"],
      },
    },
  },
});
