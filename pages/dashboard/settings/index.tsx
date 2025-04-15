//page/dashboard/settings/index.tsx

import DashboardLayout from "components/DashboardLayout";

export default function SettingsPage() {
    return (
      <>
        <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>
        
        <div className="grid grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="col-span-1 bg-gray-900/50 rounded-2xl p-6">
            <nav className="space-y-2">
              {['Account', 'Security', 'Notifications', 'Billing'].map((item) => (
                <button
                  key={item}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-800/50 text-gray-300 hover:text-white"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
  
          {/* Settings Content */}
          <div className="col-span-3 bg-gray-900/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Account Settings</h2>
            {/* Settings Form */}
          </div>
        </div>
      </>
    )
  }


  SettingsPage.getLayout = function getLayout(page: JSX.Element) {
    return <DashboardLayout>{page}</DashboardLayout>;
  };