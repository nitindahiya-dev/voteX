export default function PollDetail() {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Best Programming Language 2024
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Created by: 0x...1234</span>
              <span>•</span>
              <span>Ends in: 2 days</span>
            </div>
          </div>

          <div className="space-y-6">
            {candidates.map(candidate => (
              <div 
                key={candidate.id}
                className="group relative p-6 border border-gray-200 rounded-xl hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary text-xl">🚀</span>
                    </div>
                    <h3 className="font-medium text-gray-900">
                      {candidate.name}
                    </h3>
                  </div>
                  
                  <button
                    className="bg-primary/10 text-primary px-6 py-2 rounded-lg hover:bg-primary/20 transition-colors"
                    onClick={() => handleVote(candidate.id)}
                  >
                    Vote
                  </button>
                </div>
                
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${candidate.percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-600">
                    {candidate.votes} votes ({candidate.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Poll Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Votes" value="1,234" />
              <StatCard label="Voters" value="892" />
              <StatCard label="Time Remaining" value="47h 12m" />
              <StatCard label="Your Votes" value="3" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const StatCard = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg text-center">
    <dt className="text-sm text-gray-600">{label}</dt>
    <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
  </div>
);