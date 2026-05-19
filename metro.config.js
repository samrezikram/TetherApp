const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const {
  configureMetroForWDK,
} = require("@tetherto/wdk-react-native-provider/metro-polyfills");

const config = configureMetroForWDK(getDefaultConfig(__dirname));

config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver?.extraNodeModules,
    "expo-crypto": path.resolve(__dirname, "src/shims/expo-crypto.ts"),
    "react-native-fast-pbkdf2": path.resolve(
      __dirname,
      "src/shims/react-native-fast-pbkdf2.ts",
    ),
  },
};

module.exports = config;
