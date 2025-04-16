import { useState, useEffect } from 'react';
import { FiArchive, FiPlus, FiShare2, FiTrash2, FiImage, FiLink } from 'react-icons/fi';
import DashboardLayout from '../../../components/DashboardLayout';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import { prisma } from '../../../lib/prisma';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Poll {
  id: number;
  title: string;
  type: string;
  status: string;
  votes: number;
  createdAt: string;
  endsAt: string | null;
}

const MyPollsPage = ({ initialPolls }: { initialPolls: Poll[] }) => {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [pollType, setPollType] = useState('');
  const [pollData, setPollData] = useState({
    title: '',
    options: ['', '', '', ''],
    endsAt: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setPolls(initialPolls);
  }, [initialPolls]);

  const handleCreatePoll = async () => {
    try {
      // Validation
      if (!pollData.title) {
        setError('Poll question is required');
        return;
      }
      if (pollData.options.some(option => !option)) {
        setError('All options must be filled');
        return;
      }

      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: pollData.title,
          type: pollType,
          options: pollData.options,
          endsAt: pollData.endsAt || null,
        }),
      });

      if (response.ok) {
        const newPoll = await response.json();
        setPolls([...polls, newPoll]);
        setShowCreateModal(false);
        setCurrentStep(1);
        setPollType('');
        setPollData({
          title: '',
          options: ['', '', '', ''],
          endsAt: '',
        });
        setError('');
      } else {
        setError('Failed to create poll');
      }
    } catch (err) {
      setError('An error occurred while creating the poll');
    }
  };

  const handleDeletePoll = async (pollId: number) => {
    if (!confirm('Are you sure you want to delete this poll?')) return;

    try {
      const response = await fetch(`/api/polls/${pollId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPolls(polls.filter(poll => poll.id !== pollId));
      } else {
        setError('Failed to delete poll');
      }
    } catch (err) {
      setError('An error occurred while deleting the poll');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-white">Managed Polls</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <FiPlus className="mr-2" /> Create New Poll
        </Button>
      </div>

      {/* Polls Table */}
      <div className="bg-slate-800/50 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-700/30 text-slate-300 text-sm font-medium">
          <div className="col-span-5">Poll Title</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Votes</div>
          <div className="col-span-2">Actions</div>
        </div>
        
        {polls.map(poll => (
          <div key={poll.id} className="grid grid-cols-12 gap-4 p-4 border-t border-slate-700/50 hover:bg-slate-800/30 transition-colors">
            <div className="col-span-5 text-white">
              <Link href={`/polls/${poll.id}`} className="hover:underline">
                {poll.title}
              </Link>
            </div>
            <div className="col-span-2 text-slate-400">{poll.type}</div>
            <div className="col-span-1">
              <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">
                {poll.status}
              </span>
            </div>
            <div className="col-span-2 text-slate-400">{poll.votes.toLocaleString()}</div>
            <div className="col-span-2 flex gap-3">
              <button className="text-slate-400 hover:text-slate-300">
                <FiShare2 />
              </button>
              <button 
                className="text-red-400 hover:text-red-300"
                onClick={() => handleDeletePoll(poll.id)}
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Poll Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setCurrentStep(1);
          setPollType('');
          setError('');
        }}
        title="Create New Poll"
      >
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <PollTypeCard
                icon={<FiArchive />}
                title="Text MCQ"
                description="2-4 text-based options"
                onClick={() => setPollType('text')}
                active={pollType === 'text'}
              />
              <PollTypeCard
                icon={<FiImage />}
                title="Image MCQ"
                description="Visual options with images"
                onClick={() => setPollType('image')}
                active={pollType === 'image'}
              />
            </div>
            <Button onClick={() => setCurrentStep(2)} disabled={!pollType}>
              Continue
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            {error && (
              <div className="bg-red-500/10 text-red-400 p-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white">
                Poll Question
              </label>
              <input
                type="text"
                className="w-full bg-slate-800/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter your question..."
                value={pollData.title}
                onChange={(e) => setPollData({ ...pollData, title: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-white">
                End Date (Optional)
              </label>
              <input
                type="date"
                className="w-full bg-slate-800/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={pollData.endsAt}
                onChange={(e) => setPollData({ ...pollData, endsAt: e.target.value })}
              />
            </div>

            {pollType === 'text' && (
              <div className="space-y-4">
                {[0, 1, 2, 3].map(index => (
                  <input
                    key={index}
                    type="text"
                    className="w-full bg-slate-800/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder={`Option ${index + 1}`}
                    value={pollData.options[index]}
                    onChange={(e) => {
                      const newOptions = [...pollData.options];
                      newOptions[index] = e.target.value;
                      setPollData({ ...pollData, options: newOptions });
                    }}
                  />
                ))}
              </div>
            )}

            {pollType === 'image' && (
              <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2, 3].map(index => (
                  <div key={index} className="aspect-square bg-slate-800/50 rounded-lg flex items-center justify-center cursor-pointer hover:border-2 hover:border-indigo-500/30 transition-all">
                    <FiPlus className="text-3xl text-slate-500" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={handleCreatePoll}>
                Create Poll
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Share Modal */}
      <ShareModal />
    </div>
  );
};

const PollTypeCard = ({ icon, title, description, onClick, active }) => (
  <div
    onClick={onClick}
    className={`p-6 rounded-xl cursor-pointer transition-all ${
      active ? 'bg-indigo-500/10 border-2 border-indigo-500/30' : 'bg-slate-800/50 hover:bg-slate-800/30'
    }`}
  >
    <div className="text-indigo-400 text-2xl mb-3">{icon}</div>
    <h3 className="text-white font-medium mb-2">{title}</h3>
    <p className="text-slate-400 text-sm">{description}</p>
  </div>
);

const ShareModal = () => (
  <Modal isOpen={false} onClose={() => {}} title="Share Poll">
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between">
        <span className="text-slate-400">https://vote.xyz/poll/abc123</span>
        <button className="text-indigo-400 hover:text-indigo-300">
          <FiLink className="text-xl" />
        </button>
      </div>
      
      <div className="flex justify-center gap-4">
        {['Twitter', 'Facebook', 'LinkedIn', 'Copy'].map((platform, index) => (
          <button
            key={index}
            className="p-3 rounded-full bg-slate-800/50 hover:bg-slate-800/30 text-slate-300 hover:text-white transition-colors"
          >
            {/* Add platform icons here */}
          </button>
        ))}
      </div>
    </div>
  </Modal>
);

MyPollsPage.getLayout = function getLayout(page: JSX.Element) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export async function getServerSideProps() {
  const polls = await prisma.poll.findMany({
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      votes: true,
      createdAt: true,
      endsAt: true,
    },
  });

  return {
    props: {
      initialPolls: polls.map(poll => ({
        ...poll,
        createdAt: poll.createdAt.toISOString(),
        endsAt: poll.endsAt ? poll.endsAt.toISOString() : null,
      })),
    },
  };
}

export default MyPollsPage;