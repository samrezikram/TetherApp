const fastPbkdf2 = {
  async derive(): Promise<string> {
    throw new Error(
      "react-native-fast-pbkdf2 shim invoked. TON is not configured for this app.",
    );
  },
};

export default fastPbkdf2;
