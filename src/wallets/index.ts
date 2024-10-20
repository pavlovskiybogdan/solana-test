import * as bip39 from 'bip39';
import * as solanaWeb3 from '@solana/web3.js';
import bs58 from 'bs58';

export const initializeWallet = async (
  privateKey?: string,
): Promise<solanaWeb3.Keypair> => {
  return privateKey
    ? initializeWalletFromPrivateKey(privateKey)
    : generateWallet();
}

const generateWallet = async (): Promise<solanaWeb3.Keypair> => {
  const mnemonic = bip39.generateMnemonic();
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const seedBytes = seed.slice(0, 32);
  const seedPhraseKeyPair = solanaWeb3.Keypair.fromSeed(seedBytes);

  const privateKey = seedPhraseKeyPair.secretKey;
  const base58PrivateKey = bs58.encode(privateKey);
  const readablePrivateKey = Array.from(privateKey)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  console.log('SECRET_PHRASE', mnemonic);
  console.log('PRIVATE_KEY_BASE58', base58PrivateKey);
  console.log('PRIVATE_KEY_STRING', readablePrivateKey);

  return seedPhraseKeyPair;
}

const initializeWalletFromPrivateKey = (
  privateKey: string,
): solanaWeb3.Keypair => {
  return solanaWeb3.Keypair.fromSecretKey(
    new Uint8Array(bs58.decode(privateKey))
  );
}
