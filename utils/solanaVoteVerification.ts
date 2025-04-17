import * as anchor from '@project-serum/anchor';
import { Program, web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '../program/idl.json';

const PROGRAM_ID = new PublicKey('YourProgramIdHere');

export const verifyVoteOnChain = async (
  wallet: anchor.Wallet,
  pollId: number,
  option: string,
  userId: number
) => {
  const provider = new anchor.AnchorProvider(
    new web3.Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com'),
    wallet,
    { commitment: 'confirmed' }
  );
  const program = new Program(idl as anchor.Idl, PROGRAM_ID, provider);

  const [voteAccount] = await web3.PublicKey.findProgramAddress(
    [
      Buffer.from('vote'),
      new web3.PublicKey(pollId.toString()).toBuffer(),
      new web3.PublicKey(userId.toString()).toBuffer(),
    ],
    PROGRAM_ID
  );

  try {
    await program.rpc.recordVote(
      pollId,
      option,
      userId,
      {
        accounts: {
          vote: voteAccount,
          user: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
        signers: [wallet.payer],
      }
    );
    return true;
  } catch (error) {
    console.error('Solana vote verification failed:', error);
    return false;
  }
};



