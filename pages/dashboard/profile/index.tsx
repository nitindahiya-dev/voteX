// pages/dashboard/profile/index.tsx
import { useEffect, useState } from 'react';
import DashboardLayout from 'components/DashboardLayout';
import { FiUser } from 'react-icons/fi';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Replace this with your wallet connection logic that provides the wallet's public key.
    const walletAddress = "userWalletPublicKey123";

    // Fetch or create the user profile based on the wallet address.
    fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress }),
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error('Failed to fetch user:', err));
  }, []);

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: user.walletAddress }),
      });
      if (res.ok) {
        setUser(null);
        alert('Account deleted successfully');
      } else {
        const errorData = await res.json();
        alert('Error deleting account: ' + errorData.error);
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('An error occurred');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>
      
      <div className="grid grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="col-span-1 bg-gray-900/50 rounded-2xl p-6">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-indigo-500/20 mx-auto mb-4 flex items-center justify-center">
              <FiUser className="text-4xl text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {user ? user.name : 'Loading...'}
            </h2>
            {/* <p className="text-gray-400">
              {user ? user.walletAddress : 'Wallet Address'}
            </p> */}
            {user && user.lastLogin && (
              <p className="text-gray-400 mt-2">
                Last Login: {new Date(user.lastLogin).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Edit Form and Delete Account */}
        <div className="col-span-2 bg-gray-900/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Edit Profile</h2>
          {/* Place form fields here if needed */}
          <button 
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            {deleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </>
  );
}

ProfilePage.getLayout = function getLayout(page: JSX.Element) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

