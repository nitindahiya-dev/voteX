import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import { Keypair } from '@solana/web3.js';
import * as bs58 from 'bs58';

const LoginPage = () => {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Simulate wallet connection (replace with actual wallet connection logic)
      const keypair = Keypair.generate();
      const walletAddress = keypair.publicKey.toBase58();
      const message = `Sign this message to login: ${Date.now()}`;
      const signature = bs58.encode(keypair.secretKey.slice(0, 32)); // Simplified for demo

      const result = await signIn('credentials', {
        walletAddress,
        signature,
        message,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800/50 rounded-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-semibold text-white mb-6">Login with Solana Wallet</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-700/30 text-white border border-slate-600 focus:outline-none focus:border-indigo-500"
          />
          <Button
            onClick={handleLogin}
            loading={loading}
            disabled={loading || !walletAddress}
            className="w-full"
          >
            Connect Wallet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;