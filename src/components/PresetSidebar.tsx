import React, { useState } from 'react';
import { Search, Star, Trash2, Save, Sparkles, Sliders } from 'lucide-react';
import { Preset, PresetCategory, PRESET_CATEGORIES } from '../types';

interface PresetSidebarProps {
  presets: Preset[];
  activePresetId: string | null;
  onSelectPreset: (preset: Preset) => void;
  onToggleFavorite: (id: string) => void;
  onSaveCurrentPreset: (name: string, category: PresetCategory) => void;
  onDeletePreset: (id: string) => void;
}

export default function PresetSidebar({
  presets,
  activePresetId,
  onSelectPreset,
  onToggleFavorite,
  onSaveCurrentPreset,
  onDeletePreset,
}: PresetSidebarProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<PresetCategory | 'All'>('All');
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetCat, setNewPresetCat] = useState<PresetCategory>('Clean');
  const [showSaveForm, setShowSaveForm] = useState(false);

  // Filter presets based on category and search query
  const filteredPresets = presets.filter((preset) => {
    const matchesSearch =
      preset.name.toLowerCase().includes(search.toLowerCase()) ||
      preset.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || preset.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) {
      alert('Please enter a name for your custom guitar rig.');
      return;
    }
    onSaveCurrentPreset(newPresetName.trim(), newPresetCat);
    setNewPresetName('');
    setShowSaveForm(false);
  };

  return (
    <div className="bg-slate-950/40 border border-slate-850 rounded-3xl p-5 flex flex-col gap-4 shadow-md h-full">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-850 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-amber-500" />
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-200">
            Tone Preset Deck
          </h3>
        </div>
        <button
          onClick={() => setShowSaveForm(!showSaveForm)}
          className="text-[10px] font-semibold bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 px-2.5 py-1.5 rounded-lg border border-amber-500/10 flex items-center gap-1 cursor-pointer"
        >
          <Save className="h-3 w-3" />
          Save Active Rig
        </button>
      </div>

      {/* Save Custom Rig Form Panel */}
      {showSaveForm && (
        <form onSubmit={handleSave} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 animate-slideDown">
          <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            Snapshot Current Pedalboard
          </h4>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="e.g. Gilmourish Comfortably Lead"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-slate-250 focus:outline-none placeholder:text-slate-500"
            />
            <div className="flex items-center gap-2">
              <select
                value={newPresetCat}
                onChange={(e) => setNewPresetCat(e.target.value as PresetCategory)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-350 focus:outline-none cursor-pointer"
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Save Rig
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 h-3.5 w-3.5" />
        <input
          type="text"
          placeholder="Search amp rigs, artists, vibes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-amber-500/80 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
        />
      </div>

      {/* Category Horizontal Slider Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-track-transparent">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wide shrink-0 transition-all cursor-pointer ${
            activeCategory === 'All'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-slate-250'
          }`}
        >
          All
        </button>
        {PRESET_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wide shrink-0 transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-slate-250'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Presets List Scrollable */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[380px] pr-1 scrollbar-thin">
        {filteredPresets.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-850 rounded-2xl flex flex-col gap-1 items-center justify-center">
            <span className="text-slate-600 text-lg">🎛️</span>
            <span className="text-xs text-slate-500 font-medium">No matching amp presets found.</span>
          </div>
        ) : (
          filteredPresets.map((preset) => {
            const isActive = preset.id === activePresetId;
            return (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`group border rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all ${
                  isActive
                    ? 'bg-amber-500/5 border-amber-500 shadow shadow-amber-500/10'
                    : 'bg-slate-900/40 border-slate-850 hover:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-wider mb-0.5">
                      {preset.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                      {preset.name}
                    </h4>
                    <p className="text-[10px] text-slate-450 leading-relaxed mt-1">
                      {preset.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Star favorite toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(preset.id);
                      }}
                      className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-amber-500 transition-colors"
                      title="Add to Favorites"
                    >
                      <Star
                        size={12}
                        className={preset.favorite ? 'fill-amber-500 text-amber-500' : 'text-slate-500'}
                      />
                    </button>

                    {/* Delete custom preset if not preset system default */}
                    {!['clean-ambient', 'srv-blues', 'heavy-metal', 'gilmour-lead', 'clean-jazz'].includes(preset.id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePreset(preset.id);
                        }}
                        className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete custom preset"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Pedals badge chain summary */}
                <div className="mt-3 flex flex-wrap gap-1 border-t border-slate-900/60 pt-2 items-center">
                  <span className="text-[8px] font-mono font-semibold text-slate-500 uppercase tracking-widest mr-1">
                    CHAIN:
                  </span>
                  {preset.effects.length === 0 ? (
                    <span className="text-[8px] font-mono text-slate-650">Empty board</span>
                  ) : (
                    preset.effects.map((fx) => (
                      <span
                        key={fx.id}
                        className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                          fx.enabled
                            ? 'bg-slate-800 text-slate-300 border border-slate-700/50'
                            : 'bg-slate-950 text-slate-600 line-through'
                        }`}
                      >
                        {fx.type.substring(0, 3).toUpperCase()}
                      </span>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
