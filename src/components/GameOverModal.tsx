import React, { useEffect, useState } from 'react';
import { GameStats, CharacterConfig } from '../types/game';
import { RotateCcw, Share2, Award, Heart, Check, Shirt, Trophy, Shield, Glasses } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../audio/soundManager';

interface GameOverModalProps {
  stats: GameStats;
  character: CharacterConfig;
  highScore: number;
  totalCoins: number;
  onRestart: () => void;
  onRevive: () => void;
  onOpenLocker: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  character,
  highScore,
  totalCoins,
  onRestart,
  onRevive,
  onOpenLocker,
}) => {
  const isNewHighScore = stats.score > highScore;
  const [copied, setCopied] = useState(false);
  const reviveCost = 30;
  const canAffordRevive = totalCoins >= reviveCost && stats.revivesUsed === 0;

  useEffect(() => {
    if (isNewHighScore) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      soundManager.playPowerUp();
    }
  }, [isNewHighScore]);

  const getRunTitle = () => {
    if (stats.distance > 1500) return 'Legendary Delhi Ghost Runner';
    if (stats.distance > 800) return 'Barricade Vaulting Master';
    if (stats.cannonsBlocked >= 3) return 'Water Cannon Deflector General';
    if (stats.gasSurvived >= 3) return 'Gas Mask Tactical Survivor';
    if (stats.coinsCollected > 20) return 'Chai & Samosa Tycoon';
    return 'Official Bhagoda Cadet';
  };

  const handleShareCertificate = () => {
    const shareText = `🏃‍♂️ BRO BHAG! RUN REPORT:\n` +
      `Runner: ${character.name} (${character.gender === 'female' ? 'Women' : 'Men'})\n` +
      `Score: ${stats.score.toLocaleString()} PTS\n` +
      `Distance: ${stats.distance}m\n` +
      `Barricades Dodged: ${stats.barricadesDodged}\n` +
      `Cannons Deflected: ${stats.cannonsBlocked}\n` +
      `Gas Survived: ${stats.gasSurvived}\n` +
      `Title: ${getRunTitle()}\n` +
      `Play BRO BHAG! now! No cap 100% 🔥`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-block px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Run Ended · Caught by Barriers
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
            {isNewHighScore ? 'NEW RECORD HIGH SCORE!' : 'MOYE MOYE! RUN OVER'}
          </h2>
          <p className="text-xs text-slate-400">
            Delhi streets were swift today, but your spirit is uncatchable!
          </p>
        </div>

        {/* Certificate Card */}
        <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-5 mb-6 shadow-inner relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-15">
            <Award className="w-24 h-24 text-amber-400" />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">Official Runner</div>
              <div className="font-bold text-slate-100 flex items-center gap-1.5">
                <span>{character.name}</span>
                <span className="text-xs text-amber-400">({character.role})</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">Certified Title</div>
              <div className="text-xs font-bold text-amber-300">{getRunTitle()}</div>
            </div>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-3 gap-3 py-4 text-center">
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Final Score</div>
              <div className="text-lg font-black font-mono-numbers text-amber-400">
                {stats.score.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Distance</div>
              <div className="text-lg font-black font-mono-numbers text-slate-100">
                {stats.distance} m
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Coins</div>
              <div className="text-lg font-black font-mono-numbers text-yellow-400">
                ₹ {stats.coinsCollected}
              </div>
            </div>
          </div>

          {/* Tactical Defense Breakdown */}
          <div className="flex items-center justify-around pt-2 text-xs text-slate-400 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              <span>Cannons Blocked: <strong className="text-slate-200 font-mono-numbers">{stats.cannonsBlocked}</strong></span>
            </div>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <div className="flex items-center gap-1.5">
              <Glasses className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gas Cleared: <strong className="text-slate-200 font-mono-numbers">{stats.gasSurvived}</strong></span>
            </div>
          </div>
        </div>

        {/* Revive Button if applicable */}
        {canAffordRevive && (
          <div className="mb-4">
            <button
              onClick={() => {
                soundManager.playPowerUp();
                onRevive();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg active:scale-98"
            >
              <Heart className="w-4 h-4 fill-current text-red-300" />
              <span>BRO SAID NOT TODAY! Revive for ₹{reviveCost}</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-1">1 Second-Chance Revive per sprint session</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-md active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RUN AGAIN</span>
          </button>

          <button
            onClick={handleShareCertificate}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm rounded-xl border border-slate-700 transition-colors active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'COPIED TO CLIPBOARD!' : 'SHARE RUN REPORT'}</span>
          </button>

          <button
            onClick={onOpenLocker}
            className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors flex items-center justify-center"
            aria-label="Customize Character in Drip Locker"
          >
            <Shirt className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
