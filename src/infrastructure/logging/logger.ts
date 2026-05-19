import { env } from "@/infrastructure/env/env";

type LogLevel = "debug" | "info" | "warn" | "error";

const secretPatterns: RegExp[] = [
  /\b([a-z]+ ){11,23}[a-z]+\b/gi,
  /(private[_-]?key|mnemonic|seed[_-]?phrase|bearer|token)["':=\s]+[^"',\s}]+/gi,
  /\b0x[a-fA-F0-9]{64}\b/g,
];

export function redactedAddress(address: string | null | undefined): string {
  if (!address) {
    return "";
  }

  if (address.length <= 12) {
    return "[REDACTED_ADDRESS]";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function redactSecrets(input: unknown): string {
  const text =
    typeof input === "string"
      ? input
      : JSON.stringify(normalizeLogValue(input), jsonRedactor, 2);

  return secretPatterns.reduce(
    (current, pattern) => current.replace(pattern, "[REDACTED]"),
    text ?? "",
  );
}

function normalizeLogValue(input: unknown): unknown {
  if (input instanceof Error) {
    return {
      name: input.name,
      message: input.message,
      stack: input.stack,
    };
  }

  return input;
}

function jsonRedactor(key: string, value: unknown) {
  if (
    /private|mnemonic|seed|secret|token|authorization|signature/i.test(key)
  ) {
    return "[REDACTED]";
  }

  return value;
}

function emit(level: LogLevel, message: string, context?: unknown) {
  if (env.appEnv === "production" && level === "debug") {
    return;
  }

  const payload = context === undefined ? "" : ` ${redactSecrets(context)}`;
  const line = `[${level}] ${redactSecrets(message)}${payload}`;

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

export const logger = {
  debug: (message: string, context?: unknown) => emit("debug", message, context),
  error: (message: string, context?: unknown) => emit("error", message, context),
  info: (message: string, context?: unknown) => emit("info", message, context),
  warn: (message: string, context?: unknown) => emit("warn", message, context),
};
