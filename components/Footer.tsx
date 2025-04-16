import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FiTwitter, FiGithub, FiMail, FiMapPin, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top bottom",
        toggleActions: "play none none none"
      }
    });

    // Column animations
    tl.from(columnsRef.current?.children || [], {
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out"
    });

    // Copyright animation
    tl.from(copyrightRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.3");

    // Grid line animation
    gsap.fromTo(footerRef.current?.querySelectorAll('.grid-line'),
      { x: -100, opacity: 0 },
      {
        x: 100,
        opacity: 0.1,
        duration: 8,
        repeat: -1,
        ease: "none",
        stagger: {
          each: 0.5,
          from: "random"
        }
      }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <footer ref={footerRef} className="relative bg-slate-900 border-t border-slate-800/50">
      <div className="absolute inset-0 grid-pattern opacity-10">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="grid-line absolute w-1 h-full bg-indigo-400" 
            style={{ left: `${(i + 1) * 10}%` }} />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div ref={columnsRef} className="grid grid-cols-1 md:grid-cols-4 gap-8 text-slate-300">
          {/* Logo Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              GovChain
            </h3>
            <p className="text-sm text-slate-400">
              Secure blockchain governance solutions for modern organizations
            </p>
            <div className="flex space-x-4">
              <Link href={"/"} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300 hover:text-indigo-400">
                <FiTwitter className="text-xl" />
              </Link> 
              <Link href={"https://github.com/nitindahiya-dev/voteX"} target='_blank' className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300 hover:text-indigo-400">
                <FiGithub className="text-xl" />
              </Link> 
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-slate-100 font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                  <FiArrowRight className="text-sm" />
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                  <FiArrowRight className="text-sm" />
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                  <FiArrowRight className="text-sm" />
                  Compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-slate-100 font-semibold mb-2">Contact</h4>
            <ul className="space-y-2">
              <li>
                <Link href="mailto:support@govchain.io" className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                  <FiMail className="text-sm" />
                  support@govchain.io
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                  <FiMapPin className="text-sm" />
                  San Francisco, CA
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-slate-100 font-semibold mb-2">Stay Updated</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email for updates"
                className="bg-slate-800 rounded-lg px-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 px-4 rounded-lg transition-colors text-white">
                <FiArrowRight className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        <div ref={copyrightRef} className="border-t border-slate-800/50 mt-12 pt-8 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} GovChain. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 mt-2">
            Blockchain-powered governance solutions for enterprise use
          </p>
        </div>
      </div>
    </footer>
  );
};

// Add grid pattern styles to your global CSS
const gridPatternStyles = `
  .grid-pattern {
    background: linear-gradient(90deg, transparent 49%, rgba(99,102,241,0.1) 50%, transparent 51%);
    background-size: 5% 100%;
  }
`;

<style jsx global>{gridPatternStyles}</style>