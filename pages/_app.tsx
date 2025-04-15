import { AppProps } from 'next/app';
import { useMemo } from 'react';
import { web3 } from '@coral-xyz/anchor';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import Layout from 'components/Layout';
import '../styles/globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';

// Modify to use per-page layout if available.
function MyApp({ Component, pageProps, router }: AppProps & { router: any }) {
  // Set network to Devnet (adjust if needed)
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = web3.clusterApiUrl('devnet');

  // Set up wallet adapters (add or remove as required)
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [network]
  );

  // Use the layout defined at the page level, if available, otherwise use the default Layout.
  const getLayout = (Component as any).getLayout || ((page: JSX.Element) => <Layout>{page}</Layout>);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {getLayout(<Component {...pageProps} />)}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
