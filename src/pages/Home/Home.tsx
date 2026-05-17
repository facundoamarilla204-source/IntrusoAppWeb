import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Users } from 'lucide-react';
import backgroundIllustration from '../../assets/fondo.jpeg';

export const Home = () => {
  const setGameState = useGameStore((state) => state.setGameState);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-between min-h-[80vh] md:min-h-[85vh] py-6 w-full text-center relative z-10"
    >
      {/* Full-Screen Ultra-High-Resolution 3K Background Image (Prism-sharp, 100% original quality) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center select-none pointer-events-none"
        style={{ backgroundImage: `url(${backgroundIllustration})` }}
      />
      
      {/* Soft gradient overlay for text readability (NO blur, NO brightness dimming) */}
      <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

      {/* Top Spacer to align layout exactly in the vertical center */}
      <div className="flex-1" />

      {/* Centered Interface Stack matching your reference mockup exactly */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xs sm:max-w-sm flex flex-col items-center justify-center space-y-4 my-auto px-4"
      >
        {/* Centered Title & Slogan Group with increased separation from buttons and premium glow effects */}
        <div className="space-y-1.5 text-center mb-6 sm:mb-8">
          <h1 
            className="text-5xl sm:text-6xl font-black tracking-tighter italic text-white uppercase leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] drop-shadow-[0_0_20px_rgba(255,0,60,0.6)]"
            style={{ WebkitTextStroke: '1.2px #000000' }}
          >
            IMPOSTOR
          </h1>
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-white/80 font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Mentir nunca fue tan divertido.
          </p>
        </div>

        {/* Primary Pill-Shaped Button "Iniciar Sistema" */}
        <Button 
          size="lg" 
          className="w-full bg-white text-black font-black uppercase tracking-widest py-3.5 sm:py-4 shadow-[0_4px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_35px_rgba(255,255,255,0.35)] hover:scale-[1.02] transition-all duration-300 rounded-full" 
          onClick={() => setGameState('setup')}
        >
          Iniciar Sistema
        </Button>
        
        {/* Secondary Pill-Shaped Buttons Grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button 
            variant="secondary" 
            size="md" 
            className="w-full border-white/5 bg-black/60 hover:bg-black/80 hover:border-white/15 text-white font-black uppercase tracking-wider text-[9px] sm:text-[10px] py-2.5 sm:py-3 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:scale-[1.02] transition-all duration-300 rounded-full"
            onClick={() => setGameState('instructions')}
          >
            Instrucciones
          </Button>
          <Button 
            variant="secondary" 
            size="md" 
            className="w-full border-white/5 bg-black/60 hover:bg-black/80 hover:border-white/15 text-white font-black uppercase tracking-wider text-[9px] sm:text-[10px] py-2.5 sm:py-3 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:scale-[1.02] transition-all duration-300 rounded-full"
            onClick={() => setGameState('settings')}
          >
            Configuración
          </Button>
        </div>
      </motion.div>

      {/* Bottom Spacer to push footer to the absolute bottom */}
      <div className="flex-1" />

      {/* Cinematic Footer Section matching your mockup */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="relative z-10 flex items-center space-x-3 text-white"
      >
        <div className="flex items-center space-x-1.5">
          <Users className="h-3 w-3" />
          <span className="text-[8px] font-bold uppercase tracking-widest">Cooperativo Local</span>
        </div>
        <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
        <span className="text-[8px] font-bold uppercase tracking-widest">v1.2.0</span>
      </motion.div>
    </motion.div>
  );
};
