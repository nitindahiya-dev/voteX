// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VotingAppIDL from '../target/idl/voting_app.json'
import type { VotingApp } from '../target/types/voting_app'

// Re-export the generated IDL and type
export { VotingApp, VotingAppIDL }

// The programId is imported from the program IDL.
export const VOTING_APP_PROGRAM_ID = new PublicKey(VotingAppIDL.address)

// This is a helper function to get the VotingApp Anchor program.
export function getVotingAppProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...VotingAppIDL, address: address ? address.toBase58() : VotingAppIDL.address } as VotingApp, provider)
}

// This is a helper function to get the program ID for the VotingApp program depending on the cluster.
export function getVotingAppProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the VotingApp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return VOTING_APP_PROGRAM_ID
  }
}
