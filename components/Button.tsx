// components/Button.tsx
import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { FiLoader } from 'react-icons/fi';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading,
  disabled,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all flex items-center justify-center';
  
  const variants = {
    primary: 'bg-indigo-500 text-white hover:bg-indigo-600',
    outline: 'border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10',
    ghost: 'text-indigo-400 hover:bg-indigo-500/10',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <FiLoader className="animate-spin h-5 w-5" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;