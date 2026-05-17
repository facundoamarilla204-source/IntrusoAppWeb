import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { INITIAL_CONFIG } from '../../constants/game';
import { Card } from '../../components/ui/Card';
import { UserPlus, UserMinus, ChevronLeft, Brain, Sparkles, Loader2 } from 'lucide-react';

export const Setup = () => {
  const prepareSetup = useGameStore((state) => state.prepareSetup);
  const setGameState = useGameStore((state) => state.setGameState);
  const categories = useGameStore((state) => state.categories);

  const [playerNames, setPlayerNames] = useState<string[]>(
    Array(INITIAL_CONFIG.defaultPlayers).fill('').map((_, i) => `Jugador ${i + 1}`)
  );
  const [impostorCount, setImpostorCount] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    return categories.length > 0 ? [categories[0].id] : [];
  });
  const [time, setTime] = useState(60);
  const [impostorHintEnabled, setImpostorHintEnabled] = useState(false);
  const [aiHintEnabled, setAiHintEnabled] = useState(false);
  const [isGeneratingAiHint, setIsGeneratingAiHint] = useState(false);

  const handleAddPlayer = () => {
    if (playerNames.length < INITIAL_CONFIG.maxPlayers) {
      setPlayerNames([...playerNames, `Jugador ${playerNames.length + 1}`]);
    }
  };

  const handleRemovePlayer = () => {
    if (playerNames.length > INITIAL_CONFIG.minPlayers) {
      const newCount = playerNames.length - 1;
      setPlayerNames(playerNames.slice(0, -1));
      
      // Enforce impostor limits based on player count
      if (impostorCount === 3 && newCount < 8) setImpostorCount(2);
      if (impostorCount >= 2 && newCount < 5) setImpostorCount(1);
    }
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Require at least one category
        return prev.filter(c => c !== id);
      }
      return [...prev, id];
    });
  };

  const handleNext = async () => {
    const selectedCats = categories.filter(c => selectedCategories.includes(c.id));
    const allWords = selectedCats.flatMap(c => c.words);
    
    if (allWords.length === 0) {
      alert("Error: No hay palabras disponibles en las categorías seleccionadas.");
      return;
    }

    const categoryNames = selectedCats.map(c => c.name).join(' + ');
    const randomWordObj = allWords[Math.floor(Math.random() * allWords.length)];
    
    let finalHint = randomWordObj.hint;

    if (impostorHintEnabled && aiHintEnabled) {
      setIsGeneratingAiHint(true);
      try {
        const { generateDynamicHint } = await import('../../lib/gemini');
        const aiHint = await generateDynamicHint(randomWordObj.word, categoryNames);
        if (aiHint) {
          finalHint = aiHint;
        }
      } catch (err) {
        console.error("No se pudo generar la pista con Gemini, usando pista estática:", err);
      } finally {
        setIsGeneratingAiHint(false);
      }
    }

    prepareSetup(playerNames, impostorCount, categoryNames, randomWordObj.word, finalHint, time, impostorHintEnabled);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col flex-1 space-y-8"
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setGameState('home')} className="px-2" disabled={isGeneratingAiHint}>
          <ChevronLeft className="mr-1 h-5 w-5" /> Volver
        </Button>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/50">Configurar Partida</h2>
      </div>

      {/* Player Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Operativos</label>
          <div className="flex items-center space-x-4">
            <button onClick={handleRemovePlayer} disabled={isGeneratingAiHint} className="p-2 transition-colors rounded-full hover:bg-white/5 text-white/40 hover:text-neon-red disabled:opacity-40">
              <UserMinus className="h-5 w-5" />
            </button>
            <span className="text-3xl font-black italic text-white">{playerNames.length}</span>
            <button onClick={handleAddPlayer} disabled={isGeneratingAiHint} className="p-2 transition-colors rounded-full hover:bg-white/5 text-white/40 hover:text-neon-red disabled:opacity-40">
              <UserPlus className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {playerNames.map((name, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Impostor Section */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Impostores</label>
        <div className="flex space-x-3">
          {[1, 2, 3].map((num) => {
            const isDisabled = (num === 2 && playerNames.length < 5) || (num === 3 && playerNames.length < 8) || isGeneratingAiHint;
            return (
              <button
                key={num}
                onClick={() => setImpostorCount(num)}
                disabled={isDisabled}
                className={`flex-1 py-4 border transition-all duration-300 rounded-2xl text-xs font-black uppercase tracking-widest ${
                  impostorCount === num 
                    ? 'border-neon-red bg-neon-red/10 text-neon-red shadow-[0_0_15px_rgba(255,0,60,0.2)]' 
                    : isDisabled
                    ? 'border-white/5 bg-white/5 text-white/10 cursor-not-allowed opacity-40'
                    : 'border-white/10 bg-white/5 text-white/30 hover:border-white/20 hover:text-white/50'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
        {playerNames.length < 5 && (
           <p className="text-[9px] uppercase tracking-widest text-white/20 text-center -mt-1">Requiere 5+ operativos para 2 impostores</p>
        )}
      </div>

      {/* Impostor Hint Section */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Pista para Impostor</label>
            <p className="text-[9px] uppercase tracking-widest text-white/40">El impostor recibe una pista de la palabra</p>
          </div>
          <button 
            disabled={isGeneratingAiHint}
            onClick={() => {
              const newValue = !impostorHintEnabled;
              setImpostorHintEnabled(newValue);
              if (!newValue) setAiHintEnabled(false);
            }}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${impostorHintEnabled ? 'bg-neon-red' : 'bg-white/10'} disabled:opacity-40`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${impostorHintEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Dynamic AI Hint Toggle - Micro-animated expansion */}
        <AnimatePresence>
          {impostorHintEnabled && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white/5 to-white/[0.08] border border-white/10 rounded-2xl mt-1">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-3.5 w-3.5 text-neon-red animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Pistas Dinámicas con IA</span>
                    <span className="px-1.5 py-0.5 bg-neon-red/20 border border-neon-red/40 rounded text-[7px] font-black uppercase tracking-widest text-neon-red">Beta</span>
                  </div>
                  <p className="text-[9px] uppercase tracking-widest text-white/40">Genera una pista críptica y única usando Gemini</p>
                </div>
                <button 
                  disabled={isGeneratingAiHint}
                  onClick={() => setAiHintEnabled(!aiHintEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${aiHintEnabled ? 'bg-neon-red' : 'bg-white/10'} disabled:opacity-40`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${aiHintEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Section */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Sector de Datos</label>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              onClick={() => !isGeneratingAiHint && toggleCategory(cat.id)}
              className={`p-5 transition-all duration-300 ${
                selectedCategories.includes(cat.id)
                  ? 'border-neon-red/50 bg-neon-red/5 shadow-[0_0_20px_rgba(255,0,60,0.1)]' 
                  : 'opacity-60 grayscale'
              } ${isGeneratingAiHint ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg text-lg drop-shadow-md`}>
                   {cat.icon}
                </div>
                <span className="font-black italic uppercase tracking-tighter text-sm">{cat.name}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Time Section */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Ventana Temporal</label>
        <div className="flex space-x-3">
          {INITIAL_CONFIG.durations.map((d) => (
            <button
              key={d}
              onClick={() => setTime(d)}
              disabled={isGeneratingAiHint}
              className={`flex-1 py-4 border transition-all duration-300 rounded-2xl text-xs font-black uppercase tracking-widest ${
                time === d 
                  ? 'border-neon-red bg-neon-red/10 text-neon-red shadow-[0_0_15px_rgba(255,0,60,0.2)]' 
                  : 'border-white/10 bg-white/5 text-white/30'
              } disabled:opacity-40`}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-6">
        <Button 
          size="lg" 
          className="w-full flex items-center justify-center" 
          onClick={handleNext}
          disabled={isGeneratingAiHint}
        >
          {isGeneratingAiHint ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white mr-2" />
              <span>Generando Pista con IA...</span>
            </>
          ) : (
            <span>Continuar</span>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

