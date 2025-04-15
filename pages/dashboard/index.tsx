// Import this at the very top so Chart.js scales and other components are registered.
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import DashboardLayout from 'components/DashboardLayout';

function OverviewPage() {
  const stats = [
    { title: "Total Polls", value: "24", color: "from-indigo-500 to-purple-500" },
    { title: "Total Votes", value: "1.2k", color: "from-teal-500 to-cyan-500" },
    { title: "Active Polls", value: "5", color: "from-pink-500 to-rose-500" },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${stat.color} p-1 rounded-2xl`}
          >
            <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-gray-400 text-sm mb-2">{stat.title}</h3>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Voting Activity Chart */}
      <div className="bg-gray-900/50 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Voting Activity</h2>
        <div className="h-64">
          <Line
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: '#6366f1',
                tension: 0.4,
              }]
            }}
            options={{ maintainAspectRatio: false }}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Polls */}
        <div className="bg-gray-900/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Polls</h2>
          {/* Poll List */}
        </div>

        {/* Notifications */}
        <div className="bg-gray-900/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Notifications</h2>
          {/* Notification List */}
        </div>
      </div>
    </>
  );
}

// Specify that pages under /dashboard should use the DashboardLayout.
OverviewPage.getLayout = function getLayout(page: JSX.Element) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default OverviewPage;
