import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { VotingApp } from '../target/types/voting_app'

describe('voting_app', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.VotingApp as Program<VotingApp>

  const voting_appKeypair = Keypair.generate()

  it('Initialize VotingApp', async () => {
    await program.methods
      .initialize()
      .accounts({
        voting_app: voting_appKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([voting_appKeypair])
      .rpc()

    const currentCount = await program.account.voting_app.fetch(voting_appKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment VotingApp', async () => {
    await program.methods.increment().accounts({ voting_app: voting_appKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting_app.fetch(voting_appKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment VotingApp Again', async () => {
    await program.methods.increment().accounts({ voting_app: voting_appKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting_app.fetch(voting_appKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement VotingApp', async () => {
    await program.methods.decrement().accounts({ voting_app: voting_appKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting_app.fetch(voting_appKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set voting_app value', async () => {
    await program.methods.set(42).accounts({ voting_app: voting_appKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting_app.fetch(voting_appKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the voting_app account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        voting_app: voting_appKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.voting_app.fetchNullable(voting_appKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
