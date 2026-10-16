/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  GameState, 
  CharacterConfig, 
  DistrictInfo, 
  GameStats, 
  ActivePowerUp 
} from './types/game';
import { PLAYABLE_CHARACTERS, DISTRICTS } from './constants/gameData';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { ControlsOverlay } from './components/ControlsOverlay';
import { StartScreen } from './components/StartScreen';
import { GameOverModal } from './components/GameOverModal';
import { DripLockerModal } from './components/DripLockerModal';
import { UploadKitModal } from './components/UploadKitModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { soundManager } from './audio/soundManager';

const STORAGE_KEY_HIGH_SCORE = 'bro_bhag_high_score';
const STORAGE_KEY_COINS = 'bro_bhag_total_coins';
const STORAGE_KEY_CHARACTERS = 'bro_bhag_characters_data';

export default function App() {
  // Game State Machine
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Modals
  const [isLockerOpen, setIsLockerOpen] = useState(false);
  const [isUploadKitOpen, setIsUploadKitOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  // Characters & Districts
  const [characters, setCharacters] = useState<CharacterConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHARACTERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return PLAYABLE_CHARACTERS;
  });

  const [selectedCharacter, setSelectedCharacter] = useState<CharacterConfig>(characters[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo>(DISTRICTS[0]);

  // Player Stats & Records
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HIGH_SCORE);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [totalCoins, setTotalCoins] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COINS);
    return saved ? parseInt(saved, 10) : 60; // start with 60 coins
  });

  // Current Run Live Stats
  const [currentStats, setCurrentStats] = useState<GameStats>({
    score: 0,
    distance: 0,
    coinsCollected: 0,
    barricadesDodged: 0,
    cannonsBlocked: 0,
    gasSurvived: 0,
    currentDistrictIndex: 0,
    highScore: highScore,
    totalCoins: totalCoins,
    revivesUsed: 0,
  });

  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);

  // Canvas key to force re-mount on restart
  const [gameSessionId, setGameSessionId] = useState(1);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHARACTERS, JSON.stringify(characters));
    } catch {
      // Ignore
    }
  }, [characters]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HIGH_SCORE, highScore.toString());
    } catch {
      // Ignore
    }
  }, [highScore]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COINS, totalCoins.toString());
    } catch {
      // Ignore
    }
  }, [totalCoins]);

  // Character unlock handler
  const handleUnlockCharacter = (charId: string, cost: number): boolean => {
    if (totalCoins < cost) return false;
    setTotalCoins(prev => prev - cost);
    setCharacters(prev =>
      prev.map(c => (c.id === charId ? { ...c, unlocked: true } : c))
    );
    return true;
  };

  // Placard text update handler
  const handleUpdatePlacard = (charId: string, newPlacard: string) => {
    setCharacters(prev =>
      prev.map(c => (c.id === charId ? { ...c, placardText: newPlacard } : c))
    );
    if (selectedCharacter.id === charId) {
      setSelectedCharacter(prev => ({ ...prev, placardText: newPlacard }));
    }
  };

  // Game start
  const handleStartGame = () => {
    setCurrentStats({
      score: 0,
      distance: 0,
      coinsCollected: 0,
      barricadesDodged: 0,
      cannonsBlocked: 0,
      gasSurvived: 0,
      currentDistrictIndex: 0,
      highScore: highScore,
      totalCoins: totalCoins,
      revivesUsed: 0,
    });
    setActivePowerUps([]);
    setIsPaused(false);
    setGameState('PLAYING');
    setGameSessionId(prev => prev + 1);
  };

  // Run update from canvas
  const handleStatsUpdate = useCallback(
    (stats: GameStats, powerUps: ActivePowerUp[]) => {
      setCurrentStats(prev => ({
        ...prev,
        ...stats,
      }));
      setActivePowerUps(powerUps);
    },
    []
  );

  // District transition handler
  const handleDistrictChange = useCallback((newDistrictIndex: number) => {
    if (DISTRICTS[newDistrictIndex]) {
      setSelectedDistrict(DISTRICTS[newDistrictIndex]);
    }
  }, []);

  // Game over handler
  const handleGameOver = useCallback((finalStats: GameStats) => {
    soundManager.stopBGM();
    setTotalCoins(prev => prev + finalStats.coinsCollected);

    if (finalStats.score > highScore) {
      setHighScore(finalStats.score);
    }

    setCurrentStats(prev => ({
      ...prev,
      ...finalStats,
    }));
    setGameState('GAME_OVER');
  }, [highScore]);

  // Revive ("Bro Said Not Today")
  const handleRevive = () => {
    const reviveCost = 30;
    if (totalCoins >= reviveCost) {
      setTotalCoins(prev => prev - reviveCost);
      setCurrentStats(prev => ({
        ...prev,
        revivesUsed: prev.revivesUsed + 1,
      }));
      setIsPaused(false);
      setGameState('PLAYING');
      soundManager.startBGM();
      // Restart canvas with invincibility
      setGameSessionId(prev => prev + 1);
    }
  };

  // Audio mute toggle
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Pause toggle
  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Touch triggers passed to Canvas via simulated keys
  const triggerLeft = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
  };
  const triggerRight = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
  };
  const triggerJump = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
  };
  const triggerSlide = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 1. START MENU */}
      {gameState === 'MENU' && (
        <StartScreen
          characters={characters}
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={setSelectedDistrict}
          onStartGame={handleStartGame}
          onOpenLocker={() => setIsLockerOpen(true)}
          onOpenUploadKit={() => setIsUploadKitOpen(true)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          highScore={highScore}
          totalCoins={totalCoins}
        />
      )}

      {/* 2. ACTIVE RUNNING GAME */}
      {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
        <div className="relative w-full h-full">
          <GameCanvas
            key={gameSessionId}
            character={selectedCharacter}
            district={selectedDistrict}
            isPaused={isPaused}
            onGameOver={handleGameOver}
            onStatsUpdate={handleStatsUpdate}
            onDistrictChange={handleDistrictChange}
          />

          <GameHUD
            stats={currentStats}
            activePowerUps={activePowerUps}
            district={selectedDistrict}
            isPaused={isPaused}
            isMuted={isMuted}
            onTogglePause={handleTogglePause}
            onToggleMute={handleToggleMute}
          />

          <ControlsOverlay
            onLeft={triggerLeft}
            onRight={triggerRight}
            onJump={triggerJump}
            onSlide={triggerSlide}
          />

          {/* Pause Overlay Modal */}
          {isPaused && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-40">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4">
                <h3 className="text-2xl font-display font-black text-white uppercase">
                  Sprint Paused
                </h3>
                <p className="text-xs text-slate-400">
                  Catch your breath. Barricades and water cannons are on standby.
                </p>

                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    onClick={() => setIsPaused(false)}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition-all"
                  >
                    RESUME RUN
                  </button>

                  <button
                    onClick={() => {
                      soundManager.stopBGM();
                      setIsPaused(false);
                      setGameState('MENU');
                    }}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-colors"
                  >
                    RETURN TO MENU
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. GAME OVER MODAL */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          stats={currentStats}
          character={selectedCharacter}
          highScore={highScore}
          totalCoins={totalCoins}
          onRestart={handleStartGame}
          onRevive={handleRevive}
          onOpenLocker={() => setIsLockerOpen(true)}
        />
      )}

      {/* 4. DRIP LOCKER MODAL */}
      {isLockerOpen && (
        <DripLockerModal
          characters={characters}
          selectedCharacter={selectedCharacter}
          totalCoins={totalCoins}
          onSelectCharacter={setSelectedCharacter}
          onUnlockCharacter={handleUnlockCharacter}
          onUpdatePlacard={handleUpdatePlacard}
          onClose={() => setIsLockerOpen(false)}
        />
      )}

      {/* 5. UPLOAD & LAUNCH KIT MODAL */}
      {isUploadKitOpen && (
        <UploadKitModal onClose={() => setIsUploadKitOpen(false)} />
      )}

      {/* 6. HOW TO PLAY GUIDE MODAL */}
      {isHowToPlayOpen && (
        <HowToPlayModal onClose={() => setIsHowToPlayOpen(false)} />
      )}
    </div>
  );
}
