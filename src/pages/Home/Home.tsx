import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Play, HelpCircle, Settings, Users } from 'lucide-react';

export const Home = () => {
  const setGameState = useGameStore((state) => state.setGameState);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center flex-1 space-y-12 py-10"
    >
      {/* Logo Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-4"
      >
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-neon-red rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,0,60,0.6)] mb-4">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic text-white uppercase leading-none">
            IMPOSTOR
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-3 font-black">
            Mentir nunca fue tan divertido.
          </p>
        </div>
      </motion.div>

      {/* Hero Buttons */}
      <div className="w-full space-y-4 max-w-sm">
        <Button 
          size="lg" 
          className="w-full" 
          onClick={() => setGameState('setup')}
        >
          Iniciar Sistema
        </Button>
        
        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" size="md" className="w-full" onClick={() => setGameState('instructions')}>
            Instrucciones
          </Button>
          <Button variant="secondary" size="md" className="w-full" onClick={() => setGameState('settings')}>
            Configuración
          </Button>
        </div>
      </div>

      {/* Active Section Footer */}
      <div className="flex items-center space-x-6 text-white/30 pt-8">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Cooperativo Local</span>
        </div>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <span className="text-xs font-bold uppercase tracking-wider">v1.2.0</span>
      </div>
    </motion.div>
  );
};
