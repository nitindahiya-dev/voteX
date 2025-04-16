import { GetServerSideProps } from 'next';
import { prisma } from '../../lib/prisma';
import DashboardLayout from '../../components/DashboardLayout';
import Link from 'next/link';
import { FiStar, FiBarChart2 } from 'react-icons/fi';
import { useState } from 'react';

interface Poll {
  id: number;
  title: string;
  votes: number;
}

interface PlayPollsProps {
  polls: Poll[];
}

const PlayPolls = ({ polls }: PlayPollsProps) => {
  const [currentPollIndex, setCurrentPollIndex] = useState(0);

  const handleNextPoll = () => {
    setCurrentPollIndex((prev) => (prev + 1) % polls.length);
  };

  if (!polls.length) {
    return <div className="p-6 text-white">No polls available</div>;
  }

  const currentPoll = polls[currentPollIndex];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-white mb-8">Play with Polls</h1>
      <div className="bg-slate-800/50 rounded-xl p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-medium text-white">{currentPoll.title}</h2>
          <FiStar className="text-yellow-400 text-xl" />
        </div>
        <div className="text-slate-400 mb-6">
          <FiBarChart2 className="inline mr-1" />
          {currentPoll.votes.toLocaleString()} votes
        </div>
        <div className="flex gap-4">
          <Link href={`/poll/${currentPoll.id}`}>
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
              Vote Now
            </button>
          </Link>
          <button
            onClick={handleNextPoll}
            className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600"
          >
            Next Poll
          </button>
        </div>
      </div>
    </div>
  );
};

PlayPolls.getLayout = function getLayout(page: JSX.Element) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const polls = await prisma.poll.findMany({
      where: { status: 'Active' },
      select: {
        id: true,
        title: true,
        votes: true,
      },
      orderBy: { votes: 'desc' },
    });

    return {
      props: { polls },
    };
  } catch (error) {
    console.error('Error fetching polls:', error);
    return {
      props: { polls: [] },
    };
  }
};

export default PlayPolls;