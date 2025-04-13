import Link from "next/link";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
export const Navbar = () => (
  <nav className="bg-surface shadow-sm sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-16 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-primary to-purple-500 p-2 rounded-lg">
            <span className="text-white font-bold text-xl">🗳️VoteX</span>
          </div>
          <div className="hidden md:block ml-10 space-x-8">
            <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/create-poll" className="text-gray-600 hover:text-primary transition-colors">
              Create Poll
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <WalletMultiButton className="!bg-gradient-to-r !from-primary !to-purple-500 !text-white !font-medium !rounded-xl !px-6 !py-2 hover:!shadow-lg transition-all" />
        </div>
      </div>
    </div>
  </nav>
);