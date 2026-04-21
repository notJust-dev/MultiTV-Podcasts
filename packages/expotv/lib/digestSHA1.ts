import * as Crypto from 'expo-crypto';

export async function digestSHA1(input: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA1,
    input,
    {encoding: Crypto.CryptoEncoding.HEX},
  );
}
