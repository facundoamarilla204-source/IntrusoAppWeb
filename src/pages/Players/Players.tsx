import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ChevronLeft, UserCircle2 } from 'lucide-react';

export const Players = () => {
  const setGameState = useGameStore((state) => state.setGameState);
  const setSetup = useGameStore((state) => state.setSetup);
  const draftPlayerNames = useGameStore((state) => state.draftPlayerNames);

  const [names, setNames] = useState<string[]>(draftPlayerNames);

  const handleNameChange = (index: number, newName: string) => {
    const updatedNames = [...names];
    updatedNames[index] = newName;
    setNames(updatedNames);
  };

  const handleConfirm = () => {
    // Fill empty names with default values just in case
    const finalNames = names.map((name, i) => name.trim() !== '' ? name : `Jugador ${i + 1}`);
    setSetup(finalNames);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col flex-1 space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setGameState('setup')} className="px-2">
          <ChevronLeft className="mr-1 h-5 w-5" /> Volver
        </Button>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/50">Identificación</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 pb-10" style={{ maxHeight: '60vh' }}>
        {names.map((name, index) => (
          <Card key={index} className="p-4 border-white/10 bg-white/5 backdrop-blur-md flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <UserCircle2 className="h-5 w-5 text-white/60" />
            </div>
            <div className="flex-1">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 block mb-1">
                Operativo 0{index + 1}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Jugador ${index + 1}`}
                className="w-full bg-transparent border-none outline-none text-xl font-black italic text-white uppercase tracking-tighter placeholder:text-white/20"
                maxLength={15}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-4">
        <Button size="lg" className="w-full" onClick={handleConfirm}>
          Iniciar Protocolo
        </Button>
      </div>
    </motion.div>
  );
};
