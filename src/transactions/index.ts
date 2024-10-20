import {
  Connection,
  PublicKey,
  Keypair,
  VersionedTransaction,
} from '@solana/web3.js';
import { getMint } from '@solana/spl-token';
import { getJupQuote, getJupSwapTransaction } from '../api/jupiter';

export class SolTransactionsService {
  private readonly connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async buildSwapTransaction(
    publicKey: PublicKey,
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps = 0.5,
  ) {
    const inputMintData = await getMint(this.connection, new PublicKey(inputMint));

    const inputAmount = amount * Math.pow(10, inputMintData.decimals);
    const slippagePercentage = slippageBps * 100;

    try {
      const jupQuote = await getJupQuote(
        inputMint,
        outputMint,
        inputAmount,
        slippagePercentage,
      );
      return getJupSwapTransaction(
        jupQuote,
        publicKey.toString(),
        true,
      );
    } catch (err) {
      console.error('Error building swap transaction:', err);
      throw new Error('Error building swap transaction');
    }
  }

  async swap(
    keypair: Keypair,
    swapTransactionObj: Record<any, any>,
  ) {
    // @ts-ignore
    const swapTransactionBuf = Buffer.from(swapTransactionObj.swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    transaction.sign([keypair]);

    const latestBlockHash = await this.connection.getLatestBlockhash();

    const rawTransaction = transaction.serialize()
    const txId = await this.connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries: 2
    });
    await this.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: txId,
    });

    return txId;
  }
}
