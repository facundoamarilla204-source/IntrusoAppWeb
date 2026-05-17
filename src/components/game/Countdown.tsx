import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

export const Countdown = ({ onComplete }: { onComplete: () => void; key?: React.Key }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <motion.div
        key={count}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 1 }}
        exit={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="text-8xl font-black italic italic tracking-tighter text-white"
      >
        {count > 0 ? count : '¡VAMOS!'}
      </motion.div>
    </div>
  );
};
