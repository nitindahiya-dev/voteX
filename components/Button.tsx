// components/Button.tsx
import { FiLoader } from 'react-icons/fi';

export default function Button({ children, variant = 'primary', ...props }) {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-all';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-slate-800/50 hover:bg-slate-800/30 text-slate-300 hover:text-white'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}