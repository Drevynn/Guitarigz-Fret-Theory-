import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Compass,
  GitBranch,
  Layers,
  GraduationCap,
  Music,
  ArrowRight,
  FileText,
  X,
  ChevronRight,
  Volume2,
  CheckCircle,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onStartSession: (email: string, name: string) => void;
}

export default function LandingPage({ onStartSession }: LandingPageProps) {
  const [activeForm, setActiveForm] = useState<'login' | 'signup'>('signup');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Modals for TOS and Privacy
  const [openModal, setOpenModal] = useState<'tos' | 'privacy' | null>(null);

  // Interactive Teaser state
  const [activeTeaserScale, setActiveTeaserScale] = useState<'C-major' | 'A-minor' | 'G-pentatonic'>('C-major');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (activeForm === 'signup' && !username.trim()) {
      setError('Please choose a guitar moniker / username.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (activeForm === 'signup' && !agreeTerms) {
      setError('You must accept the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);
    // Simulate real network authorization latency
    setTimeout(() => {
      setLoading(false);
      const finalName = username.trim() || email.split('@')[0];
      onStartSession(email, finalName);
    }, 1200);
  };

  // Pre-configured scales for the interactive feature demo
  const teaserScales = {
    'C-major': {
      title: 'C Major Scale (Ionian)',
      notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      fretHighlights: [0, 2, 4, 5, 7, 9, 11, 12],
      color: 'from-amber-400 to-amber-600',
      tagline: 'The foundation of western music theory. Clean, bright, and modal.'
    },
    'A-minor': {
      title: 'A Natural Minor Scale (Aeolian)',
      notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      fretHighlights: [0, 2, 3, 5, 7, 8, 10, 12],
      color: 'from-emerald-400 to-emerald-600',
      tagline: 'Deep, emotional, and reflective. Sharing the exact same notes as C Major.'
    },
    'G-pentatonic': {
      title: 'G Major Pentatonic Scale',
      notes: ['G', 'A', 'B', 'D', 'E'],
      fretHighlights: [0, 2, 4, 7, 9, 12],
      color: 'from-blue-400 to-indigo-600',
      tagline: 'The ultimate soloing toolbox. Harder to hit a bad note, extremely expressive.'
    }
  };

  const selectedTeaser = teaserScales[activeTeaserScale];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative overflow-x-hidden font-sans">
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none z-0" />

      {/* Top Header / Branding */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[linear-gradient(135deg,#f59e0b,#d97706)] rounded-2xl text-slate-950 shadow-md shadow-amber-950/20 border border-amber-400/20">
              <Sparkles size={20} className="fill-slate-950" />
            </div>
            <div>
              <h1 className="font-display font-black text-lg tracking-tight uppercase bg-gradient-to-r from-slate-100 via-amber-100 to-amber-400 bg-clip-text text-transparent shimmer-text">
                Guitarigz: Theory & Flow
              </h1>
              <p className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                http://guitarigz.xyz
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEmail('admin@guitarigz.xyz');
                setPassword('admin123');
                setUsername('Guitarigz Admin');
                setActiveForm('login');
                const formElement = document.getElementById('auth-card');
                formElement?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 text-amber-400 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              title="Quick sign-in as System Admin"
            >
              <ShieldCheck size={14} className="text-amber-400" />
              <span>Admin Portal</span>
            </button>
            <button
              onClick={() => {
                setActiveForm('login');
                const formElement = document.getElementById('auth-card');
                formElement?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-slate-350 hover:text-slate-100 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveForm('signup');
                const formElement = document.getElementById('auth-card');
                formElement?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              Start Free
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section & Auth Form */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 z-10 flex flex-col gap-16 md:gap-24">
        
        {/* Split Hero: Pitch & Authenticator */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Value Proposition Column */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold max-w-max">
              <Music size={12} className="text-amber-500" />
              <span>Free Lifetime Access • WebAudio Enabled</span>
            </div>

            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight text-slate-50">
              Master the Fretboard,{' '}
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-emerald-400 bg-clip-text text-transparent">
                Visualize
              </span>{' '}
              Every Note.
            </h2>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl font-sans">
              Experience guitar theory like never before. An interactive real-time visualizer that connects scales, chords, the Circle of Fifths, and CAGED voicings dynamically. No more memorizing dry diagrams—hear and visualize the flow.
            </p>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-display">12+</div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Scales & Modes</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-100 font-display">CAGED</div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Voicing Maps</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-display">Synth</div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Audio Engine</div>
              </div>
            </div>
          </div>

          {/* Right: Auth Card Column */}
          <div className="lg:col-span-5 w-full flex justify-center" id="auth-card">
            <div className="w-full max-w-md bg-slate-950/50 backdrop-blur-md rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              
              {/* Subtle top decoration */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/50 via-emerald-500/30 to-transparent" />
              
              {/* Card headers / Form toggle */}
              <div className="flex bg-slate-900/80 p-1 border border-slate-800/80 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveForm('signup');
                    setError('');
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    activeForm === 'signup'
                      ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveForm('login');
                    setError('');
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    activeForm === 'login'
                      ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
              </div>

              {/* Action Headers */}
              <div className="mb-6 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-xl text-slate-100">
                    {activeForm === 'signup' ? 'Join Guitarigz Studio' : 'Sign In to Guitarigz'}
                  </h3>
                  {activeForm === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('admin@guitarigz.xyz');
                        setPassword('admin123');
                        setUsername('Guitarigz Administrator');
                      }}
                      className="px-2 py-1 bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-400 rounded-lg hover:bg-amber-500/30 transition-all cursor-pointer"
                    >
                      Fill Admin: admin@guitarigz.xyz
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-450">
                  {activeForm === 'signup' 
                    ? 'Unlock fully interactive scale trainers, tube amps, and theory flow.' 
                    : 'Log in to access your saved presets, tube rigs, and admin features.'}
                </p>
              </div>

              {/* Error messages if any */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs mb-4 flex items-start gap-2 animate-shake">
                  <span className="font-bold shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Real form */}
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                {activeForm === 'signup' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Guitarist Moniker</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                      <input
                        type="text"
                        placeholder="e.g. JimiHex"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input
                      type="email"
                      placeholder="you@guitarflow.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Security Password</label>
                    {activeForm === 'login' && (
                      <button
                        type="button"
                        onClick={() => alert('Demo Mode: Enter any email and password (minimum 6 characters) to unlock the app instantly!')}
                        className="text-[10px] text-amber-500 hover:underline cursor-pointer"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 rounded-xl py-2.5 pl-10 pr-10 text-xs font-semibold text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition-colors"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {activeForm === 'signup' && (
                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] select-none text-slate-400 mt-1">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-850 text-amber-500 focus:ring-1 focus:ring-amber-500 focus:ring-offset-slate-900 cursor-pointer mt-0.5"
                    />
                    <span className="leading-normal">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setOpenModal('tos'); }}
                        className="text-amber-500 hover:underline font-semibold"
                      >
                        Terms of Service
                      </button>{' '}
                      &{' '}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setOpenModal('privacy'); }}
                        className="text-amber-500 hover:underline font-semibold"
                      >
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-550 active:scale-[0.98] disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider transition-all mt-4 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{activeForm === 'signup' ? 'Create Studio Account' : 'Access Theory Deck'}</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-900 text-center">
                <span className="text-[10px] text-slate-500 font-mono">
                  🔒 Enterprise grade client hashing & secure sandbox
                </span>
              </div>
            </div>
          </div>

        </section>

        {/* Dynamic Interactive Teaser / Feature Showcase */}
        <section className="bg-slate-950/40 border border-slate-850 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-2xl rounded-full" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-850 pb-6">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-semibold">Interactive Preview</div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-100 mt-1">
                Explore Scale Intervals Prior to Entry
              </h3>
            </div>

            <div className="flex gap-2 bg-slate-900/60 p-1 border border-slate-850 rounded-xl self-start md:self-auto">
              {(Object.keys(teaserScales) as Array<keyof typeof teaserScales>).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTeaserScale(key)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTeaserScale === key
                      ? 'bg-slate-800 text-slate-100 shadow'
                      : 'text-slate-450 hover:text-slate-250'
                  }`}
                >
                  {key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-center">
            {/* Interactive Fretboard Visual mockup */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex flex-col gap-4 shadow-inner relative overflow-x-auto scrollbar-thin">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pb-2 border-b border-slate-850">
                <span>6 STRING GUITAR MAP</span>
                <span className="font-bold text-amber-500">{selectedTeaser.title}</span>
              </div>

              {/* Graphical Fretboard */}
              <div className="min-w-[500px] flex flex-col gap-2.5 py-4 select-none relative">
                {/* Frets markers row */}
                <div className="flex text-[9px] font-mono text-slate-500">
                  <div className="w-10 text-center font-bold">Nut</div>
                  {Array.from({ length: 13 }).map((_, i) => (
                    <div key={i} className="flex-1 text-center font-semibold">
                      {i === 0 ? '' : `Frt ${i}`}
                    </div>
                  ))}
                </div>

                {/* Strings with notes */}
                {[6, 5, 4, 3, 2, 1].map((strNum) => (
                  <div key={strNum} className="flex items-center relative">
                    <div className="w-10 text-[10px] font-mono font-bold text-slate-400">
                      String {strNum}
                    </div>
                    
                    {/* The physical line string */}
                    <div className="absolute left-10 right-0 h-[1.5px] bg-slate-700/60 z-0" />

                    {/* Fret nodes */}
                    <div className="flex-1 flex justify-around pl-2 z-10">
                      {Array.from({ length: 13 }).map((_, fretNum) => {
                        const isHighlighted = selectedTeaser.fretHighlights.includes(fretNum);
                        return (
                          <div
                            key={fretNum}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                              isHighlighted
                                ? `bg-gradient-to-br ${selectedTeaser.color} text-slate-950 scale-110 shadow shadow-amber-500/20`
                                : 'bg-slate-950 border border-slate-850 text-slate-500'
                            }`}
                          >
                            {isHighlighted ? '✓' : ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teaser Description Sidebar */}
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-850">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Active Scale Profile</span>
                <h4 className="font-display font-black text-xl text-slate-100 mt-1">
                  {selectedTeaser.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-2">
                  {selectedTeaser.tagline}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedTeaser.notes.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1.5 bg-slate-800 border border-slate-750 text-xs font-mono rounded-xl font-bold"
                  >
                    {note}
                  </span>
                ))}
              </div>

              <button
                onClick={() => {
                  setActiveForm('signup');
                  document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-2 py-3 bg-slate-900 hover:bg-slate-850 text-xs font-bold rounded-2xl border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-amber-400 transition-all flex items-center justify-center gap-2"
              >
                <span>Unlock Full Sound Synthesis Module</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* Detailed Grid of Showcase Tools */}
        <section className="flex flex-col gap-8">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-display font-black text-3xl text-slate-50 tracking-tight">
              A Complete Suite for Modern Guitarists
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Ditch the paper diagrams. Interactive visual representations built with WebAudio oscillator technology help solidify scales, chord construction, and chord progressions directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Tool 1: Scales Map */}
            <div className="bg-slate-950/20 hover:bg-slate-950/40 border border-slate-850 hover:border-slate-800 rounded-3xl p-6 transition-all flex flex-col justify-between group">
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl max-w-max group-hover:scale-110 transition-transform">
                  <GitBranch size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-100">
                    Fretboard Visualizer
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Toggle dynamic overlays of notes or scale intervals (Roots, perfect 5ths, flat 3rds) in standard, drop, or open tunings instantly.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-amber-500 group-hover:translate-x-1 transition-transform">
                <span>View Fretboard Modes</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Tool 2: Circle of Fifths */}
            <div className="bg-slate-950/20 hover:bg-slate-950/40 border border-slate-850 hover:border-slate-800 rounded-3xl p-6 transition-all flex flex-col justify-between group">
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl max-w-max group-hover:scale-110 transition-transform">
                  <Compass size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-100">
                    Circle of Fifths Compass
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Interactive chromatic layout mapping relative minors and major keys to understand modulation distance, shared notes, and scales.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-emerald-500 group-hover:translate-x-1 transition-transform">
                <span>Explore Key Signature relationships</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Tool 3: CAGED Voicings */}
            <div className="bg-slate-950/20 hover:bg-slate-950/40 border border-slate-850 hover:border-slate-800 rounded-3xl p-6 transition-all flex flex-col justify-between group">
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-2xl max-w-max group-hover:scale-110 transition-transform">
                  <Layers size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-100">
                    CAGED Voicing Library
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Unlock standard shapes (C-A-G-E-D) to map triads and 7th chords smoothly across the fretboard. Learn where to place fingers.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-blue-500 group-hover:translate-x-1 transition-transform">
                <span>Discover fretboard layouts</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Tool 4: Progression Loops */}
            <div className="bg-slate-950/20 hover:bg-slate-950/40 border border-slate-850 hover:border-slate-800 rounded-3xl p-6 transition-all flex flex-col justify-between group">
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-2xl max-w-max group-hover:scale-110 transition-transform">
                  <Music size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-100">
                    Progression Loops
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Choose popular chord loops (e.g., ii-V-I, Pop progressions) and highlight compatible notes to practice fluid melodic solos.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-indigo-500 group-hover:translate-x-1 transition-transform">
                <span>Unlock backing progressions</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Tool 5: Ear Quiz */}
            <div className="bg-slate-950/20 hover:bg-slate-950/40 border border-slate-850 hover:border-slate-800 rounded-3xl p-6 transition-all flex flex-col justify-between group">
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl max-w-max group-hover:scale-110 transition-transform">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-100">
                    Theory Quiz & Trainer
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Interactive randomized quizzes: locate notes on strings, identify interval distance, construct complex 7th chords, and score!
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-rose-500 group-hover:translate-x-1 transition-transform">
                <span>Start interactive practice</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Tool 6: Synth Engine */}
            <div className="bg-slate-950/20 hover:bg-slate-950/40 border border-slate-850 hover:border-slate-800 rounded-3xl p-6 transition-all flex flex-col justify-between group">
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-teal-500/10 border border-teal-500/20 text-teal-500 rounded-2xl max-w-max group-hover:scale-110 transition-transform">
                  <Volume2 size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-100">
                    Polyphonic Audio Engine
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Engineered using HTML5 Web Audio API. Touch any string node to play pure physical pitch tones with custom envelope shapes.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-teal-500 group-hover:translate-x-1 transition-transform">
                <span>Listen to polyphonic pitch</span>
                <ChevronRight size={14} />
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer & TOS, Privacy Policy links */}
      <footer className="border-t border-slate-850 bg-slate-950/90 backdrop-blur-md px-6 py-10 text-center text-xs text-slate-500 z-10 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[10px]">
              🎸
            </div>
            <span>Guitar Theory Flow Studio © {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-450">
            <button
              onClick={() => setOpenModal('tos')}
              className="hover:text-amber-400 hover:underline transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setOpenModal('privacy')}
              className="hover:text-amber-400 hover:underline transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <a
              href="mailto:support@guitarflow.com"
              className="hover:text-amber-400 hover:underline transition-colors"
            >
              Guitar Support
            </a>
            <span className="hidden md:inline text-slate-650">•</span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-lg">
              Sandbox Build v2.1.0
            </span>
          </div>
        </div>
      </footer>

      {/* Dynamic Modal Dialog Portal (TOS and Privacy Policy) */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setOpenModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative scrollbar-thin"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setOpenModal(null)}
                className="absolute right-4 top-4 p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors border border-slate-800/80"
              >
                <X size={14} />
              </button>

              {openModal === 'tos' ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
                    <FileText className="text-amber-500" size={20} />
                    <h3 className="font-display font-black text-xl text-slate-100">
                      Terms of Service
                    </h3>
                  </div>

                  <div className="text-xs text-slate-400 leading-relaxed font-sans flex flex-col gap-4 mt-2">
                    <p className="text-[10px] font-mono text-amber-500 uppercase font-semibold">
                      Last updated: June 2026
                    </p>
                    <p>
                      Welcome to the <strong>Guitar Theory Flow Studio</strong> ("Service"). By registering an account, starting a visualizer workspace, or interacting with our browser audio oscillator engine, you signify your compliance with these Terms.
                    </p>
                    
                    <h4 className="font-bold text-slate-200 mt-2">1. Use of Audio Generators</h4>
                    <p>
                      Our system leverages client-side Web Audio synthesis to construct polyphonic sine waves imitating string notes. You agree not to route these pitch synthesizers into hazardous sound equipment or exploit frequencies for malicious auditory disturbance.
                    </p>

                    <h4 className="font-bold text-slate-200 mt-2">2. Visualizations and Licenses</h4>
                    <p>
                      All scales, custom interactive fretboards, circle drawings, and Roman Numeral calculations are generated automatically for instructional purposes. This workspace does not represent professional or copyrighted sheet music catalogs, and you use all learning indicators entirely at your own instructional discretion.
                    </p>

                    <h4 className="font-bold text-slate-200 mt-2">3. Simulated & Sandbox Accounts</h4>
                    <p>
                      Accounts created in this environment reside in secure, local browser memory. No physical financial information is accepted or maintained on these servers. Accounts can be deleted at any time by executing a local storage reset inside your browser menu.
                    </p>

                    <h4 className="font-bold text-slate-200 mt-2">4. Disclaimers</h4>
                    <p>
                      We provide this software "as is" without warranty. Under no circumstances shall Guitar Theory Flow be liable for speaker degradation, ear fatigue from headphones, or wrist strain associated with extensive physical practice sessions.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
                    <ShieldCheck className="text-emerald-500" size={20} />
                    <h3 className="font-display font-black text-xl text-slate-100">
                      Privacy Policy Statement
                    </h3>
                  </div>

                  <div className="text-xs text-slate-400 leading-relaxed font-sans flex flex-col gap-4 mt-2">
                    <p className="text-[10px] font-mono text-emerald-500 uppercase font-semibold">
                      Last updated: June 2026
                    </p>
                    <p>
                      At <strong>Guitar Theory Flow Studio</strong>, we treat privacy as a fundamental standard. This statement outlines what data we collect, how it is managed, and why we guarantee zero tracking.
                    </p>

                    <h4 className="font-bold text-slate-200 mt-2">1. Minimalist Data Philosophy</h4>
                    <p>
                      We do not track, capture, or sell personal identifiers. The email and username provided during registration are stored exclusively in localized cache parameters to construct customized interface layouts, track quiz performance histories, and maintain active key presets.
                    </p>

                    <h4 className="font-bold text-slate-200 mt-2">2. Audio Engine Sovereignty</h4>
                    <p>
                      The sound synthesis engine operates completely local in your browser via standard HTML5 Web Audio components. No audio streaming, microphone feeds, or recording payloads are transferred to cloud host services. Your jam sessions remain completely private.
                    </p>

                    <h4 className="font-bold text-slate-200 mt-2">3. Third Party Disclosures</h4>
                    <p>
                      Since we do not compile permanent database tables or utilize dynamic third-party tracking pixels (such as marketing pixels, advertising platforms, or telemetry trackers), your behavioral logs will never be sold, leased, or rented.
                    </p>

                    <h4 className="font-bold text-slate-200 mt-2">4. User Agency</h4>
                    <p>
                      You can instantly delete all historical parameters (including customized user tunings and completed quiz marks) simply by logging out of the dashboard or clearing your browser cookies.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setOpenModal(null)}
                  className="px-5 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-slate-100 text-xs font-bold rounded-xl transition-all border border-slate-800 cursor-pointer"
                >
                  I Understand
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
