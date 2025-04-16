import { GetServerSideProps } from 'next';
import { prisma } from '../../lib/prisma';
import Link from 'next/link';
import { FiBarChart2, FiClock } from 'react-icons/fi';

interface Poll {
  id: number;
  title: string;
  status: string;
  votes: number;
  endsAt: string | null;
}

interface PollsPageProps {
  polls: Poll[];
}

const PollsPage = ({ polls }: PollsPageProps) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-white mb-8">All Polls</h1>
      <div className="space-y-4">
        {polls.map((poll) => (
          <Link key={poll.id} href={`/poll/${poll.id}`}>
            <div className="bg-slate-800/50 rounded-lg p-6 hover:bg-slate-700/50 transition-colors">
              <h2 className="text-xl font-medium text-white">{poll.title}</h2>
              <div className="flex justify-between text-sm text-slate-400 mt-2">
                <span className="flex items-center">
                  <FiBarChart2 className="mr-1" />
                  {poll.votes.toLocaleString()} votes
                </span>
                <span className="flex items-center">
                  <FiClock className="mr-1" />
                  {poll.endsAt ? new Date(poll.endsAt).toLocaleString() : 'No end date'}
                </span>
                <span className={poll.status === 'Active' ? 'text-green-400' : 'text-red-400'}>
                  {poll.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const polls = await prisma.poll.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        votes: true,
        endsAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      props: {
        polls: polls.map((poll) => ({
          ...poll,
          endsAt: poll.endsAt ? poll.endsAt.toISOString() : null,
        })),
      },
    };
  } catch (error) {
    console.error('Error fetching polls:', error);
    return {
      props: { polls: [] },
    };
  }
};

export default PollsPage;