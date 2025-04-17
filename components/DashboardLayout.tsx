'use client';
import { usePathname } from 'next/navigation';
import { FiActivity, FiUser, FiArchive, FiSettings, FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { icon: <FiActivity />, text: 'Overview', href: '/dashboard' },
    { icon: <FiUser />, text: 'Profile', href: '/dashboard/profile' },
    { icon: <FiArchive />, text: 'My Polls', href: '/dashboard/my-polls' },
    { icon: <FiSettings />, text: 'Settings', href: '/dashboard/settings' },
  ];

  return (
      <div className="min-h-screen bg-gray-950">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 fixed h-screen bg-gray-900/80 backdrop-blur-md border-r border-gray-800 p-6">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-12">
              <Link href={"/"}>
                VoteSphere
              </Link>
            </div>

            <nav className="space-y-4">
              {navigation.map((item) => (
                <motion.div key={item.href} whileHover={{ x: 5 }}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg ${pathname === item.href
                        ? 'text-white bg-gray-800/50'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                      }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.text}</span>
                  </Link>
                </motion.div>
              ))}

              <motion.button
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 text-red-300 hover:text-red-500 w-full p-3 rounded-lg hover:bg-red-900/10"
              >
                <FiLogOut className="text-xl" />
                <span>Logout</span>
              </motion.button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="ml-64 flex-1 p-8">{children}</main>
        </div>
      </div>
  );
}
