import {Connection, PublicKey} from '@solana/web3.js';
import {getAccount, getAssociatedTokenAddressSync, getMint} from '@solana/spl-token';

export async function getSolTokenBalance(tokenAddress, wallet) {
  try {
    const connection = new Connection('https://api.devnet.solana.com');
    const tokenMintAddress = new PublicKey(tokenAddress);
    const walletAddress = new PublicKey(wallet);

    const [pda] = PublicKey.findProgramAddressSync([Buffer.from("token"), tokenMintAddress.toBuffer()], walletAddress)
    const ata = getAssociatedTokenAddressSync(tokenMintAddress, pda, true);
    const tokenAccount = await getAccount(connection, ata);
    const mintInfo = await getMint(connection, tokenMintAddress);

    const decimals = mintInfo.decimals;
    const rawAmount = tokenAccount.amount;
    return Number(rawAmount) / 10 ** decimals;
  } catch (error) {
    console.error('Error getting token balance:', error);
  }
}
