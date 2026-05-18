export type CertificatePin = {
  host: string;
  publicKeyHashes: string[];
};

export const certificatePins: CertificatePin[] = [
  {
    host: "wdk-api.tether.io",
    publicKeyHashes: [],
  },
];

export function assertPinnedHost(url: string): void {
  const host = new URL(url).host;
  const configured = certificatePins.some((pin) => pin.host === host);

  if (!configured) {
    throw new Error(`No certificate pin configured for ${host}`);
  }
}
