import React, { useState } from 'react';
import { CharacterConfig } from '../types/game';
import { PLACARD_MEMES } from '../constants/gameData';
import { X, Check, Lock, Sparkles, Tag, Smile } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface DripLockerModalProps {
  characters: CharacterConfig[];
  selectedCharacter: CharacterConfig;
  totalCoins: number;
  onSelectCharacter: (char: CharacterConfig) => void;
  onUnlockCharacter: (charId: string, cost: number) => boolean;
  onUpdatePlacard: (charId: string, newPlacard: string) => void;
  onClose: () => void;
}

export const DripLockerModal: React.FC<DripLockerModalProps> = ({
  characters,
  selectedCharacter,
  totalCoins,
  onSelectCharacter,
  onUnlockCharacter,
  onUpdatePlacard,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'runners' | 'placards'>('runners');
  const [customPlacard, setCustomPlacard] = useState('');

  const handleSelect = (char: CharacterConfig) => {
    if (!char.unlocked) {
      if (totalCoins >= char.cost) {
        const success = onUnlockCharacter(char.id, char.cost);
        if (success) {
          soundManager.playPowerUp();
          onSelectCharacter({ ...char, unlocked: true });
        }
      } else {
        soundManager.playCrash();
      }
    } else {
      soundManager.playWhoosh();
      onSelectCharacter(char);
    }
  };

  const handleApplyCustomPlacard = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPlacard.trim()) {
      onUpdatePlacard(selectedCharacter.id, customPlacard.trim().toUpperCase());
      setCustomPlacard('');
      soundManager.playPowerUp();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Drip Locker"
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
              Drip Locker & Wardrobe
            </h2>
            <p className="text-xs text-slate-400">
              Customize your runner style, unlock outfits & customize meme protest placards
            </p>
          </div>
        </div>

        {/* Coin Balance Bar */}
        <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span>Available Stash:</span>
            <span className="text-yellow-400 font-mono-numbers text-base font-bold">₹ {totalCoins}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 px-3 py-1 rounded-lg text-xs text-slate-400">
            <span>Active: </span>
            <strong className="text-slate-200">{selectedCharacter.name} ({selectedCharacter.gender === 'female' ? 'Women' : 'Men'})</strong>
          </div>
        </div>

        {/* Segmented Tab Controls */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800">
          <button
            onClick={() => setActiveTab('runners')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'runners' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Playable Runners (Women & Men)
          </button>
          <button
            onClick={() => setActiveTab('placards')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'placards' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Meme Placards Slogans
          </button>
        </div>

        {/* TAB 1: RUNNERS */}
        {activeTab === 'runners' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {characters.map(char => {
              const isSelected = selectedCharacter.id === char.id;
              const canUnlock = !char.unlocked && totalCoins >= char.cost;

              return (
                <div
                  key={char.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400/80 ring-1 ring-amber-400/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-slate-950 shadow"
                        style={{ backgroundColor: char.outfitColor }}
                      >
                        {char.gender === 'female' ? '👩' : '🏃'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{char.name}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5 py-0.5 bg-slate-800 rounded">
                            {char.gender}
                          </span>
                        </div>
                        <div className="text-xs text-amber-400">{char.role}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-slate-950">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {char.bio}
                  </p>

                  <div className="text-[11px] text-slate-400 space-y-1 mb-4 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div><strong>Outfit:</strong> {char.outfit}</div>
                    <div><strong>Hairstyle:</strong> {char.hairStyle}</div>
                    <div><strong>Placard:</strong> "{char.placardText}"</div>
                  </div>

                  <button
                    onClick={() => handleSelect(char)}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-black cursor-default'
                        : char.unlocked
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-100'
                        : canUnlock
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    {isSelected ? (
                      'EQUIPPED'
                    ) : char.unlocked ? (
                      'EQUIP RUNNER'
                    ) : canUnlock ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>UNLOCK FOR ₹{char.cost}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>LOCKED (₹{char.cost})</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: MEME PLACARDS */}
        {activeTab === 'placards' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Pick a trending Gen Z protest slogan or write your own to display on {selectedCharacter.name}’s sign during runs:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PLACARD_MEMES.map(meme => {
                const isActive = selectedCharacter.placardText === meme;
                return (
                  <button
                    key={meme}
                    onClick={() => {
                      onUpdatePlacard(selectedCharacter.id, meme);
                      soundManager.playWhoosh();
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-400 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    "{meme}"
                  </button>
                );
              })}
            </div>

            {/* Custom placard input */}
            <form onSubmit={handleApplyCustomPlacard} className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder="Write custom meme slogan (e.g. SYSTEM HANG!)..."
                value={customPlacard}
                onChange={e => setCustomPlacard(e.target.value)}
                maxLength={28}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
              >
                APPLY SLOGAN
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
