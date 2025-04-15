// pages/api/user/delete.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required.' });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { walletAddress },
    });
    // If your application has related models tied to User,
    // make sure to use cascade deletes or manually delete related records.
    res.status(200).json({ deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
