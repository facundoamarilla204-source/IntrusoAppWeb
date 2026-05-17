/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameStore } from './store/useGameStore';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home/Home';
import { Setup } from './pages/Setup/Setup';
import { Players } from './pages/Players/Players';
import { Reveal } from './pages/Reveal/Reveal';
import { Round } from './pages/Round/Round';
import { Voting } from './pages/Voting/Voting';
import { Results } from './pages/Results/Results';
import { Countdown } from './components/game/Countdown';
import { SplashScreen } from './components/layout/SplashScreen';
import { Instructions } from './pages/Instructions/Instructions';
import { Settings } from './pages/Settings/Settings';
import { EliminationResult } from './pages/Elimination/EliminationResult';
import { AnimatePresence } from 'framer-motion';

export default function App() {
  const gameState = useGameStore((state) => state.gameState);
  const startRound = useGameStore((state) => state.startRound);
  const loadGameData = useGameStore((state) => state.loadGameData);
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    loadGameData();
  }, [loadGameData]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const renderPage = () => {
    switch (gameState) {
      case 'home':
        return <Home key="home" />;
      case 'setup':
        return <Setup key="setup" />;
      case 'players':
        return <Players key="players" />;
      case 'reveal':
        return <Reveal key="reveal" />;
      case 'countdown':
        return <Countdown key="countdown" onComplete={startRound} />;
      case 'round':
        return <Round key="round" />;
      case 'voting':
        return <Voting key="voting" />;
      case 'elimination':
        return <EliminationResult key="elimination" />;
      case 'results':
        return <Results key="results" />;
      case 'instructions':
        return <Instructions key="instructions" />;
      case 'settings':
        return <Settings key="settings" />;
      default:
        return <Home key="home" />;
    }
  };

  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>
    </MainLayout>
  );
}

