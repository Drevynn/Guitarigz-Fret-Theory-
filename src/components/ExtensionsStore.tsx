import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  BookOpen, 
  ShoppingBag, 
  X,
  ArrowRight,
  Sparkle,
  BookmarkCheck,
  Percent
} from 'lucide-react';

interface ExtensionsStoreProps {
  hasGuitarStandalone: boolean;
  onBuyGuitarStandalone: () => void;
  onRefundGuitarStandalone: () => void;
  activeSubscriptions: string[];
  onToggleSubscription: (subId: string) => void;
  userName?: string;
  theme: any;
}

interface StoreItem {
  id: string;
  name: string;
  category: 'standalone' | 'subscription';
  priceLabel: string;
  priceNum: number;
  type: 'one-time' | 'monthly';
  description: string;
  lessonsDescription: string;
  features: string[];
  badge: string;
  badgeAccent: string;
  icon: string;
}

export default function ExtensionsStore({
  hasGuitarStandalone,
  onBuyGuitarStandalone,
  onRefundGuitarStandalone,
  activeSubscriptions,
  onToggleSubscription,
  userName = 'Guitarist',
  theme
}: ExtensionsStoreProps) {
  const [activeItemToCheckout, setActiveItemToCheckout] = useState<StoreItem | null>(null);
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('08/29');
  const [cvv, setCvv] = useState('999');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const STORE_ITEMS: StoreItem[] = [
    {
      id: 'standalone_lessons',
      name: 'Guitar Fret & Lessons Standalone',
      category: 'standalone',
      priceLabel: '$9.99',
      priceNum: 9.99,
      type: 'one-time',
      description: 'Acquire just the lessons, scales, chords, and metronome training elements of the extension. Ad-free, lifetime access without sound effects.',
      lessonsDescription: 'Unlocks unlimited Fretboard Trainer Quiz attempts, CAGED builder overlays, and hides all sponsored ad-banners forever.',
      features: [
        'Ad-free Chord Progressions & Fifths Wheel',
        'Unlimited Fretboard Trainer Quiz attempts',
        'Complete CAGED shapes & custom voicings',
        'Direct Standalone Chrome Extension Key'
      ],
      badge: 'STANDALONE BUY',
      badgeAccent: 'bg-emerald-505/10 border-emerald-500/20 text-emerald-400',
      icon: '🎸'
    },
    {
      id: 'addon_acoustic',
      name: 'Acoustic Folk Fingerstyle Pack',
      category: 'subscription',
      priceLabel: '$0.99 / mo',
      priceNum: 0.99,
      type: 'monthly',
      description: 'Folk fingerpicking, Travis styles, and open acoustic campfire movements. Unlocks beautiful rustic chord progressions in the Flow dashboard.',
      lessonsDescription: 'Adds "Travis Fingerstyle (I-V-vi-iii-IV-I-IV-V) 🍂" and "Rustic Folk Progression (vi-IV-I-V) 🌾" into your Chord Progressions list.',
      features: [
        'Interactive Travis Picking progression lessons',
        'Rustic Folk open-chord transition models',
        'Acoustic guitar spelling guides',
        'Micro-billing price: just 99¢/mo'
      ],
      badge: 'LESSONS ADD-ON',
      badgeAccent: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      icon: '🍂'
    },
    {
      id: 'addon_blues_jazz',
      name: 'Blues & Jazz Soloing Pack',
      category: 'subscription',
      priceLabel: '$0.99 / mo',
      priceNum: 0.99,
      type: 'monthly',
      description: 'Sophisticated minor turnarounds, jazzy voice-leadings, and slow blues walks. Ideal for mastering chord substitutions.',
      lessonsDescription: 'Adds "Smooth Jazz Satin Turnaround (ii7-V7-Imaj7-VI7) 🎷" and "Slow Blues Club Walk (I7-IV7-V7-I7) 🎸" into your Chord Progressions list.',
      features: [
        'Smooth Jazz Satin Turnaround progression',
        '16-Bar Slow Blues walking sequence',
        'Seventh-chord substitution spelling charts',
        'Micro-billing price: just 99¢/mo'
      ],
      badge: 'LESSONS ADD-ON',
      badgeAccent: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      icon: '🎷'
    }
  ];

  const handleCheckoutClick = (item: StoreItem) => {
    setActiveItemToCheckout(item);
    setShowSuccess(false);
  };

  const handleAutofill = () => {
    setCardNumber('4111 2222 3333 4444');
    setExpiry('05/30');
    setCvv('111');
  };

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItemToCheckout) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      
      // Update real states
      if (activeItemToCheckout.id === 'standalone_lessons') {
        onBuyGuitarStandalone();
      } else {
        // Toggle on if not subscribed
        if (!activeSubscriptions.includes(activeItemToCheckout.id)) {
          onToggleSubscription(activeItemToCheckout.id);
        }
      }
    }, 1800);
  };

  const handleCancelSubscriptionInStore = (itemId: string) => {
    onToggleSubscription(itemId);
  };

  const handleRefundStandaloneInStore = () => {
    onRefundGuitarStandalone();
  };

  return (
    <div className="bg-slate-950/20 border border-slate-850 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl mt-6">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              MyRigz Storefront
            </span>
            <span className="text-[10px] font-mono text-slate-500">• Direct Extension Modules</span>
          </div>
          <h3 className="font-display font-black text-xl text-slate-100 tracking-tight mt-1 uppercase">
            Modular Extensions & Add-on Lessons
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Need just the lessons part? Want to expand your chord palettes with micro-billing? Buy standalone learning parts or add cheap, 99¢/mo lesson content directly inside your extension with zero high-cost bundles!
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/50 border border-slate-800 rounded-xl text-[10px] font-mono text-slate-450 self-start md:self-auto shadow-inner">
          <ShieldCheck size={12} className="text-emerald-400 shrink-0" />
          <span>Active Subscriptions: <strong className="text-slate-200">{activeSubscriptions.length}</strong></span>
        </div>
      </div>

      {/* Grid of options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STORE_ITEMS.map((item) => {
          const isPurchased = item.id === 'standalone_lessons' 
            ? hasGuitarStandalone 
            : activeSubscriptions.includes(item.id);

          return (
            <div 
              key={item.id}
              className={`bg-slate-900/40 hover:bg-slate-900/70 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                isPurchased 
                  ? 'border-amber-500/40 shadow-lg shadow-amber-500/2' 
                  : 'border-slate-850 hover:border-slate-750'
              }`}
            >
              {/* Product background glow if active */}
              {isPurchased && (
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 blur-xl rounded-full" />
              )}

              <div>
                {/* Header row */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-850 mb-4">
                  <span className={`px-2 py-0.5 border text-[8px] font-mono font-bold rounded uppercase ${item.badgeAccent}`}>
                    {item.badge}
                  </span>
                  <span className="text-xl">{item.icon}</span>
                </div>

                <h4 className="font-display font-black text-sm text-slate-100 leading-tight">
                  {item.name}
                </h4>
                
                <div className="flex items-baseline gap-1 mt-2 mb-3">
                  <span className="text-2xl font-black text-amber-500 font-mono">{item.priceLabel}</span>
                  <span className="text-[10px] text-slate-500 font-mono lowercase">
                    {item.type === 'monthly' ? 'monthly sub' : 'one-time life'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                  {item.description}
                </p>

                {/* Integration Details card */}
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850/60 mb-4 text-[11px] text-slate-400 leading-normal">
                  <strong className="text-slate-300 font-bold block mb-1">🎯 Integration Status:</strong>
                  {item.lessonsDescription}
                </div>

                {/* Checklist */}
                <div className="flex flex-col gap-2 mt-2 mb-6">
                  {item.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[10px] text-slate-450">
                      <Check size={11} className="text-amber-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action trigger button */}
              <div>
                {isPurchased ? (
                  <div className="flex flex-col gap-2">
                    <div className="w-full py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold font-mono rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 select-none">
                      <BookmarkCheck size={12} />
                      <span>Active & Fully Loaded</span>
                    </div>
                    {item.id === 'standalone_lessons' ? (
                      <button
                        onClick={handleRefundStandaloneInStore}
                        className="text-[9px] text-slate-500 hover:text-red-400 hover:underline font-mono cursor-pointer transition-all text-center self-center"
                        title="Simulate refunding standalone purchase"
                      >
                        [Simulate Refund / Lock]
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCancelSubscriptionInStore(item.id)}
                        className="text-[9px] text-slate-500 hover:text-red-400 hover:underline font-mono cursor-pointer transition-all text-center self-center"
                        title="Unsubscribe from this lessons pack"
                      >
                        [Cancel 99¢ Sub]
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleCheckoutClick(item)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/30 text-slate-200 hover:text-amber-400 text-xs font-black rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                  >
                    <ShoppingBag size={12} />
                    <span>Get {item.id === 'standalone_lessons' ? 'Lessons Standalone' : 'Add-on Pack'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Stripe Sandbox Checkout Portal Modal */}
      <AnimatePresence>
        {activeItemToCheckout && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md relative shadow-2xl overflow-hidden"
            >
              {/* Decorative glows inside checkout */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none" />

              {/* Close button */}
              <button 
                onClick={() => setActiveItemToCheckout(null)}
                className="absolute right-4 top-4 p-1 rounded-lg text-slate-550 hover:text-slate-300 hover:bg-slate-850 cursor-pointer transition-all"
              >
                <X size={16} />
              </button>

              <AnimatePresence mode="wait">
                {!showSuccess ? (
                  <motion.div
                    key="checkout-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <ShoppingBag size={18} className="text-amber-500" />
                      <h4 className="font-display font-black text-base text-slate-100 uppercase tracking-wide">
                        MyRigz Direct Checkout
                      </h4>
                    </div>

                    {/* Summary card */}
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 mb-5 text-left flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Selected Item</span>
                        <strong className="text-xs text-slate-200 block">{activeItemToCheckout.name}</strong>
                        <span className="text-[10px] text-slate-450 mt-0.5 block line-clamp-1">{activeItemToCheckout.description}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Price</span>
                        <strong className="text-base text-amber-450 font-mono font-black">{activeItemToCheckout.priceLabel}</strong>
                      </div>
                    </div>

                    {/* Credit Card layout */}
                    <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-850 rounded-xl p-4 mb-5 text-left shadow-inner relative flex flex-col justify-between h-36">
                      <div className="flex justify-between items-center">
                        <div className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[8px] font-mono text-amber-400 rounded">
                          MyRigz Secure SDK
                        </div>
                        <CreditCard size={14} className="text-slate-550" />
                      </div>

                      <div className="font-mono text-sm tracking-widest text-slate-200 mt-2">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>

                      <div className="flex justify-between items-end mt-2">
                        <div className="flex flex-col">
                          <span className="text-[7px] font-mono text-slate-600 uppercase tracking-wider">Cardholder</span>
                          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase mt-0.5">{userName}</span>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex flex-col text-right">
                            <span className="text-[7px] font-mono text-slate-600 uppercase tracking-wider">Expiry</span>
                            <span className="text-[10px] font-bold text-slate-400 font-mono mt-0.5">{expiry}</span>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-[7px] font-mono text-slate-600 uppercase tracking-wider">CVV</span>
                            <span className="text-[10px] font-bold text-slate-400 font-mono mt-0.5">{cvv}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-5 px-1">
                      <span className="text-[10px] text-slate-550 font-mono">Sandbox Environment</span>
                      <button 
                        onClick={handleAutofill}
                        className="text-[10px] text-amber-500 hover:underline font-mono cursor-pointer"
                      >
                        ⚡ Autofill Mock Card
                      </button>
                    </div>

                    {/* Interactive Form */}
                    <form onSubmit={handleConfirmPurchase} className="flex flex-col gap-3.5">
                      <div className="flex flex-col gap-1 text-left">
                        <label className="text-[9px] font-mono text-slate-500 uppercase">Card Number</label>
                        <input 
                          type="text" 
                          required 
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 focus:border-amber-500 focus:outline-none rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-left">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-mono text-slate-500 uppercase">Expiry Date</label>
                          <input 
                            type="text" 
                            required 
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-slate-950 border border-slate-850 focus:border-amber-500 focus:outline-none rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-mono text-slate-500 uppercase">Security CVV</label>
                          <input 
                            type="text" 
                            required 
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="123"
                            className="w-full bg-slate-950 border border-slate-850 focus:border-amber-500 focus:outline-none rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-550 active:scale-[0.98] disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider transition-all mt-2 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>Processing sandbox payment...</span>
                          </div>
                        ) : (
                          <>
                            <span>Confirm & Authorize {activeItemToCheckout.priceLabel}</span>
                            <ArrowRight size={12} />
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-550 font-mono mt-1">
                        <Lock size={9} />
                        <span>Direct Micro-Billing SDK • Secure Encryption</span>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="checkout-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center py-6"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5 animate-bounce">
                      <CheckCircle2 size={30} />
                    </div>

                    <h4 className="font-display font-black text-lg text-slate-100 uppercase tracking-wide">
                      Purchase Succeeded!
                    </h4>
                    <p className="text-[10px] text-amber-500 font-mono uppercase tracking-widest font-bold mt-1">
                      Module Successfully Activated
                    </p>

                    <p className="text-xs text-slate-400 leading-relaxed mt-4 max-w-xs">
                      Excellent choice, <strong>{userName}</strong>! The module is now bound to your account. Your lessons list, quiz permissions, and dashboard settings are updated live.
                    </p>

                    {/* Invoice box */}
                    <div className="bg-slate-950/60 rounded-xl p-3 w-full border border-slate-850 mt-5 text-left text-[11px] text-slate-400 font-sans flex flex-col gap-1.5">
                      <div className="flex justify-between border-b border-slate-850 pb-1.5">
                        <span>Invoice:</span>
                        <span className="font-mono text-[9px] text-slate-500 font-bold">INV-RIGZ-{Math.floor(Math.random() * 800000 + 100000)}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-850 pb-1.5">
                        <span>Module Name:</span>
                        <span className="text-slate-200 font-bold">{activeItemToCheckout?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paid Sandbox Status:</span>
                        <span className="text-emerald-400 font-bold">Authorized & Active</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveItemToCheckout(null)}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-350 hover:to-teal-450 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider transition-all mt-6 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10"
                    >
                      <span>Return to Suite</span>
                      <Sparkles size={12} className="fill-slate-950" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
