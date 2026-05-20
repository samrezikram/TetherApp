const { spawnSync } = require("node:child_process");

const REQUIRED = {
  node: "22.17.1",
  npm: "10.9.2",
  java: "21.0.1",
  cocoapods: "1.16.2",
  xcode: "26.5",
};

function run(command, args = []) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.error || result.status !== 0) {
    return null;
  }

  return `${result.stdout}${result.stderr}`.trim();
}

function fail(message) {
  console.error(`Environment check failed: ${message}`);
  process.exitCode = 1;
}

function expectExact(name, actual, expected, installHint) {
  if (!actual) {
    fail(`${name} is not installed. ${installHint}`);
    return;
  }

  if (actual !== expected) {
    fail(`${name} must be ${expected}; found ${actual}. ${installHint}`);
  }
}

const nodeVersion = process.version.replace(/^v/, "");
const npmVersion = run("npm", ["--version"]);
const javaOutput = run("java", ["-version"]);
const javaVersion = javaOutput?.match(/version "([^"]+)"/)?.[1] ?? null;

expectExact("Node.js", nodeVersion, REQUIRED.node, "Run `nvm use`.");
expectExact("npm", npmVersion, REQUIRED.npm, "Run `npm install -g npm@10.9.2`.");
expectExact(
  "Java",
  javaVersion,
  REQUIRED.java,
  "Install JDK 21.0.1 and set JAVA_HOME.",
);

if (process.platform === "darwin") {
  const podVersion = run("pod", ["--version"]);
  const xcodeOutput = run("xcodebuild", ["-version"]);
  const xcodeVersion = xcodeOutput?.match(/Xcode ([^\n]+)/)?.[1] ?? null;

  expectExact(
    "CocoaPods",
    podVersion,
    REQUIRED.cocoapods,
    "Run `sudo gem install cocoapods -v 1.16.2`.",
  );
  expectExact(
    "Xcode",
    xcodeVersion,
    REQUIRED.xcode,
    "Install the pinned Xcode version and select it with `xcode-select`.",
  );
}

if (process.exitCode) {
  process.exit();
}

console.log("Environment check passed.");
