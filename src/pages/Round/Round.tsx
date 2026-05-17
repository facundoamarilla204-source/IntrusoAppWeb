import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Timer as TimerIcon, Pause, Play, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import clockSound from '../../assets/reloj.mp3';

export const Round = () => {
  const { currentTime, roundTime, tick, setGameState, category, players } = useGameStore();
  const [isPaused, setIsPaused] = useState(false);

  const aliveNormals = players.filter(p => p.role === 'player' && !p.isEliminated).length;
  const aliveImpostors = players.filter(p => p.role === 'impostor' && !p.isEliminated).length;
  const isCritical = aliveNormals === aliveImpostors + 1;

  const audioRef = React.useRef(new Audio(clockSound));

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [tick, isPaused]);

  useEffect(() => {
    if (!isPaused && currentTime > 0) {
      // Play sound on every tick
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }

    if (currentTime === 0) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [currentTime, isPaused]);

  const percentage = (currentTime / roundTime) * 100;
  const isEnding = currentTime <= 10;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col flex-1 space-y-12 items-center justify-center py-10"
    >
      <div className="text-center space-y-3">
        {isCritical ? (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="px-6 py-2 bg-neon-red/10 border border-neon-red rounded-full inline-flex items-center space-x-3 backdrop-blur-xl"
          >
            <AlertCircle className="h-4 w-4 text-neon-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-red">Protocolo Crítico: Ronda Final</span>
          </motion.div>
        ) : (
          <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full inline-flex items-center space-x-3 backdrop-blur-xl">
            <div className="w-2 h-2 bg-neon-red rounded-full animate-pulse shadow-[0_0_10px_#FF003C]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Ronda Activa</span>
          </div>
        )}
        <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">{category}</h2>
        {isCritical && (
          <motion.p
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-neon-red text-xs font-black uppercase tracking-[0.2em] mt-2"
          >
            Última oportunidad para detectar al intruso
          </motion.p>
        )}
      </div>

      {/* Circular Timer with Shake Effect */}
      <motion.div
        animate={isEnding && !isPaused ? {
          x: [-2, 2, -2, 2, 0],
          transition: { repeat: Infinity, duration: 0.1 }
        } : {}}
        className="relative w-72 h-72 flex items-center justify-center"
      >
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="144"
            cy="144"
            r="130"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="144"
            cy="144"
            r="130"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={816}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: 816 - (816 * percentage) / 100 }}
            className={isEnding ? 'text-neon-red' : 'text-neon-blue/40'}
          />
        </svg>

        <div className="text-center bg-[#0a0a0a] rounded-full w-56 h-56 flex flex-col items-center justify-center border border-white/10 shadow-[inner_0_0_30px_rgba(255,255,255,0.05)]">
          <span className={`text-8xl font-mono font-black italic tracking-tighter ${isEnding ? 'text-neon-red animate-pulse' : 'text-white'}`}>
            {currentTime}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Segundos</span>
        </div>
      </motion.div>

      <div className="space-y-8 w-full text-center">
        <p className="text-sm font-medium text-white/40 leading-relaxed max-w-xs mx-auto italic">
          "Describe tu palabra sin revelar el núcleo... El intruso está entre nosotros."
        </p>

        <div className="flex flex-col items-center space-y-4">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setGameState('voting')}
          >
            Terminar Ronda
          </Button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
          >
            {isPaused ? 'Reanudar Sesión' : 'Pausar Protocolo'}
          </button>
        </div>
      </div>

      {isEnding && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-10 flex items-center space-x-2 text-neon-red"
        >
          <AlertCircle className="h-4 w-4" />
          <span className="text-xs font-black uppercase tracking-widest">¡Tiempo casi agotado!</span>
        </motion.div>
      )}
    </motion.div>
  );
};
