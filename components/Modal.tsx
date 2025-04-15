// components/Modal.tsx
import { motion } from 'framer-motion';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-xl w-full max-w-2xl p-6 border border-slate-700/50"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}