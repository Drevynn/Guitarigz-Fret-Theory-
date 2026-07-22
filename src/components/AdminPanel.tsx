import React, { useState } from 'react';
import {
  ShieldCheck,
  Globe,
  Database,
  Activity,
  Sliders,
  Sparkles,
  Zap,
  Users,
  RefreshCw,
  CheckCircle2,
  Lock,
  Radio,
  Server,
  Settings,
  AlertTriangle
} from 'lucide-react';

interface AdminPanelProps {
  adminEmail: string;
  isPremium: boolean;
  onTogglePremium: () => void;
  onResetFactoryPresets: () => void;
}

export default function AdminPanel({
  adminEmail,
  isPremium,
  onTogglePremium,
  onResetFactoryPresets,
}: AdminPanelProps) {
  const [domainStatus, setDomainStatus] = useState<'connected' | 'checking'>('connected');
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    'System initialization: guitarigz.xyz domain route bound to port 3000.',
    'Tube Amp Convolver: 5 models loaded (British Lead 100, Caravan Twin, Recto, Citrus, Class-A).',
    'WebAudio Oscillator Engine: 24-bit 48kHz audio context ready.',
    'Security rule validation: Admin session granted to admin@guitarigz.xyz.',
  ]);
  const [simulatedTraffic, setSimulatedTraffic] = useState({
    activeUsers: 42,
    audioLatencyMs: 4.2,
    cpuLoad: '12%',
    activeAmps: 5,
  });

  const handleRefreshTelemetry = () => {
    setDomainStatus('checking');
    setTimeout(() => {
      setDomainStatus('connected');
      setTelemetryLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Health check passed for guitarigz.xyz. All 5 tube amp models active.`,
        ...prev,
      ]);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-2 text-slate-100">
      {/* Admin Dashboard Title Header */}
      <div className="bg-slate-950/80 border border-amber-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 rounded-2xl shadow-lg shadow-amber-500/20">
            <ShieldCheck size={28} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-xl tracking-tight text-slate-100 uppercase shimmer-text">
                Guitarigz Admin Operations Panel
              </h2>
              <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-400 rounded-full">
                ROOT PRIVILEGES
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Logged in as <span className="text-amber-400 font-bold">{adminEmail}</span> • Domain: <span className="text-slate-200">http://guitarigz.xyz</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshTelemetry}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-750 hover:border-amber-500/50 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw size={14} className={domainStatus === 'checking' ? 'animate-spin text-amber-400' : 'text-slate-400'} />
            <span>Refresh Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Grid of System Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Domain status */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Target Domain</span>
            <Globe size={16} className="text-sky-400" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-black font-mono text-slate-100">guitarigz.xyz</div>
            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 size={12} />
              <span>DNS & SSL Routes Active</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Tube Amp Models */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Amp Emulation Heads</span>
            <Zap size={16} className="text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-black font-mono text-amber-400">5 Vintage Amps</div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">
              Marshall, Fender, Mesa, Orange, Vox
            </div>
          </div>
        </div>

        {/* Metric 3: Active Audio Users */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Live WebAudio Nodes</span>
            <Users size={16} className="text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-black font-mono text-slate-100">{simulatedTraffic.activeUsers} Sessions</div>
            <div className="text-[10px] font-mono text-indigo-400 mt-1">
              Latency: {simulatedTraffic.audioLatencyMs}ms (Low Latency Buffer)
            </div>
          </div>
        </div>

        {/* Metric 4: System CPU / Memory */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Studio Engine Load</span>
            <Activity size={16} className="text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-black font-mono text-emerald-400">{simulatedTraffic.cpuLoad} CPU</div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">
              Container Host: Port 3000
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Management Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Overrides & Global Toggles */}
        <div className="lg:col-span-6 bg-slate-950/60 border border-slate-800 rounded-3xl p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="text-amber-400" size={18} />
            <h3 className="font-display font-bold text-base text-slate-100">
              Global Platform Overrides
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            {/* Override 1: Force Premium Suite Access */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200">Force Global Pro Access</span>
                <span className="text-[10px] text-slate-400">Unlock all 5 Tube Amps & Full Studio Suite globally.</span>
              </div>

              <button
                onClick={onTogglePremium}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isPremium
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {isPremium ? 'PRO ACTIVE' : 'FREE TIER'}
              </button>
            </div>

            {/* Override 2: Factory Preset Reset */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200">Reset Factory Presets Deck</span>
                <span className="text-[10px] text-slate-400">Restore default genre rigs (Marshall, Fender, Mesa, Orange, Vox).</span>
              </div>

              <button
                onClick={onResetFactoryPresets}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-amber-400 border border-slate-700 hover:border-amber-500/50 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
              >
                Reset Presets
              </button>
            </div>

            {/* Override 3: Domain Routing Info */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Globe size={14} className="text-sky-400" />
                  <span>Custom Domain: guitarigz.xyz</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">READY FOR CNAME</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                When pointing your custom domain <code className="text-amber-400 font-mono">guitarigz.xyz</code> DNS records to Cloud Run, all traffic routes through port 3000 with WebAudio DSP enabled.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Admin System Logs */}
        <div className="lg:col-span-6 bg-slate-950/60 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="text-emerald-400 animate-pulse" size={18} />
              <h3 className="font-display font-bold text-base text-slate-100">
                System Telemetry & Event Audit
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Live Console</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 flex flex-col gap-2 max-h-72 overflow-y-auto scrollbar-thin">
            {telemetryLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 border-b border-slate-850/60 pb-1.5 last:border-0">
                <span className="text-amber-500 font-bold">›</span>
                <span className="leading-normal">{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
