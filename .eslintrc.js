module.exports = {
  root: true,
  extends: ["@react-native"],
  rules: {
    "no-console": "error",
  },
  overrides: [
    {
      files: ["src/infrastructure/logging/logger.ts"],
      rules: {
        "no-console": "off",
      },
    },
    {
      files: ["tests/**/*.ts", "tests/**/*.tsx"],
      rules: {
        "no-console": "off",
      },
    },
  ],
};
