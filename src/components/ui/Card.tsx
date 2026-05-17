import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const Card = ({ children, className, onClick, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { scale: 1.02, transition: { duration: 0.3 } } : {}}
      onClick={onClick}
      className={cn(
        'bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 relative overflow-hidden transition-all duration-300',
        onClick && 'cursor-pointer hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,0,60,0.1)]',
        className
      )}
      {...props}
    >
      {/* Cinematic subtle glow */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-neon-red/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-blue/10 rounded-full blur-3xl pointer-events-none" />
      
      {children}
    </motion.div>
  );
};
