import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;
  const { userId } = req.body;

  try {
    const existingVote = await prisma.vote.findFirst({
      where: {
        pollId: Number(id),
        userId: Number(userId),
      },
    });

    return res.status(200).json({ hasVoted: !!existingVote });
  } catch (error) {
    console.error('Error checking vote status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}