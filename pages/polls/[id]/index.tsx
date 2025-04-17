// pages/polls/[id].tsx
import { useState, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { prisma } from '../../../lib/prisma';
import DashboardLayout from '../../../components/DashboardLayout';
import Button from '../../../components/Button';
import Link from 'next/link';
import { FiShare2, FiCopy, FiAlertCircle, FiClock, FiBarChart2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Modal from '../../../components/Modal';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useWebSocket } from '../../../hooks/useWebSocket';

interface Poll {
  id: number;
  title: string;
  type: string;
  status: string;
  votes: number;
  options: string[];
  createdAt: string;
  endsAt: string | null;
}

const PollViewPage = ({ poll }: { poll: Poll }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(poll.votes);
  
  const pollLink = `${process.env.NEXT_PUBLIC_BASE_URL}/poll/${poll.id}`;
  const isPollClosed = poll.status !== 'Active' || 
    (poll.endsAt && new Date(poll.endsAt) < new Date());

  // WebSocket for real-time vote updates
  useWebSocket(`ws://localhost:3001/poll/${poll.id}`, (message) => {
    if (message.type === 'vote') {
      setVoteCount((prev) => prev + 1);
    }
  });

  const checkIfVoted = useCallback(async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch(`/api/polls/${poll.id}/has-voted`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }),
      });
      const data = await response.json();
      setHasVoted(data.hasVoted);
    } catch (error) {
      console.error('Error checking vote status:', error);
    }
  }, [poll.id, session?.user?.id]);

  const handleVote = async () => {
    if (!session) {
      toast.error('Please sign in to vote');
      router.push('/login');
      return;
    }

    if (!selectedOption) {
      toast.error('Please select an option');
      return;
    }

    if (isPollClosed) {
      toast.error('This poll is closed');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/polls/${poll.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          option: selectedOption,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }

      toast.success('Vote submitted successfully!');
      setHasVoted(true);
      router.push(`/polls/${poll.id}/results`);
    } catch (error) {
      toast.error('Failed to submit vote. Please try again.');
      console.error('Voting error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pollLink);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <Link href="/dashboard/my-polls" className="text-indigo-400 hover:text-indigo-300 flex items-center">
          ← Back to Polls
        </Link>
        <Button variant="outline" onClick={() => setShowShareModal(true)}>
          <FiShare2 className="mr-2" /> Share Poll
        </Button>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-white">{poll.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm ${
              poll.status === 'Active' && !isPollClosed
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
            }`}>
              {isPollClosed ? 'Closed' : poll.status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-slate-400">
            <div className="flex items-center space-x-2">
              <FiBarChart2 />
              <span>{voteCount.toLocaleString()} votes</span>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <FiClock />
              <span>
                {poll.endsAt ? 
                  new Date(poll.endsAt).toLocaleString() : 
                  'No end date'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {poll.options.map((option, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: hasVoted || isPollClosed ? 1 : 1.01 }}
              className={`p-4 rounded-lg transition-all ${
                selectedOption === option
                  ? 'bg-indigo-500/20 border-indigo-500/30'
                  : 'bg-slate-700/30 hover:bg-slate-700/50'
              } ${hasVoted || isPollClosed ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => !hasVoted && !isPollClosed && setSelectedOption(option)}
            >
              <label className="flex items-center space-x-3 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center 
                  ${selectedOption === option ? 
                    'border-indigo-500 bg-indigo-500/20' : 
                    'border-slate-500'}`}
                >
                  {selectedOption === option && (
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  )}
                </div>
                <span className="text-white text-lg">{option}</span>
              </label>
            </motion.div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-400 flex items-center space-x-2">
              <FiAlertCircle />
              <span>
                {hasVoted 
                  ? 'You have already voted in this poll' 
                  : 'Your vote is final and cannot be changed'}
              </span>
            </div>
            <Button 
              onClick={handleVote} 
              disabled={!selectedOption || isSubmitting || hasVoted || isPollClosed}
              className="w-full md:w-auto"
              loading={isSubmitting}
            >
              {hasVoted ? 'View Results' : 'Confirm Vote'}
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title="Share Poll">
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between">
            <span className="text-slate-400 truncate">{pollLink}</span>
            <button 
              onClick={copyToClipboard}
              className="text-indigo-400 hover:text-indigo-300 ml-4 flex-shrink-0"
            >
              <FiCopy className="text-xl" />
            </button>
          </div>
          
          <div className="flex justify-center gap-4">
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pollLink)}&text=Vote%20in%20this%20poll:%20${encodeURIComponent(poll.title)}`}
               target="_blank"
               rel="noopener noreferrer"
               className="p-3 rounded-full bg-slate-800/50 hover:bg-slate-800/30 text-slate-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pollLink)}`}
               target="_blank"
               rel="noopener noreferrer"
               className="p-3 rounded-full bg-slate-800/50 hover:bg-slate-800/30 text-slate-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pollLink)}&title=${encodeURIComponent(poll.title)}`}
               target="_blank"
               rel="noopener noreferrer"
               className="p-3 rounded-full bg-slate-800/50 hover:bg-slate-800/30 text-slate-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
              </svg>
            </a>
            <a href={`https://api.whatsapp.com/send?text=Vote%20in%20this%20poll:%20${encodeURIComponent(poll.title)}%20${encodeURIComponent(pollLink)}`}
               target="_blank"
               rel="noopener noreferrer"
               className="p-3 rounded-full bg-slate-800/50 hover:bg-slate-800/30 text-slate-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413z"/>
              </svg>
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
};

PollViewPage.getLayout = function getLayout(page: JSX.Element) {
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
        type: true,
        status: true,
        votes: true,
        options: true,
        createdAt: true,
        endsAt: true,
      },
    });

    if (!poll) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        poll: {
          ...poll,
          options: poll.options as string[],
          createdAt: poll.createdAt.toISOString(),
          endsAt: poll.endsAt ? poll.endsAt.toISOString() : null,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching poll:', error);
    return {
      notFound: true,
    };
  }
};

export default PollViewPage;