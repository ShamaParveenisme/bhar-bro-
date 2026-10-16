import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface ControlsOverlayProps {
  onLeft: () => void;
  onRight: () => void;
  onJump: () => void;
  onSlide: () => void;
}

export const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  onLeft,
  onRight,
  onJump,
  onSlide,
}) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 px-4 pointer-events-none select-none z-20 flex justify-between items-end">
      {/* Left / Right Steering Buttons */}
      <div className="flex gap-2.5 pointer-events-auto">
        <button
          onClick={onLeft}
          aria-label="Dodge Left"
          className="w-14 h-14 rounded-2xl bg-slate-900/80 active:bg-amber-500 active:text-slate-950 border border-slate-700/70 text-slate-100 flex items-center justify-center backdrop-blur-md shadow-lg transition-transform active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          onClick={onRight}
          aria-label="Dodge Right"
          className="w-14 h-14 rounded-2xl bg-slate-900/80 active:bg-amber-500 active:text-slate-950 border border-slate-700/70 text-slate-100 flex items-center justify-center backdrop-blur-md shadow-lg transition-transform active:scale-95"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Center desktop shortcut hints */}
      <div className="hidden md:flex flex-col items-center gap-1 text-slate-400 text-xs bg-slate-950/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800">
        <span>← / → Switch Lanes · ↑ Jump · ↓ Slide</span>
      </div>

      {/* Jump / Slide Action Buttons */}
      <div className="flex gap-2.5 pointer-events-auto">
        <button
          onClick={onSlide}
          aria-label="Slide Under"
          className="w-14 h-14 rounded-2xl bg-slate-900/80 active:bg-sky-500 active:text-slate-950 border border-slate-700/70 text-slate-100 flex flex-col items-center justify-center backdrop-blur-md shadow-lg transition-transform active:scale-95"
        >
          <ArrowDown className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Slide</span>
        </button>

        <button
          onClick={onJump}
          aria-label="Vault Jump"
          className="w-14 h-14 rounded-2xl bg-amber-500/90 active:bg-amber-400 text-slate-950 font-black border border-amber-400 flex flex-col items-center justify-center backdrop-blur-md shadow-xl transition-transform active:scale-95"
        >
          <ArrowUp className="w-5 h-5 stroke-[3]" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Jump</span>
        </button>
      </div>
    </div>
  );
};
