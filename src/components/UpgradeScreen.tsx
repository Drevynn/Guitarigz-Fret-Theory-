import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Lock, 
  CreditCard, 
  Tv, 
  Sliders, 
  Zap, 
  Volume2, 
  CheckCircle2, 
  Trash2,
  ExternalLink
} from 'lucide-react';

interface UpgradeScreenProps {
  onUpgradeComplete: () => void;
  userName?: string;
}

export default function UpgradeScreen({ onUpgradeComplete, userName = 'Guitarist' }: UpgradeScreenProps) {
  const [step, setStep] = useState<'pitch' | 'checkout' | 'success'>('pitch');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardName, setCardName] = useState(userName.toUpperCase());
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('369');
  const [loading, setLoading] = useState(false);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate high-fidelity processing payment
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 2000);
  };

  const handleAutofill = () => {
    setCardNumber('5412 7512 3456 7890');
    setCardName(userName.toUpperCase());
    setExpiry('09/29');
    setCvv('415');
  };

  return (
    <div className="bg-slate-950/40 border border-slate-850 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/5 blur-[80px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 'pitch' && (
          <motion.div
            key="pitch"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left side: Feature Selling pitch */}
            <div className="lg:col-span-7 flex flex-col gap-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold max-w-max">
                <Sparkles size={12} className="fill-amber-500" />
                <span>Premium Expansion Suite Upgrade</span>
              </div>

              <h3 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight text-slate-100">
                Upgrade to <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent">Guitarigz: Fret & Theory</span>
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-450 leading-relaxed font-sans">
                You are currently running the free <strong>Fret & Theory Chrome Extension</strong> which includes all the core scales, chord layouts, circle of fifths, and quiz elements with ad sponsorships.
              </p>
              
              <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-sans">
                Unlock the ultimate <strong>Guitarigz Combined Suite</strong> to merge your fretboard learning with our live-synthesized AI effects studio, completely hide ads, and gain high-fidelity direct access to the audio processing workspace.
              </p>

              {/* Comparison Matrix */}
              <div className="flex flex-col gap-2.5 mt-4">
                <div className="grid grid-cols-12 gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-900">
                  <div className="col-span-6">Workspace Capabilities</div>
                  <div className="col-span-3 text-center">Free Extension</div>
                  <div className="col-span-3 text-center text-amber-400 font-bold">Guitarigz Combined</div>
                </div>

                <div className="grid grid-cols-12 gap-2 text-xs py-1.5 border-b border-slate-900/60 items-center">
                  <div className="col-span-6 text-slate-300">Scales, Chords & Fifths Wheel</div>
                  <div className="col-span-3 text-slate-450 text-center font-mono">Yes</div>
                  <div className="col-span-3 text-amber-400 font-bold text-center font-mono">Yes</div>
                </div>

                <div className="grid grid-cols-12 gap-2 text-xs py-1.5 border-b border-slate-900/60 items-center">
                  <div className="col-span-6 text-slate-300">Fretboard Trainer Quiz</div>
                  <div className="col-span-3 text-slate-450 text-center font-mono">Ad-supported</div>
                  <div className="col-span-3 text-amber-400 font-bold text-center font-mono">Unlimited</div>
                </div>

                <div className="grid grid-cols-12 gap-2 text-xs py-1.5 border-b border-slate-900/60 items-center">
                  <div className="col-span-6 text-slate-300">Live Guitar / Mic Effects (AI Rack)</div>
                  <div className="col-span-3 text-red-500/80 text-center font-mono">Locked 🔒</div>
                  <div className="col-span-3 text-emerald-400 font-bold text-center font-mono">Unlocked ⚡</div>
                </div>

                <div className="grid grid-cols-12 gap-2 text-xs py-1.5 border-b border-slate-900/60 items-center">
                  <div className="col-span-6 text-slate-300">Ad-Supported Placement</div>
                  <div className="col-span-3 text-slate-450 text-center font-mono">Yes</div>
                  <div className="col-span-3 text-emerald-400 font-bold text-center font-mono">Ad-Free (Clean)</div>
                </div>

                <div className="grid grid-cols-12 gap-2 text-xs py-1.5 items-center">
                  <div className="col-span-6 text-slate-300">Custom Tone Saving with Gemini AI</div>
                  <div className="col-span-3 text-red-500/80 text-center font-mono">Locked 🔒</div>
                  <div className="col-span-3 text-amber-400 font-bold text-center font-mono">Unlimited</div>
                </div>
              </div>
            </div>

            {/* Right side: Upsell CTA Card */}
            <div className="lg:col-span-5 w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between self-stretch relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 bg-amber-500/10 text-amber-400 text-[10px] font-mono rounded-bl-xl font-bold uppercase border-l border-b border-slate-800">
                1-Time payment
              </div>

              <div className="flex flex-col gap-4">
                <div className="text-slate-450 text-[11px] font-mono uppercase tracking-widest mt-2">Combined Offer</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black font-display text-slate-50">$29</span>
                  <span className="text-xs text-slate-500 font-mono">lifetime access</span>
                  <span className="text-xs line-through text-slate-600 font-mono ml-2">$79 value</span>
                </div>

                <div className="flex flex-col gap-2.5 mt-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-amber-500 shrink-0" />
                    <span>Includes high-fidelity AI Rack Studio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-amber-500 shrink-0" />
                    <span>Instant activation across devices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-amber-500 shrink-0" />
                    <span>Supports future expansion packs free</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-550 active:scale-[0.98] text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
                >
                  <span>Purchase Combined Suite</span>
                  <ArrowRight size={14} />
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
                  <Lock size={10} />
                  <span>Secure checkout • Powered by Stripe</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col max-w-xl mx-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-amber-500" size={20} />
                <h4 className="font-display font-bold text-lg text-slate-100">Secure Direct Checkout</h4>
              </div>
              <button 
                onClick={() => setStep('pitch')} 
                disabled={loading}
                className="text-xs text-slate-500 hover:text-slate-350 cursor-pointer disabled:opacity-50"
              >
                Back
              </button>
            </div>

            {/* Simulated credit card graphics */}
            <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 border border-amber-500/20 p-5 shadow-2xl relative flex flex-col justify-between mb-6 overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-amber-500/40 font-bold uppercase tracking-widest">
                Guitarigz Premium
              </div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-7 rounded bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-mono text-[9px] text-amber-400 font-bold">
                  CHIP
                </div>
                <CreditCard className="text-slate-500" size={20} />
              </div>

              <div className="font-mono text-lg tracking-widest text-slate-200 text-left my-2">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>

              <div className="flex justify-between items-end">
                <div className="flex flex-col text-left">
                  <span className="text-[8px] font-mono text-slate-650 uppercase tracking-widest leading-none">Cardholder</span>
                  <span className="text-xs font-bold text-slate-350 font-mono uppercase mt-0.5">{cardName || 'YOUR NAME'}</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col text-right">
                    <span className="text-[8px] font-mono text-slate-650 uppercase tracking-widest leading-none">Expires</span>
                    <span className="text-xs font-bold text-slate-350 font-mono mt-0.5">{expiry || 'MM/YY'}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[8px] font-mono text-slate-650 uppercase tracking-widest leading-none">CVV</span>
                    <span className="text-xs font-bold text-slate-350 font-mono mt-0.5">{cvv || '•••'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick helper controls */}
            <div className="flex justify-between items-center mb-6 px-1">
              <span className="text-[10px] text-slate-500 font-mono">Demo Checkout Mode</span>
              <button 
                type="button"
                onClick={handleAutofill}
                className="text-[10px] text-amber-500 hover:underline font-mono cursor-pointer"
              >
                ⚡ Auto-fill Test Card Details
              </button>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Card Number</label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="w-full bg-slate-900 border border-slate-850 hover:border-slate-750 focus:border-amber-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Expiration Date</label>
                  <input
                    type="text"
                    required
                    disabled={loading}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full bg-slate-900 border border-slate-850 hover:border-slate-750 focus:border-amber-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Security CVV</label>
                  <input
                    type="text"
                    required
                    disabled={loading}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    className="w-full bg-slate-900 border border-slate-850 hover:border-slate-750 focus:border-amber-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-550 active:scale-[0.98] disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider transition-all mt-3 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Sandbox Charge...</span>
                  </div>
                ) : (
                  <>
                    <span>Confirm & Pay $29.00</span>
                    <Lock size={12} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20 }}
            className="flex flex-col items-center justify-center py-8 text-center max-w-md mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle2 size={36} />
            </div>

            <h3 className="font-display font-black text-2xl text-slate-100">
              Payment Confirmed!
            </h3>
            <p className="text-xs text-amber-400 font-mono uppercase tracking-widest font-bold mt-1">
              Welcome to Guitarigz Combined Suite
            </p>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-4 font-sans">
              Thank you, <strong>{userName}</strong>! Your free Fret & Theory extension has successfully expanded into the unified <strong>Guitarigz Combined Pro Suite</strong>.
            </p>

            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 w-full my-6 text-left text-xs text-slate-300 font-sans flex flex-col gap-2 shadow-inner">
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-mono text-[10px] text-slate-400 font-bold">INV-RIGZ-{Math.floor(Math.random() * 900000 + 100000)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-500">Service:</span>
                <span className="text-slate-200">Fret & Theory (Combined)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-400 font-bold">Lifetime Paid • Ad-free</span>
              </div>
            </div>

            <button
              onClick={onUpgradeComplete}
              className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-350 hover:to-teal-450 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <span>Unlock AI Effects Rack Now</span>
              <Sparkles size={14} className="fill-slate-950" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
