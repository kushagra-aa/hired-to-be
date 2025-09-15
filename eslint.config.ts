import { defineConfig } from "@hiredtobe/eslint-config";

export default defineConfig({
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
