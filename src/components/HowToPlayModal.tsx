import React from 'react';
import { X, Shield, Glasses, Coffee, Magnet, AlertTriangle, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          aria-label="Close guide"
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-2">
          How to Play BRO BHAG!
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Master the Delhi street lanes, pick up protective counter-gear, and survive the chase.
        </p>

        {/* Controls Section */}
        <div className="mb-6">
          <h3 className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-2">
            Movement Controls
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="flex gap-1 text-slate-400">
                <ArrowLeft className="w-4 h-4" />
                <ArrowRight className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-100">Switch Lanes</strong>
                <p className="text-[11px] text-slate-400">Left / Right Arrows or Swipe</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
              <ArrowUp className="w-4 h-4 text-amber-400" />
              <div>
                <strong className="text-slate-100">Vault Jump</strong>
                <p className="text-[11px] text-slate-400">Up Arrow / Space / Swipe Up</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
              <ArrowDown className="w-4 h-4 text-sky-400" />
              <div>
                <strong className="text-slate-100">Skid Slide</strong>
                <p className="text-[11px] text-slate-400">Down Arrow or Swipe Down</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
              <span className="text-yellow-400 font-bold font-mono">₹</span>
              <div>
                <strong className="text-slate-100">Gather Coins</strong>
                <p className="text-[11px] text-slate-400">Unlock Drip & Revives</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hazards vs Protective Rewards */}
        <div className="mb-6">
          <h3 className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-2">
            Hazards & Protective Rewards
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                  💧
                </div>
                <div>
                  <strong className="text-slate-200">Water Cannon Jet</strong>
                  <p className="text-[11px] text-slate-400">Heavy water spray knocks you back.</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sky-300 font-bold">
                <Shield className="w-4 h-4" />
                <span>Riot Shield Blocks</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-lime-500/20 text-lime-400 flex items-center justify-center font-bold">
                  💨
                </div>
                <div>
                  <strong className="text-slate-200">Tear Gas Cloud</strong>
                  <p className="text-[11px] text-slate-400">Blinds vision and slows runner.</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                <Glasses className="w-4 h-4" />
                <span>Goggles / Mask Safe</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  🚧
                </div>
                <div>
                  <strong className="text-slate-200">Police Barricades</strong>
                  <p className="text-[11px] text-slate-400">High steel barricades & roadblocks.</p>
                </div>
              </div>
              <div className="text-amber-400 font-bold">
                <span>Jump or Dodge Lanes</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-500 flex items-center justify-center font-bold">
                  ☕
                </div>
                <div>
                  <strong className="text-slate-200">Cutting Chai Boost</strong>
                  <p className="text-[11px] text-slate-400">Matrix slow-motion reflex time + 2x score!</p>
                </div>
              </div>
              <div className="text-amber-300 font-bold">
                <span>Power-up</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-colors"
        >
          GOT IT! LET'S RUN
        </button>
      </div>
    </div>
  );
};
