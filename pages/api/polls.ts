import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { title, type, options, endsAt } = req.body;

      // Basic validation
      if (!title || !type || !options || !Array.isArray(options)) {
        return res.status(400).json({ error: 'Invalid input data' });
      }

      const poll = await prisma.poll.create({
        data: {
          title,
          type,
          options,
          endsAt: endsAt ? new Date(endsAt) : null,
          userId: 1, // You'll want to get this from auth context in a real app
        },
      });

      return res.status(201).json(poll);
    } catch (error) {
      console.error('Error creating poll:', error);
      return res.status(500).json({ error: 'Failed to create poll' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Poll ID is required' });
      }

      await prisma.poll.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({ message: 'Poll deleted successfully' });
    } catch (error) {
      console.error('Error deleting poll:', error);
      return res.status(500).json({ error: 'Failed to delete poll' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}