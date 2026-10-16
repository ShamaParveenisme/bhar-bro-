import React, { useState } from 'react';
import { GAME_ICON_PATH, JANTAR_MANTAR_BG, INDIA_GATE_BG, RED_FORT_BG } from '../constants/gameData';
import { X, Download, Copy, Check, ExternalLink, CheckCircle2, Sparkles, Smartphone, ShieldAlert } from 'lucide-react';

interface UploadKitModalProps {
  onClose: () => void;
}

export const UploadKitModal: React.FC<UploadKitModalProps> = ({ onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const storeListing = {
    title: 'BRO BHAG! — The Ultimate Delhi Protest Runner',
    shortDesc: 'Sprint past barricades, dodge water cannons & wear gas masks in Delhi!',
    fullDesc: `BRO BHAG! is the fast-paced, high-energy Gen Z arcade runner inspired by the vibrant streets of New Delhi!

FEATURES:
🏃 PLAY AS WOMEN & MEN HEROES:
Choose between Kabir, Ananya, Vivaan, and Riya. Customize your drip with streetwear hoodies, cyber windbreakers, and custom funny protest placards.

🏙️ 3 ICONIC DELHI-INSPIRED DISTRICTS:
• District 1: Jantar Mantar — Narrow alleys, barricades & funny meme placards.
• District 2: India Gate Avenue — Wide boulevard sprint with speeding water cannon vehicles!
• District 3: Lal Qila Fortress — Sandstone ramparts with midnight reflex trials & dual hazards.

🛡️ TACTICAL PROTECTIVE REWARDS:
• Gas Mask / Goggles: Immunity against tear-gas clouds!
• Riot Shield: Deflect high-pressure water cannon streams!
• Cutting Chai: Matrix slow-motion reflex boost!
• Viral Magnet: Pull in all ₹ coins & rally flyers!
• Second-Chance Revive: "Bro Said Not Today" instant restart!

🔥 GEN Z MEME AUDIO & SLOGANS:
Hilarious voice lines, dynamic sound effects, and customizable placards for maximum shareability.

Free to play. No graphic violence — purely stylized comic arcade action!`,
    tags: 'delhi runner, protest chase, arcade game, meme runner, gen z, bro bhag, infinite runner, endless runner',
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Launch Kit"
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
              Pre-Upload & Launch Kit
            </h2>
            <p className="text-xs text-slate-400">
              Everything you need before uploading to Google Play Console, App Store, or Web PWA
            </p>
          </div>
        </div>

        {/* Section 1: Official App Icon & Asset Download */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Official High-Impact Game Icon</h3>
              <p className="text-xs text-slate-400">Optimized for high CTR, readability at 48px to 1024px</p>
            </div>
            <a
              href={GAME_ICON_PATH}
              download="bro_bhag_app_icon_1024.jpg"
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download Icon File</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <img
              src={GAME_ICON_PATH}
              alt="BRO BHAG! App Icon"
              className="w-32 h-32 rounded-3xl shadow-xl border border-amber-400/40 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Format:</strong> 1024 x 1024 High-Resolution JPEG / PNG</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Typography:</strong> Bold, legible "BRO BHAG!" neon title</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Expression:</strong> Humorous panic runner face matching viral meme appeal</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Platform ready:</strong> Google Play Store, iOS App Store, Web PWA Manifest</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Store Screenshots Preview */}
        <div className="mb-6">
          <h3 className="font-bold text-slate-100 text-sm mb-3">Included District Store Banners (16:9)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="group relative rounded-xl overflow-hidden border border-slate-800">
              <img src={JANTAR_MANTAR_BG} alt="Jantar Mantar" className="w-full h-24 object-cover" referrerPolicy="no-referrer" />
              <div className="p-2 bg-slate-950 text-[11px] font-bold text-slate-300 flex justify-between items-center">
                <span>District 1: Jantar Mantar</span>
                <a href={JANTAR_MANTAR_BG} download="district_1_banner.jpg" className="text-amber-400 hover:underline">Download</a>
              </div>
            </div>

            <div className="group relative rounded-xl overflow-hidden border border-slate-800">
              <img src={INDIA_GATE_BG} alt="India Gate" className="w-full h-24 object-cover" referrerPolicy="no-referrer" />
              <div className="p-2 bg-slate-950 text-[11px] font-bold text-slate-300 flex justify-between items-center">
                <span>District 2: India Gate</span>
                <a href={INDIA_GATE_BG} download="district_2_banner.jpg" className="text-amber-400 hover:underline">Download</a>
              </div>
            </div>

            <div className="group relative rounded-xl overflow-hidden border border-slate-800">
              <img src={RED_FORT_BG} alt="Lal Qila" className="w-full h-24 object-cover" referrerPolicy="no-referrer" />
              <div className="p-2 bg-slate-950 text-[11px] font-bold text-slate-300 flex justify-between items-center">
                <span>District 3: Lal Qila</span>
                <a href={RED_FORT_BG} download="district_3_banner.jpg" className="text-amber-400 hover:underline">Download</a>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Ready-to-Copy Store Metadata */}
        <div className="space-y-4 mb-6">
          <h3 className="font-bold text-slate-100 text-sm">Play Store / App Store Metadata (1-Click Copy)</h3>

          {/* Title */}
          <div>
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>App Title</span>
              <button
                onClick={() => copyToClipboard(storeListing.title, 'title')}
                className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedField === 'title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'title' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200">
              {storeListing.title}
            </div>
          </div>

          {/* Short Description */}
          <div>
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Short Description (Max 80 characters for Google Play)</span>
              <button
                onClick={() => copyToClipboard(storeListing.shortDesc, 'shortDesc')}
                className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedField === 'shortDesc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'shortDesc' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200">
              {storeListing.shortDesc}
            </div>
          </div>

          {/* Full Description */}
          <div>
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Full Store Description</span>
              <button
                onClick={() => copyToClipboard(storeListing.fullDesc, 'fullDesc')}
                className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedField === 'fullDesc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'fullDesc' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-sans text-slate-300 max-h-40 overflow-y-auto whitespace-pre-wrap">
              {storeListing.fullDesc}
            </pre>
          </div>
        </div>

        {/* Section 4: What to do before upload (Step-by-Step Guide) */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl mb-4 text-xs space-y-3">
          <h4 className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <ShieldAlert className="w-4 h-4" />
            <span>What to do before uploading to Google Play Console:</span>
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
            <li><strong>Content Rating Declaration:</strong> Declare rating as "Everyone / PEGI 3 / 10+". Specify that hazards are <em>comic arcade obstacles (water cannons & barricades) with zero graphic depictions of real injuries</em>.</li>
            <li><strong>Feature Graphic:</strong> Upload the provided District 2 (India Gate) 16:9 banner or your composite graphic at 1024 x 500 px.</li>
            <li><strong>Build Production Web / PWA or APK:</strong> Run <code>npm run build</code>. For Android APK, wrap via Capacitor or Bubblewrap (Google's official TWA tool).</li>
            <li><strong>Data Safety Section:</strong> The game runs 100% locally on the device (Web Audio API, local storage for high scores). Declare "No user data collected or shared".</li>
          </ol>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors"
        >
          CLOSE LAUNCH KIT
        </button>
      </div>
    </div>
  );
};
