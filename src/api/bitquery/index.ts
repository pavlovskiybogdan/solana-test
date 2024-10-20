import axios from 'axios';

const baseUrl = 'https://streaming.bitquery.io';
const apiKey = 'BQYrVPbYrz6ANbIboILQrZPz6N8vX0Sk';
const auth = 'Bearer ory_at_s64wdiBSIhS5UCe2DRFeelUtkrRk_BrfbLSjtNs-8rk.ghE9zXizj6KFXfc2sGNTxo_ABOzUkjxaLCGAZ6F-0OM';

export const fetchTokens = async () => {
  const { data: result } = await axios.request({
    method: 'POST',
    url: `${baseUrl}/eap`,
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
      'Authorization': auth
    },
    data: {
      query: `
      query MyQuery {
        Solana(dataset: realtime, network: solana) {
          Instructions(
            where: {
              Transaction: { Result: { Success: true }},
              Instruction: { Program: { Address: { is: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" }, Method: { in: ["initializeMint", "initializeMint2", "initializeMint3"] }}}
            }
            orderBy: { ascending: Block_Time }
            limit: { count: 20 }
          ) {
            Block {
              Date
            }
            Instruction {
              Accounts {
                Token {
                  Mint
                  Owner
                }
                Address
              }
              Program {
                AccountNames
              }
            }
            Transaction {
              Signature
              Signer
            }
          }
        }
      }
    `,
      variables: {}
    }
  });

  return result.data.Solana.Instructions
    .map((record: Record<string, any>) => {
      return record.Instruction.Accounts[0].Address;
    })
    .filter((address: string) => address.slice(-4) === 'pump')
}
