import { useState } from "react";

export default function CreatePoll() {
  // State management
  const [candidates, setCandidates] = useState([{ name: '' }]);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Candidate handlers
  const addCandidate = () => {
    setCandidates([...candidates, { name: '' }]);
  };

  const removeCandidate = (index: number) => {
    if (candidates.length === 1) return;
    const newCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(newCandidates);
  };

  const updateCandidate = (index: number, value: string) => {
    const newCandidates = [...candidates];
    newCandidates[index].name = value;
    setCandidates(newCandidates);
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log({
      title,
      startTime,
      endTime,
      candidates
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Create New Poll
            <span className="ml-2 text-primary">✨</span>
          </h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poll Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">
                    Candidates
                  </h3>
                  <button
                    type="button"
                    onClick={addCandidate}
                    className="text-primary hover:text-primary/80 text-sm"
                  >
                    + Add Candidate
                  </button>
                </div>
                
                {candidates.map((candidate, index) => (
                  <div key={index} className="flex gap-4">
                    <input
                      type="text"
                      value={candidate.name}
                      onChange={(e) => updateCandidate(index, e.target.value)}
                      placeholder={`Candidate ${index + 1}`}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeCandidate(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Launch Poll 🚀
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}