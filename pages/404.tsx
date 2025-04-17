// pages/404.tsx
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '../components/Button';
import Layout from '../components/Layout';
import {Navbar} from '../components/Navbar';
import {Footer} from '../components/Footer';

const NotFoundPage = () => {
  return (
    <Layout>
      <Navbar />
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-8xl font-bold text-indigo-400 mb-8">404</div>
            
            <h1 className="text-4xl font-semibold text-white mb-4">
              Page Not Found
            </h1>
            
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              The page you're looking for doesn't exist or has been moved. 
              Please check the URL or return to the homepage.
            </p>

            <div className="flex justify-center space-x-4">
              <Link href="/" passHref>
                <Button>
                  Return Home
                </Button>
              </Link>
              
              <Link href="/dashboard" passHref>
                <Button variant="secondary">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <svg
              className="mx-auto h-64 text-slate-700"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 180C143.183 180 178 145.183 178 102C178 58.8172 143.183 24 100 24C56.8172 24 22 58.8172 22 102C22 145.183 56.8172 180 100 180Z"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                d="M70 70L130 130M130 70L70 130"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M100 140C118.225 140 133 125.225 133 107C133 88.7746 118.225 74 100 74C81.7746 74 67 88.7746 67 107C67 125.225 81.7746 140 100 140Z"
                fill="currentColor"
              />
            </svg>
          </motion.div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default NotFoundPage;