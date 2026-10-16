import React, { useState } from 'react';
import { CharacterConfig, DistrictInfo } from '../types/game';
import { GAME_ICON_PATH, DISTRICTS } from '../constants/gameData';
import { Play, Sparkles, Shield, Glasses, Coffee, HelpCircle, Package, Trophy, Check } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface StartScreenProps {
  characters: CharacterConfig[];
  selectedCharacter: CharacterConfig;
  onSelectCharacter: (char: CharacterConfig) => void;
  selectedDistrict: DistrictInfo;
  onSelectDistrict: (district: DistrictInfo) => void;
  onStartGame: () => void;
  onOpenLocker: () => void;
  onOpenUploadKit: () => void;
  onOpenHowToPlay: () => void;
  highScore: number;
  totalCoins: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  characters,
  selectedCharacter,
  onSelectCharacter,
  selectedDistrict,
  onSelectDistrict,
  onStartGame,
  onOpenLocker,
  onOpenUploadKit,
  onOpenHowToPlay,
  highScore,
  totalCoins,
}) => {
  const [hoveredChar, setHoveredChar] = useState<CharacterConfig | null>(null);

  const handleStart = () => {
    soundManager.startBGM();
    soundManager.playPowerUp();
    onStartGame();
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-y-auto">
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none filter blur-sm scale-105 transition-all duration-700"
        style={{ backgroundImage: `url(${selectedDistrict.backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950 pointer-events-none" />

      {/* Top Header Bar Contract */}
      <header className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src={GAME_ICON_PATH}
            alt="BRO BHAG! Game Icon"
            className="w-11 h-11 rounded-xl shadow-lg border border-amber-400/40 object-cover"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-xl font-display font-black tracking-tight text-white uppercase">
              BRO BHAG!
            </h1>
            <p className="text-xs text-slate-400">Delhi Protest Arcade Sprint</p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>High Score</span>
            <span className="font-mono-numbers text-amber-400 font-bold">{highScore.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1.5 text-yellow-400">
            <span className="font-bold text-sm">₹</span>
            <span className="font-mono-numbers font-bold text-slate-100">{totalCoins}</span>
          </div>

          <button
            onClick={onOpenUploadKit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900 transition-colors"
          >
            <Package className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Launch & Upload Kit</span>
            <span className="md:hidden">Upload Kit</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl w-full mx-auto py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Game Icon & Play Hero */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-5">
          <div className="relative group">
            <img
              src={GAME_ICON_PATH}
              alt="BRO BHAG! Official App Icon"
              className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl shadow-2xl border-2 border-amber-400/50 object-cover transform transition-transform group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-3 -right-3 bg-amber-500 text-slate-950 px-3 py-1 rounded-full font-black text-xs uppercase shadow-md tracking-wider">
              Gen Z Meme Runner
            </div>
          </div>

          <div className="space-y-2 max-w-lg">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white">
              RUN BEFORE THE WATER CANNONS HIT!
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Dodge yellow police barricades, slip on gas masks to beat tear gas clouds, and grab riot shields to deflect water jets across Delhi’s iconic historic avenues.
            </p>
          </div>

          {/* Quick Protective Rewards Overview */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Glasses className="w-4 h-4 text-emerald-400" />
              <span>Goggles = Gas Safe</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-sky-400" />
              <span>Shield = Cannon Block</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Chai = Slow-Mo</span>
            </div>
          </div>

          {/* Big Start Button */}
          <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
            <button
              onClick={handleStart}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xl rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>BHAG BRO BHAG!</span>
            </button>

            <button
              onClick={onOpenLocker}
              className="px-5 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm rounded-2xl transition-colors active:scale-95"
            >
              Drip Locker
            </button>

            <button
              onClick={onOpenHowToPlay}
              className="p-4 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-2xl transition-colors active:scale-95"
              aria-label="How to play guide"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Character Selection & District Route */}
        <div className="lg:col-span-6 flex flex-col gap-6 bg-slate-900/60 p-5 sm:p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
          {/* Character Quick Selection (Both Men & Women) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Select Your Runner
              </span>
              <span className="text-xs text-amber-400 font-medium">
                {selectedCharacter.gender === 'female' ? 'Women Runner' : 'Men Runner'} · {selectedCharacter.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {characters.map(char => {
                const isSelected = selectedCharacter.id === char.id;
                return (
                  <button
                    key={char.id}
                    onClick={() => {
                      onSelectCharacter(char);
                      soundManager.playWhoosh();
                    }}
                    onMouseEnter={() => setHoveredChar(char)}
                    onMouseLeave={() => setHoveredChar(null)}
                    className={`relative p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl mb-2 flex items-center justify-center font-bold text-lg text-slate-950 shadow-inner"
                      style={{ backgroundColor: char.outfitColor }}
                    >
                      {char.gender === 'female' ? '👩' : '🏃'}
                    </div>
                    <div className="font-bold text-sm text-slate-100 truncate">{char.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{char.role.split(' ')[0]}</div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-slate-950">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Character Placard & Outfit Info */}
            <div className="mt-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400">Placard: </span>
                <span className="font-bold text-slate-200">"{selectedCharacter.placardText}"</span>
              </div>
              <span className="text-slate-500 font-mono-numbers text-[11px]">{selectedCharacter.outfit}</span>
            </div>
          </div>

          {/* District Route Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Starting Delhi District
              </span>
              <span className="text-xs text-slate-400">3 Continuous Zones</span>
            </div>

            <div className="flex flex-col gap-2">
              {DISTRICTS.map(dist => {
                const isSelected = selectedDistrict.id === dist.id;
                return (
                  <button
                    key={dist.id}
                    onClick={() => {
                      onSelectDistrict(dist);
                      soundManager.playWhoosh();
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400/80 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={dist.backgroundImage}
                        alt={dist.name}
                        className="w-12 h-10 rounded-lg object-cover border border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-100">{dist.name}</div>
                        <div className="text-xs text-slate-400">{dist.subtitle}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono-numbers text-amber-300 font-bold">
                        {dist.baseSpeed}x Speed
                      </span>
                      <div className="text-[10px] text-slate-500">{dist.lanes} Lanes</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 max-w-5xl w-full mx-auto pt-4 border-t border-slate-800 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span>BRO BHAG! · Fictional Delhi Protest Chase Runner</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Desktop: Arrow Keys · Mobile: Swipe / Touch</span>
        </div>
      </footer>
    </div>
  );
};
