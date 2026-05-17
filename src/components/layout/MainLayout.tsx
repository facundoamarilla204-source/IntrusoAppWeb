import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col items-center select-none bg-black">
      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Dark mesh gradient */}
        <div className="absolute inset-0 bg-[#050505]" />
        
        {/* Central glow from theme */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 overflow-hidden">
          <div className="w-[800px] h-[800px] bg-neon-red rounded-full blur-[150px]" />
        </div>

        {/* Scanline effect for cinematic feel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
      </div>

      <main className="relative z-10 w-full max-w-lg mx-auto px-8 py-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
      
      {/* Decorative particles */}
      <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -10, x: Math.random() * 100 + "%", opacity: 0 }}
            animate={{ 
              y: "110dvh", 
              opacity: [0, 0.2, 0] 
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity, 
              delay: Math.random() * 10,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
          />
        ))}
      </div>
    </div>
  );
};
