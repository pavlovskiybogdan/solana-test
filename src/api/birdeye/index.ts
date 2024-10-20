import axios from 'axios';

const baseUrl = 'https://public-api.birdeye.so';

export const getTokenInfo = async (
  tokenContractAddress: string,
) => {
  const { data: result } = await axios.request({
    method: 'GET',
    url: `${baseUrl}/defi/token_overview`,
    params: {
      address: tokenContractAddress,
    },
    headers: {
      'X-API-KEY': process.env.BIRDEYE_API_KEY,
    },
  });

  return result.data;
}
