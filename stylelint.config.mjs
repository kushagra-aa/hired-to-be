// stylelint.config.mjs
export default {
  extends: ["stylelint-config-standard", "stylelint-config-tailwindcss"],
  plugins: ["stylelint-order"],
  rules: {
    "at-rule-no-unknown": null,
    "no-descending-specificity": null,
    "order/properties-alphabetical-order": true,
    "selector-class-pattern": "^[a-z0-9_]+$", // allow snake_case - NO kebab-case or camelCase
  },
};
