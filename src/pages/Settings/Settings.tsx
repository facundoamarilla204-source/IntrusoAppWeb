import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ChevronLeft, Volume2, VolumeX, Languages } from 'lucide-react';

export const Settings = () => {
  const setGameState = useGameStore((state) => state.setGameState);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState('ES');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col flex-1 space-y-8"
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setGameState('home')} className="px-2">
          <ChevronLeft className="mr-1 h-5 w-5" /> Volver
        </Button>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/50">Configuración</h2>
      </div>

      <div className="space-y-4 flex-1">
        <Card className="p-6 border-white/10 bg-white/5 backdrop-blur-3xl space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                {soundEnabled ? <Volume2 className="h-5 w-5 text-white" /> : <VolumeX className="h-5 w-5 text-white/40" />}
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Efectos de Sonido</h3>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Feedback Auditivo</p>
              </div>
            </div>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 ${soundEnabled ? 'bg-neon-red' : 'bg-white/10'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${soundEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="w-full h-px bg-white/5" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Languages className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Idioma</h3>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Selector Regional</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={language === 'ES' ? 'primary' : 'ghost'} 
                size="sm" 
                onClick={() => setLanguage('ES')}
                className="px-4 py-2 text-xs"
              >
                ES
              </Button>
              <Button 
                variant={language === 'EN' ? 'ghost' : 'ghost'} 
                size="sm" 
                onClick={() => setLanguage('EN')}
                className="px-4 py-2 text-xs opacity-50 cursor-not-allowed"
              >
                EN
              </Button>
            </div>
          </div>

        </Card>
      </div>
    </motion.div>
  );
};
