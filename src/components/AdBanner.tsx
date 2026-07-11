import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Sparkles, X, Volume2, ShieldCheck, HelpCircle } from 'lucide-react';

interface AdBannerProps {
  onUpgradeClick: () => void;
}

interface MockAd {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  badge: string;
  accent: string;
}

const MOCK_ADS: MockAd[] = [
  {
    id: 'cable',
    title: 'Guitarigz Silent Gold Cable',
    subtitle: 'Noiseless Carbon-Core Coils',
    description: 'Banish 60-cycle hum forever with double copper shielding & 24k gold plugs. Built to survive stage abuse.',
    cta: 'Get 20% Off Cable',
    badge: 'SPONSORED ACCESORY',
    accent: 'border-amber-500/20 text-amber-400 bg-amber-500/5'
  },
  {
    id: 'shred',
    title: 'Guitarigz Shred Academy',
    subtitle: '6-Week Speed & Theory Bootcamp',
    description: 'Stuck in the pentatonic box? Learn advanced hybrid picking, modal sequences, and master fretboard maps.',
    cta: 'Enroll Free Today',
    badge: 'SPONSORED ACADEMY',
    accent: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5'
  },
  {
    id: 'sweetwater',
    title: 'Gear Finder Matchmaker',
    subtitle: 'Find Your Next Custom Electric',
    description: 'Instantly search top-tier luthiers, vintage solid-bodies, and boutique amps with free shipping & 55-point checks.',
    cta: 'Explore New Arrivals',
    badge: 'PARTNER DEAL',
    accent: 'border-blue-500/20 text-blue-400 bg-blue-500/5'
  },
  {
    id: 'ai-riff',
    title: 'Gemini Riff-AI Generator',
    subtitle: 'Generate Interactive Custom Backing Tracks',
    description: 'Unleash neural audio accompaniment. Tell Gemini your key, style, and tempo to synthesize immediate high-fidelity loops.',
    cta: 'Synthesize Riffs',
    badge: 'AI COMPANION',
    accent: 'border-purple-500/20 text-purple-400 bg-purple-500/5'
  }
];

export default function AdBanner({ onUpgradeClick }: AdBannerProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Rotate ads every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % MOCK_ADS.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const ad = MOCK_ADS[currentAdIndex];

  if (!isVisible) {
    return (
      <div className="bg-slate-950/30 border border-slate-850 rounded-xl p-3 flex items-center justify-between text-xs font-mono text-slate-500">
        <span>Sponsor block collapsed to preserve focus.</span>
        <button 
          onClick={onUpgradeClick}
          className="text-[10px] font-bold text-amber-450 hover:underline cursor-pointer"
        >
          Remove Ads permanently (Combined Upgrade)
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={ad.id}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className={`border rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all relative ${ad.accent}`}
      >
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-3 top-3 text-slate-500 hover:text-slate-350 cursor-pointer"
          title="Dismiss ad container (Go Premium to mute sponsor nodes)"
        >
          <X size={13} />
        </button>

        <div className="flex flex-col text-left pr-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 text-[8px] font-mono font-bold uppercase rounded tracking-wider">
              {ad.badge}
            </span>
            <span className="text-[9px] font-mono text-slate-500">• Ad-Supported Extension Mode</span>
          </div>

          <h4 className="font-display font-bold text-sm text-slate-100 flex items-center gap-1.5 leading-tight">
            <span>{ad.title}</span>
            <span className="text-slate-450 text-xs font-normal">({ad.subtitle})</span>
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {ad.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-center mt-2 md:mt-0">
          <button
            onClick={() => alert(`Redirecting to sponsor resource: "${ad.title}"! (For real ad-free use, click 'Remove Ads' inside the suite)`)}
            className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[10px] font-bold rounded-lg hover:text-slate-100 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>{ad.cta}</span>
            <ExternalLink size={10} />
          </button>

          <button
            onClick={onUpgradeClick}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/30 text-[10px] font-black text-amber-400 rounded-lg uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
          >
            <Sparkles size={10} className="fill-amber-400" />
            <span>Remove Ads</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
