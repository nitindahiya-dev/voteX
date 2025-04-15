import Link from "next/link";
import { WalletButton } from "./WalletButton";

export const Navbar = () => (
  <nav className="fixed w-full  z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        VoteX
      </Link>
      <WalletButton />
    </div>
  </nav>
);