import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/polls/[id]/vote';
import { prisma } from '../../lib/prisma';

jest.mock('../../lib/prisma');

describe('Vote API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reject unauthenticated requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      query: { id: '1' },
      body: { option: 'Option 1', userId: '1' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({ message: 'Unauthorized' });
  });

  it('should reject invalid poll', async () => {
    (prisma.poll.findUnique as jest.Mock).mockResolvedValue(null);

    const { req, res } = createMocks({
      method: 'POST',
      query: { id: '1' },
      body: { option: 'Option 1', userId: '1' },
      session: { user: { id: '1' } },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Poll is closed or not found' });
  });

  it('should prevent duplicate votes', async () => {
    (prisma.poll.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      status: 'Active',
      endsAt: null,
    });
    (prisma.vote.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

    const { req, res } = createMocks({
      method: 'POST',
      query: { id: '1' },
      body: { option: 'Option 1', userId: '1' },
      session: { user: { id: '1' } },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'User has already voted' });
  });

  it('should record valid vote', async () => {
    (prisma.poll.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      status: 'Active',
      endsAt: null,
    });
    (prisma.vote.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.$transaction as jest.Mock).mockResolvedValue([{}, {}]);

    const { req, res } = createMocks({
      method: 'POST',
      query: { id: '1' },
      body: { option: 'Option 1', userId: '1' },
      session: { user: { id: '1' } },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Vote recorded successfully' });
  });
});