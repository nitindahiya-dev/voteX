// pages/api/polls/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const pollId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);

  if (Number.isNaN(pollId)) {
    return res.status(400).json({ error: 'Invalid poll ID' });
  }

  switch (req.method) {
    case 'DELETE':
      try {
        await prisma.poll.delete({ where: { id: pollId } });
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('DELETE /api/polls/[id] error:', error);
        return res.status(500).json({ error: 'Could not delete poll' });
      }

    case 'GET':
      try {
        const poll = await prisma.poll.findUnique({ where: { id: pollId } });
        if (!poll) return res.status(404).json({ error: 'Poll not found' });
        return res.status(200).json(poll);
      } catch (error) {
        console.error('GET /api/polls/[id] error:', error);
        return res.status(500).json({ error: 'Could not fetch poll' });
      }

    default:
      res.setHeader('Allow', ['GET', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
