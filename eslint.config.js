const js = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

const globals = {
  __DEV__: "readonly",
  afterEach: "readonly",
  beforeEach: "readonly",
  console: "readonly",
  describe: "readonly",
  expect: "readonly",
  fetch: "readonly",
  it: "readonly",
  jest: "readonly",
  process: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
};

module.exports = [
  {
    ignores: [
      ".expo/**",
      "android/**",
      "coverage/**",
      "ios/**",
      "node_modules/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["*.config.js", "babel.config.js", "metro.config.js", "scripts/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        __dirname: "readonly",
        console: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
      },
      sourceType: "commonjs",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals,
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "no-console": "error",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    files: ["src/infrastructure/logging/logger.ts"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["tests/**/*.{ts,tsx}", "jest.config.js"],
    rules: {
      "no-console": "off",
    },
  },
];
