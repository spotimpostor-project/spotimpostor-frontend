import { ReactNode, ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

// Utility for combining Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'solid' | 'outline';
}

export const Button = ({ children, className, variant = 'solid', ...props }: ButtonProps) => {
  const baseStyle =
    'h-12 px-8 font-primary uppercase tracking-widest rounded-lg border-2 transition-all duration-200 transform focus:outline-none';

  const variantStyles = {
    solid: 'bg-[#22c55e] text-black border-[#22c55e] hover:shadow-neon-green-intense shadow-neon-green',
    outline: 'bg-transparent text-[#22c55e] border-[#22c55e] hover:text-white hover:shadow-neon-green-intense shadow-neon-green',
  };

  return (
    <button
      className={cn(
        baseStyle,
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};