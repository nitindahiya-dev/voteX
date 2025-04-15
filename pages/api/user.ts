// pages/api/user.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Expecting a POST request with walletAddress in the body.
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required.' });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      // Create a new user. Use the walletAddress as the default name.
      user = await prisma.user.create({
        data: {
          walletAddress,
          name: walletAddress,
          lastLogin: new Date(),
        },
      });
    } else {
      // Update lastLogin for an existing user.
      user = await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error accessing user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
