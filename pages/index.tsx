import Link from "next/link";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import {
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiBarChart,
  FiClock,
  FiUsers,
} from "react-icons/fi";

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subHeadingRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    gsap.fromTo(
      heroRef.current?.querySelectorAll('div[class*="bg-indigo-900/20"]'),
      { x: -100, y: -100, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 2, ease: "power4.out" }
    );

    tl.from(headingRef.current?.querySelectorAll("span"), {
      y: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 1.2,
      ease: "power4.out",
    })
      .from(
        subHeadingRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5"
      )
      .from(
        textRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .from(
        buttonRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.3"
      );
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-slate-900"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl -top-32 -left-32" />
        <div className="absolute w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl -bottom-48 -right-48" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 flex flex-col justify-center items-center min-h-screen">
        <div className="text-center">
          <h1
            ref={headingRef}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            <span>Decentralized Decision Making</span>
            <br />
            <span className="text-indigo-400" ref={subHeadingRef}>
              Powered by Solana
            </span>
          </h1>

          <p
            ref={textRef}
            className="text-lg text-slate-300 max-w-3xl mx-auto mb-8"
          >
            Create secure, transparent polls with blockchain-verified results.
            Enterprise-grade security meets intuitive governance tools.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard"
              ref={buttonRef}
              className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-lg text-white font-medium flex items-center gap-2 transition-colors"
            >
              <FiCheckCircle className="text-lg" />
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <motion.div
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, scale: 0.98 }}
    whileInView={{ opacity: 1, scale: 1 }}
    className="p-8 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all"
  >
    <div className="text-indigo-400 text-3xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </motion.div>
);

const KeyFeatures = () => (
  <section className="relative py-20 bg-slate-900">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-4"
        >
          Enterprise-Grade Features
        </motion.h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Secure voting infrastructure built for organizations and communities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<FiLock />}
          title="Military-Grade Security"
          description="End-to-end encrypted votes with blockchain-verified audit trails"
        />
        <FeatureCard
          icon={<FiBarChart />}
          title="Real-Time Analytics"
          description="Live results tracking with detailed voter demographics"
        />
        <FeatureCard
          icon={<FiClock />}
          title="Time-Bound Voting"
          description="Automated poll opening/closing with smart contracts"
        />
      </div>
    </div>
  </section>
);

interface Poll {
  id: number;
  title: string;
  votes: number;
  progress: number;
  endsIn: string;
  category: string;
}

const ActivePollsSection = () => {
  const polls: Poll[] = [
    {
      id: 1,
      title: "Blockchain Protocol Upgrade",
      votes: 2458,
      progress: 68,
      endsIn: "2 days remaining",
      category: "Governance",
    },
    {
      id: 2,
      title: "Community Treasury Allocation",
      votes: 1843,
      progress: 45,
      endsIn: "5 days remaining",
      category: "Finance",
    },
  ];

  return (
    <section className="relative py-20 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Active Governance Proposals
          </motion.h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Participate in ongoing organizational decisions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {polls.map((poll) => (
            <motion.div
              key={poll.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-indigo-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {poll.title}
                  </h3>
                  <span className="text-sm text-indigo-400/80 mt-2 block">
                    {poll.category}
                  </span>
                </div>
                <span className="text-sm bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-full">
                  {poll.endsIn}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>{poll.votes.toLocaleString()} verified votes</span>
                  <span>{poll.progress}% consensus</span>
                </div>

                <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-indigo-500 transition-all duration-1000 ease-out"
                    style={{ width: `${poll.progress}%` }}
                  />
                </div>

                <div className="flex justify-end">
                  <button className="text-indigo-300 hover:text-white flex items-center gap-2 text-sm">
                    View Proposal Details
                    <FiArrowRight className="text-sm" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTABanner = () => (
  <section className="relative py-20 bg-indigo-900/30 min-h-[50vh] flex flex-col items-center justify-center">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Governance?
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto">
          Start your free trial today and experience secure, decentralized
          decision-making
        </p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-block"
      >
        <Link
          href="/dashboard"
          className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-lg text-white font-medium flex items-center gap-2 transition-colors"
        >
          <FiUsers className="text-lg" />
          Start Free Trial
        </Link>
      </motion.div>
    </div>
  </section>
);

const HomePage = () => (
  <>
    <HeroSection />
    <KeyFeatures />
    <ActivePollsSection />
    <CTABanner />
  </>
);

export default HomePage;
