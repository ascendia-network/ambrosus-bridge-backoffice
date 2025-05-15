import {Connection, LAMPORTS_PER_SOL, PublicKey} from '@solana/web3.js';
import {utils} from 'ethers';

export const getSolBalance = async (publicKey) => {
  const connection = new Connection('https://api.devnet.solana.com');
  const address = new PublicKey(publicKey);

  const balance = await connection.getBalance(address);
  return utils.parseEther(`${balance / LAMPORTS_PER_SOL}`);
};
