import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import { VotingApp } from '../target/types/voting_app'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
const IDL = require('../target/idl/voting_app.json')

const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")

describe('voting_app', () => {
  let context: any
  let provider: BankrunProvider
  let votingProgram: anchor.Program<VotingApp>

  beforeAll(async () => {
    context = await startAnchor("", [{ name: "voting_app", programId: votingAddress }], [])
    provider = new BankrunProvider(context)
    votingProgram = new Program<VotingApp>(IDL, provider)
  })

  it('Initialize Poll', async () => {
    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is your fav type of peanut butter?",
      new anchor.BN(0),
      new anchor.BN(1844526123),
      new anchor.BN(2)
    ).rpc()

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress,
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress)
    console.log("Poll details:", poll)
    expect(poll.pollId.toNumber()).toEqual(1)
    expect(poll.description).toEqual("What is your fav type of peanut butter?")
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber())
  }, 10000)

  it("initialize candidates", async () => {
    const pollId = new anchor.BN(1)
    const candidates = ["Smooth", "Crunchy"]
  
    for (const candidateName of candidates) {
      const [candidatePubkey] = PublicKey.findProgramAddressSync(
        [pollId.toArrayLike(Buffer, 'le', 8), Buffer.from(candidateName)],
        votingAddress
      )
  
      await votingProgram.methods.initializeCandidates(
        candidateName,
        pollId
      )
      .accounts({
        signer: provider.wallet.publicKey,
        candidate: candidatePubkey,
        systemProgram: SystemProgram.programId,
      })
      .rpc()
  
      // Fetch candidate account and log details
      const candidateAccount = await votingProgram.account.candidate.fetch(candidatePubkey)
      console.log("Candidate account details for", candidateName, ":", candidateAccount)
  
      // Verify candidate account creation with correct field names
      expect(candidateAccount.candidateName).toEqual(candidateName)
      expect(candidateAccount.candidateVote.toNumber()).toEqual(0)
    }
  })

  it("vote", async () => {
    // We'll vote for the "Smooth" candidate in pollId 1
    const pollId = new anchor.BN(1)
    const candidateName = "Smooth"
  
    // Derive the PDA for the candidate
    const [candidatePubkey] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, 'le', 8), Buffer.from(candidateName)],
      votingAddress
    )
  
    // Call the vote instruction
    await votingProgram.methods.vote(
      candidateName,
      pollId
    )
    .accounts({
      signer: provider.wallet.publicKey,
      candidate: candidatePubkey,
    })
    .rpc()
  
    // Fetch the candidate account and verify vote count increased
    const candidateAccount = await votingProgram.account.candidate.fetch(candidatePubkey)
    console.log("After vote, candidate account details for", candidateName, ":", candidateAccount)
    expect(candidateAccount.candidateVote.toNumber()).toEqual(1)
  })
})
