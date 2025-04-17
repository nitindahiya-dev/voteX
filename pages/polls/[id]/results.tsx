import { GetServerSideProps } from 'next';
import { prisma } from '../../../lib/prisma';
import DashboardLayout from '../../../components/DashboardLayout';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

interface PollResult {
  id: number;
  title: string;
  options: string[];
  votes: number;
  results: { option: string; count: number; percentage: number }[];
}

const PollResultsPage = ({ poll }: { poll: PollResult }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href={`/polls/${poll.id}`} className="text-indigo-400 hover:text-indigo-300 flex items-center">
          <FiArrowLeft className="mr-2" /> Back to Poll
        </Link>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-8">
        <h1 className="text-3xl font-semibold text-white mb-6">{poll.title}</h1>
        <div className="mb-6 text-slate-400">
          Total Votes: {poll.votes.toLocaleString()}
        </div>

        <div className="space-y-4">
          {poll.results.map((result, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-white">
                <span>{result.option}</span>
                <span>{result.percentage.toFixed(1)}% ({result.count} votes)</span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-2.5">
                <div
                  className="bg-indigo-500 h-2.5 rounded-full transition-all"
                  style={{ width: `${result.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

PollResultsPage.getLayout = function getLayout(page: JSX.Element) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  try {
    const poll = await prisma.poll.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        title: true,
        options: true,
        votes: true,
      },
    });

    if (!poll) {
      return { notFound: true };
    }

    const voteCounts = await prisma.vote.groupBy({
      by: ['option'],
      where: { pollId: Number(id) },
      _count: { option: true },
    });

    const results = (poll.options as string[]).map((option) => {
      const voteCount = voteCounts.find((v) => v.option === option)?._count.option || 0;
      return {
        option,
        count: voteCount,
        percentage: poll.votes > 0 ? (voteCount / poll.votes) * 100 : 0,
      };
    });

    return {
      props: {
        poll: {
          ...poll,
          options: poll.options as string[],
          results,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching poll results:', error);
    return { notFound: true };
  }
};

export default PollResultsPage;