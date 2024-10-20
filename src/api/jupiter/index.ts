import axios from 'axios';

const quoteJupUrl = 'https://quote-api.jup.ag';
const swapMode = 'ExactIn';

export const getJupQuote = async (
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number,
) => {
  const { data: quote } = await axios.request({
    method: 'GET',
    url: `${quoteJupUrl}/v6/quote`,
    params: {
      inputMint,
      outputMint,
      amount,
      slippageBps,
      swapMode,
    },
  });
  return quote;
}

export const getJupSwapTransaction = async (
  quoteResponse: Record<any, any>,
  userPublicKey: string,
  wrapAndUnwrapSol = true,
) => {
  const { data: swapTransaction } = await axios.request({
    method: 'POST',
    url: `${quoteJupUrl}/v6/swap`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      quoteResponse,
      userPublicKey,
      wrapAndUnwrapSol,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: 'auto',
    },
  });
  return swapTransaction;
}
