import * as dotenv from 'dotenv';
import axios from 'axios';
import * as solanaWeb3 from '@solana/web3.js';
import bs58 from 'bs58';
import * as bip39 from 'bip39';
import { initializeWallet } from './wallets';
import { fetchTokens } from './api/bitquery';

dotenv.config();

const rpcURL = solanaWeb3.clusterApiUrl('mainnet-beta');
const connection = new solanaWeb3.Connection(rpcURL);

const start = async () => {
  const keyPair = await initializeWallet(process.env.PRIVATE_KEY);
  console.log(`Wallet initialized - ${keyPair.publicKey.toString()}`);

  const balance = await connection.getBalance(keyPair.publicKey);
  console.log(`Wallet balance - ${balance / solanaWeb3.LAMPORTS_PER_SOL} SOL`);

  const tokens = await fetchTokens();
  console.log(tokens)
}

start();
