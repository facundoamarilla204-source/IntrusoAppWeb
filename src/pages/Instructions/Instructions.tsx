import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ChevronLeft, Target, Users } from 'lucide-react';

export const Instructions = () => {
  const setGameState = useGameStore((state) => state.setGameState);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col flex-1 space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setGameState('home')} className="px-2">
          <ChevronLeft className="mr-1 h-5 w-5" /> Volver
        </Button>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/50">Instrucciones</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 flex-1">
        <Card className="p-6 border-white/10 bg-white/5 backdrop-blur-3xl flex flex-col justify-center">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-neon-red/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-neon-red" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest text-white">Objetivo</h3>
          </div>
          <p className="text-sm text-white/60 leading-relaxed font-medium">
            Todos los jugadores reciben la misma palabra secreta, excepto el <span className="text-neon-red font-bold">IMPOSTOR</span>. 
            El objetivo de los jugadores es descubrir al impostor. El objetivo del impostor es pasar desapercibido y deducir la palabra secreta.
          </p>
        </Card>

        <Card className="p-6 border-white/10 bg-white/5 backdrop-blur-3xl flex flex-col justify-center">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest text-white">Protocolo</h3>
          </div>
          <ul className="text-sm text-white/60 leading-relaxed font-medium space-y-3">
            <li className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-white/30" /> <span>Revelá tu rol en secreto.</span></li>
            <li className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-white/30" /> <span>Durante el tiempo límite, debatan y hagan preguntas.</span></li>
            <li className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-white/30" /> <span>Al terminar, voten por el jugador que consideren sospechoso.</span></li>
          </ul>
        </Card>
      </div>
    </motion.div>
  );
};
