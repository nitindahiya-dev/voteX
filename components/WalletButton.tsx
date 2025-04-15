'use client';

import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const WalletButton = () => {
  return (
    <WalletMultiButtonDynamic 
      className="bg-indigo-600/30 hover:bg-indigo-600/40 px-6 py-2 rounded-xl text-indigo-300 transition-colors"
    />
  );
};