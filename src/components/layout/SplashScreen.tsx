import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onFinish, 500); // Wait for exit animation
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Animated Background */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,49,49,0.1)_0%,transparent_70%)]"
          />

          <div className="relative space-y-6 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <h1 className="text-6xl font-black italic tracking-tighter text-white">
                INTRUSO
              </h1>
              <motion.div 
                animate={{ x: [-2, 2, -1], opacity: [1, 0.8, 1] }}
                transition={{ duration: 0.2, repeat: Infinity }}
                className="absolute inset-0 text-neon-red opacity-50 blur-[2px]"
              >
                INTRUSO
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className="h-1 bg-neon-red shadow-[0_0_10px_#ff3131]"
            />

            <motion.p
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1.2 }}
               className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30"
            >
              Crea la sospecha
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
