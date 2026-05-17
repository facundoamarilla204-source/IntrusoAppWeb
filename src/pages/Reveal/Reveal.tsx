import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Eye, EyeOff, ChevronRight, ChevronLeft, Lock, AlertCircle } from 'lucide-react';

export const Reveal = () => {
  const { players, revealingPlayerIndex, nextReveal } = useGameStore();
  const setGameState = useGameStore((state) => state.setGameState);
  const [isRevealed, setIsRevealed] = useState(false);
  const currentPlayer = players[revealingPlayerIndex];

  const handleNext = () => {
    setIsRevealed(false);
    nextReveal();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col flex-1 items-center justify-center space-y-8 text-center relative"
    >
      <div className="w-full flex justify-start min-h-[40px]">
        {revealingPlayerIndex === 0 && (
          <Button variant="ghost" size="sm" onClick={() => setGameState('setup')} className="px-2">
            <ChevronLeft className="mr-1 h-5 w-5" /> Volver
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">Transmisión Segura para:</h3>
        <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">{currentPlayer.name}</h2>
      </div>

      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="w-full"
          >
            <Card 
              className="py-24 flex flex-col items-center justify-center space-y-8 cursor-pointer border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500"
              onClick={() => setIsRevealed(true)}
            >
              <div className="w-24 h-24 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center relative">
                <Lock className="h-10 w-10 text-white/10" />
                <motion.div 
                   animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
                   transition={{ duration: 3, repeat: Infinity }}
                   className="absolute inset-0 rounded-full border border-white/20"
                />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Desencriptar Rol</p>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-full"
          >
             {currentPlayer.role === 'impostor' ? (
                <Card className="py-24 border-[#FF003C] bg-[#FF003C]/5 shadow-[0_0_50px_rgba(255,0,60,0.2)] relative overflow-hidden">
                   <motion.div 
                     animate={{ opacity: [0.05, 0.15, 0.05] }}
                     transition={{ duration: 0.3, repeat: Infinity }}
                     className="absolute inset-0 bg-[#FF003C]/20"
                   />
                   <div className="relative z-10 space-y-8">
                      <AlertCircle className="h-20 w-20 text-[#FF003C] mx-auto drop-shadow-[0_0_15px_rgba(255,0,60,0.5)]" />
                      <div className="space-y-1">
                        <h4 className="text-4xl font-black text-[#FF003C] italic tracking-tighter uppercase leading-none opacity-50">Tú eres el</h4>
                        <motion.h4 
                          animate={{ x: [-2, 2, -2] }}
                          transition={{ duration: 0.1, repeat: Infinity }}
                          className="text-7xl font-black text-white italic tracking-tighter uppercase leading-none"
                        >
                          INTRUSO
                        </motion.h4>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Evita ser detectado a toda costa</p>
                      
                      {currentPlayer.hint && (
                        <div className="mt-6 p-4 bg-black/40 border border-[#FF003C]/30 rounded-xl">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF003C]/70 mb-2">Pista Interceptada:</p>
                          <p className="text-sm text-white/90 italic font-medium">"{currentPlayer.hint}"</p>
                        </div>
                      )}
                   </div>
                </Card>
             ) : (
                <Card className="py-24 border-white/20 bg-white/5 backdrop-blur-3xl">
                   <div className="space-y-10">
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Identificador:</h4>
                        <h4 className="text-6xl font-black text-white italic tracking-tighter uppercase">{currentPlayer.word}</h4>
                      </div>
                      <div className="px-6 py-2 border border-white/10 bg-white/5 rounded-full inline-block">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Sector: {useGameStore.getState().category}</p>
                      </div>
                   </div>
                </Card>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full pt-8">
        <Button 
          disabled={!isRevealed}
          size="lg" 
          className="w-full" 
          onClick={handleNext}
        >
          {revealingPlayerIndex === players.length - 1 ? 'Iniciar Protocolo' : 'Siguiente Operativo'}
        </Button>
      </div>
    </motion.div>
  );
};
