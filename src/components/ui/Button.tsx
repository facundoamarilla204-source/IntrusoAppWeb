import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] font-black italic tracking-tighter',
      secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-xl',
      outline: 'border border-white/20 text-white hover:border-white/40',
      danger: 'bg-neon-red text-white shadow-[0_0_20px_rgba(255,0,60,0.4)]',
      ghost: 'bg-transparent text-white/50 hover:text-white hover:bg-white/5'
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs uppercase tracking-widest',
      md: 'px-8 py-4 text-sm font-bold uppercase tracking-widest',
      lg: 'px-12 py-5 text-lg font-black uppercase tracking-tighter',
      xl: 'px-14 py-6 text-xl font-black uppercase tracking-tighter'
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
