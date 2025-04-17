import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';
import { WebSocket } from 'ws';
import { verifyVoteOnChain } from '../../../../utils/solanaVoteVerification';
import { getWallet } from '../../../../utils/solana';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;
  const { option, userId } = req.body;

  try {
    const poll = await prisma.poll.findUnique({
      where: { id: Number(id) },
    });

    if (!poll || poll.status !== 'Active' ||
      (poll.endsAt && new Date(poll.endsAt) < new Date())) {
      return res.status(400).json({ message: 'Poll is closed or not found' });
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        pollId: Number(id),
        userId: Number(userId),
      },
    });

    if (existingVote) {
      return res.status(400).json({ message: 'User has already voted' });
    }

    // Verify vote on Solana blockchain
    const wallet = await getWallet(session.user.walletAddress);
    const isVerified = await verifyVoteOnChain(wallet, Number(id), option, Number(userId));
    if (!isVerified) {
      return res.status(400).json({ message: 'Vote verification failed on blockchain' });
    }

    await prisma.$transaction([
      prisma.vote.create({
        data: {
          pollId: Number(id),
          userId: Number(userId),
          option,
        },
      }),
      prisma.poll.update({
        where: { id: Number(id) },
        data: {
          votes: { increment: 1 },
        },
      }),
    ]);

    const ws = new WebSocket(`ws://localhost:3001/poll/${id}`);
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'vote', pollId: id }));
      ws.close();
    };

    return res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Voting error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

