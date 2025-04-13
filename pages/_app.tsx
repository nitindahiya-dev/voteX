import { web3 } from '@coral-xyz/anchor';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import Layout from 'components/Layout';
import { AppProps } from 'next/app';
import { useMemo } from 'react';
import '../styles/globals.css'; // Adjust the path

import '@solana/wallet-adapter-react-ui/styles.css';
function MyApp({ Component, pageProps }: AppProps) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = web3.clusterApiUrl('devnet');
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;