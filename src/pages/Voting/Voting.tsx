import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Gavel, CheckCircle2 } from 'lucide-react';

export const Voting = () => {
  const { players, votePlayer } = useGameStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const aliveNormals = players.filter(p => p.role === 'player' && !p.isEliminated).length;
  const aliveImpostors = players.filter(p => p.role === 'impostor' && !p.isEliminated).length;
  const isCritical = aliveNormals === aliveImpostors + 1;

  const handleVote = () => {
    if (selectedId) {
      votePlayer(selectedId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col flex-1 space-y-8 py-6"
    >
      <div className="text-center space-y-3">
        {isCritical && (
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-neon-red font-black uppercase tracking-[0.3em] text-xs mb-4"
          >
            ⚠️ PROTOCOLO CRÍTICO: FALLAR AHORA ES EL FIN ⚠️
          </motion.div>
        )}
        <div className="flex items-center justify-center space-x-3 text-neon-red">
          <Gavel className="h-6 w-6" />
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Proceso de Votación</h2>
        </div>
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Identificar al intruso</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {players.filter(p => !p.isEliminated).map((player) => (
          <Card
            key={player.id}
            onClick={() => setSelectedId(player.id)}
            className={`p-6 flex flex-col items-center justify-center space-y-4 transition-all duration-500 ${
              selectedId === player.id 
                ? 'border-[#FF003C] bg-[#FF003C]/10 shadow-[0_0_30px_rgba(255,0,60,0.2)]' 
                : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl border-2 transition-colors ${
                selectedId === player.id 
                  ? 'border-white text-white bg-neon-red/20' 
                  : 'border-white/10 text-white/20 bg-white/5'
            }`}>
              {player.name[0]}
            </div>
            <div className="text-center space-y-1">
              <span className={`text-base font-black italic uppercase tracking-tight block ${
                selectedId === player.id ? 'text-white' : 'text-white/40'
              }`}>
                {player.name}
              </span>
              <span className={`text-[9px] font-black uppercase tracking-widest block transition-colors ${
                 selectedId === player.id ? 'text-[#FF003C]' : 'text-white/20'
              }`}>
                {selectedId === player.id ? 'Sospechoso' : 'En Espera'}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-6">
        <div className="flex justify-between items-center bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-2xl mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#10B851] animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Sistema Listo</span>
          </div>
        </div>
        <Button 
          disabled={!selectedId}
          size="lg" 
          className="w-full" 
          onClick={handleVote}
        >
          CONFIRMAR VOTO
        </Button>
      </div>
    </motion.div>
  );
};
