import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { UserX, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const EliminationResult = () => {
  const { lastEliminatedPlayer, nextRound } = useGameStore();

  if (!lastEliminatedPlayer) return null;

  const isImpostor = lastEliminatedPlayer.role === 'impostor';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col flex-1 items-center justify-center space-y-8 py-6 text-center"
    >
      <div className="space-y-2">
        <h3 className="text-white/40 font-black uppercase tracking-[0.4em] text-[10px]">Eliminación Confirmada</h3>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
          {lastEliminatedPlayer.name}
        </h2>
        <p className="text-white/60 font-medium text-sm mt-2">ha sido desconectado del sistema.</p>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="w-full"
      >
        <Card className={`py-12 border ${isImpostor ? 'border-[#FF003C]/50 bg-[#FF003C]/5' : 'border-blue-500/50 bg-blue-500/5'} flex flex-col items-center space-y-4`}>
          {isImpostor ? (
            <AlertTriangle className="h-16 w-16 text-[#FF003C] drop-shadow-[0_0_15px_rgba(255,0,60,0.5)]" />
          ) : (
            <UserX className="h-16 w-16 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          )}
          
          <div className="space-y-1">
            <h4 className={`text-3xl font-black italic tracking-tighter uppercase ${isImpostor ? 'text-[#FF003C]' : 'text-blue-500'}`}>
              Era {isImpostor ? 'el Impostor' : 'un Inocente'}
            </h4>
          </div>
        </Card>
      </motion.div>

      <div className="w-full pt-6">
        <Button size="lg" className="w-full" onClick={nextRound}>
          Siguiente Ronda
        </Button>
      </div>
    </motion.div>
  );
};
