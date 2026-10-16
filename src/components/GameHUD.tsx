import React from 'react';
import { GameStats, ActivePowerUp, DistrictInfo } from '../types/game';
import { Volume2, VolumeX, Pause, Play, Shield, Glasses, Coffee, Magnet } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface GameHUDProps {
  stats: GameStats;
  activePowerUps: ActivePowerUp[];
  district: DistrictInfo;
  isPaused: boolean;
  isMuted: boolean;
  onTogglePause: () => void;
  onToggleMute: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  activePowerUps,
  district,
  isPaused,
  isMuted,
  onTogglePause,
  onToggleMute,
}) => {
  const getPowerUpIcon = (type: string) => {
    switch (type) {
      case 'gas_mask':
        return <Glasses className="w-4 h-4 text-emerald-400" />;
      case 'riot_shield':
        return <Shield className="w-4 h-4 text-sky-400" />;
      case 'chai_boost':
        return <Coffee className="w-4 h-4 text-amber-400" />;
      case 'viral_magnet':
        return <Magnet className="w-4 h-4 text-pink-400" />;
      default:
        return null;
    }
  };

  const getPowerUpName = (type: string) => {
    switch (type) {
      case 'gas_mask':
        return 'Goggles / Gas Mask';
      case 'riot_shield':
        return 'Riot Shield';
      case 'chai_boost':
        return 'Cutting Chai Boost';
      case 'viral_magnet':
        return 'Viral Magnet';
      default:
        return '';
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none select-none z-30">
      <div className="max-w-4xl mx-auto flex items-start justify-between gap-4">
        {/* Left: Score & Distance unboxed typography */}
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-amber-400 font-mono-numbers drop-shadow-sm">
              {stats.score.toLocaleString()}
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">PTS</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <span className="font-mono-numbers text-slate-100">{stats.distance} m</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-yellow-400 font-mono-numbers">₹ {stats.coinsCollected}</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-slate-400 truncate max-w-[140px] md:max-w-[200px]">{district.name}</span>
          </div>
        </div>

        {/* Center: Active Power-Up Timers */}
        <div className="hidden sm:flex flex-col items-center gap-1.5 pointer-events-auto">
          {activePowerUps.map(pu => (
            <div 
              key={pu.type}
              className="flex items-center gap-2 px-3 py-1 bg-slate-900/85 border border-slate-700/60 rounded-md backdrop-blur-md shadow-lg"
            >
              {getPowerUpIcon(pu.type)}
              <span className="text-xs font-semibold text-slate-200">
                {getPowerUpName(pu.type)}
              </span>
              <span className="text-xs font-mono-numbers font-bold text-amber-300 min-w-[26px] text-right">
                {Math.ceil(pu.remainingTime)}s
              </span>
            </div>
          ))}
        </div>

        {/* Right: Sound & Pause Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 backdrop-blur-sm transition-colors active:scale-95"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          <button
            onClick={onTogglePause}
            aria-label={isPaused ? 'Resume Run' : 'Pause Run'}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 backdrop-blur-sm transition-colors active:scale-95"
          >
            {isPaused ? <Play className="w-5 h-5 text-amber-400" /> : <Pause className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Active Powerup Bar */}
      {activePowerUps.length > 0 && (
        <div className="sm:hidden flex flex-wrap gap-2 mt-2 justify-center">
          {activePowerUps.map(pu => (
            <div 
              key={pu.type}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-700/60 rounded-md text-xs font-semibold"
            >
              {getPowerUpIcon(pu.type)}
              <span className="text-slate-200 text-[11px]">{getPowerUpName(pu.type).split(' ')[0]}</span>
              <span className="font-mono-numbers text-amber-300 text-[11px]">{Math.ceil(pu.remainingTime)}s</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
