import Link from "next/link";
const polls = [
  {
    id: 1,
    title: "Best Blockchain Platform?",
    category: "Technology",
    totalVotes: 1245,
    progress: 65,
    endTime: "2024-03-30"
  },
  {
    id: 2,
    title: "Next Community Project",
    category: "Community",
    totalVotes: 892,
    progress: 45,
    endTime: "2024-03-28"
  },
];

const timeRemaining = (endTime: string | number | Date) => {
  const endDate = new Date(endTime);
  const now = new Date();
  const timeDifference = endDate - now;
  
  if (timeDifference < 0) return "Closed";
  
  const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`;
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shape Decisions with 
            <span className="bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text ml-3">
              Community Power
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create, participate, and track polls in real-time on the Solana blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {polls.map(poll => (
            <div key={poll.id} className="bg-surface rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{poll.title}</h3>
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {poll.category}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Votes</span>
                  <span>{poll.totalVotes}</span>
                </div>
                
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                    <div 
                      style={{ width: `${poll.progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {timeRemaining(poll.endTime)}
                  </span>
                  <Link 
                    href={`/poll/${poll.id}`}
                    className="bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    View Poll →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}