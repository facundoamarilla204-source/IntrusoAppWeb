import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import confetti from 'canvas-confetti';
import { Trophy, Skull, RotateCcw, Home as HomeIcon, Ghost } from 'lucide-react';

export const Results = () => {
  const { winner, players, word, resetGame } = useGameStore();
  const impostors = players.filter(p => p.role === 'impostor');
  const playersWon = winner === 'players';

  useEffect(() => {
    if (playersWon) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        const colors = ['#00d2ff', '#9d00ff', '#ffffff'];
        confetti({ ...defaults, particleCount, colors, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, colors, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [playersWon]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col flex-1 items-center justify-center text-center space-y-10"
    >
      <div className="space-y-6">
        {playersWon ? (
           <>
             <div className="w-24 h-24 bg-gradient-to-br from-[#00d2ff] to-[#9d00ff] rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(157,0,255,0.4)]">
               <Trophy className="h-12 w-12 text-white" />
             </div>
             <div className="space-y-2">
               <h2 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#9d00ff] uppercase">VICTORIA</h2>
               <p className="text-[#00d2ff] font-black uppercase tracking-[0.4em] text-[10px]">Seguridad Restaurada</p>
             </div>
           </>
        ) : (
           <>
             <div className="w-24 h-24 bg-neon-red rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(255,0,60,0.4)]">
               <Skull className="h-12 w-12 text-white" />
             </div>
             <div className="space-y-2">
               <h2 className="text-6xl font-black italic tracking-tighter text-neon-red uppercase">DERROTA</h2>
               <p className="text-white/30 font-black uppercase tracking-[0.4em] text-[10px]">Intruso Escapó</p>
             </div>
           </>
        )}
      </div>

      <div className="w-full space-y-8">
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-3xl p-10">
           <div className="space-y-8">
              <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Objetivo Identificado</p>
                 <div className="flex flex-col space-y-2">
                   {impostors.map(imp => (
                     <h3 key={imp.id} className="text-4xl font-black text-white italic uppercase tracking-tight">{imp.name}</h3>
                   ))}
                 </div>
              </div>
              <div className="h-px w-12 bg-white/10 mx-auto" />
              <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Palabra Encriptada</p>
                 <h3 className="text-4xl font-black text-neon-red italic tracking-tighter uppercase">{word}</h3>
              </div>
           </div>
        </Card>

        {/* Players Reveal mini grid */}
        <div className="flex flex-wrap justify-center gap-3">
          {players.map(p => (
            <div 
              key={p.id}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                p.role === 'impostor' 
                  ? 'bg-neon-red/10 border-neon-red text-neon-red' 
                  : 'bg-white/5 border-white/10 text-white/30'
              }`}
            >
              {p.name}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full space-y-4 pt-6">
        <Button size="lg" className="w-full" onClick={resetGame}>
          Reiniciar Partida
        </Button>
        <Button variant="secondary" size="md" className="w-full" onClick={resetGame}>
          Salir al Menú
        </Button>
      </div>
    </motion.div>
  );
};
