import { ReactNode, ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

// Utility for combining Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button = ({ children, className, ...props }: ButtonProps) => {
  const baseStyle =
    'h-12 px-8 font-primary uppercase tracking-widest text-soft-neon-green bg-emerald-900/50 rounded-lg border-2 border-soft-neon-green transition-all duration-200 transform focus:outline-none';

  const interactionStyle =
    'hover:shadow-neon-green-intense active:scale-95 shadow-neon-green';

  return (
    <button
      className={cn(
        baseStyle,
        interactionStyle,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};