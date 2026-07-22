import React, { useState, useRef } from 'react';
import { Search, Star, Trash2, Save, Sliders, Download, Upload, Copy, RotateCcw } from 'lucide-react';
import { Preset, PresetCategory, PRESET_CATEGORIES } from '../types';

interface PresetSidebarProps {
  presets: Preset[];
  activePresetId: string | null;
  onSelectPreset: (preset: Preset) => void;
  onToggleFavorite: (id: string) => void;
  onSaveCurrentPreset: (name: string, category: PresetCategory) => void;
  onDeletePreset: (id: string) => void;
  onImportPresets?: (imported: Preset[]) => void;
  onResetDefaults?: () => void;
}

export default function PresetSidebar({
  presets,
  activePresetId,
  onSelectPreset,
  onToggleFavorite,
  onSaveCurrentPreset,
  onDeletePreset,
  onImportPresets,
  onResetDefaults,
}: PresetSidebarProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<PresetCategory | 'All' | 'Favorites'>('All');
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetCat, setNewPresetCat] = useState<PresetCategory>('Blues');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter presets based on category and search query
  const filteredPresets = presets.filter((preset) => {
    const matchesSearch =
      preset.name.toLowerCase().includes(search.toLowerCase()) ||
      preset.description.toLowerCase().includes(search.toLowerCase()) ||
      preset.effects.some((e) => e.name.toLowerCase().includes(search.toLowerCase()));

    if (activeCategory === 'Favorites') {
      return matchesSearch && preset.favorite;
    }
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

  // Duplicate an existing preset
  const handleDuplicate = (e: React.MouseEvent, preset: Preset) => {
    e.stopPropagation();
    onSaveCurrentPreset(`${preset.name} (Copy)`, preset.category as PresetCategory);
  };

  // Export Presets deck as JSON
  const handleExportPresets = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(presets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `guitarigz_presets_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Presets deck from JSON
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && onImportPresets) {
          onImportPresets(parsed);
        } else {
          alert('Invalid preset JSON file structure.');
        }
      } catch (err) {
        alert('Could not parse preset JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-950/40 border border-slate-850 rounded-3xl p-5 flex flex-col gap-4 shadow-md h-full">
      {/* Title & Top Action Tools */}
      <div className="flex items-center justify-between border-b border-slate-850 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-amber-500" />
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-200">
            Genre Presets Library
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSaveForm(!showSaveForm)}
            className="text-[10px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-2.5 py-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1 cursor-pointer transition-colors"
            title="Save active pedalboard snapshot"
          >
            <Save className="h-3 w-3" />
            <span>Save Active</span>
          </button>

          <button
            onClick={handleExportPresets}
            className="p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-lg cursor-pointer transition-colors"
            title="Export Presets JSON"
          >
            <Download size={13} />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-lg cursor-pointer transition-colors"
            title="Import Presets JSON"
          >
            <Upload size={13} />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* Save Custom Rig Form Panel */}
      {showSaveForm && (
        <form onSubmit={handleSave} className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 flex flex-col gap-3 animate-slideDown shadow-lg">
          <h4 className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
            <Save size={12} />
            <span>Save Current Rig to Presets Library</span>
          </h4>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="e.g. SRV Texas Overdrive, Jazz Archtop Warmth..."
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
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                Save
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
          placeholder="Search Blues Overdrive, Clean Jazz, Metal, FX..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-amber-500/80 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
        />
      </div>

      {/* Category Horizontal Filter Slider */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-track-transparent">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wide shrink-0 transition-all cursor-pointer ${
            activeCategory === 'All'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-slate-250'
          }`}
        >
          All
        </button>

        <button
          onClick={() => setActiveCategory('Favorites')}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wide shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
            activeCategory === 'Favorites'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-amber-400'
          }`}
        >
          <Star size={10} className={activeCategory === 'Favorites' ? 'fill-slate-950' : 'fill-amber-500 text-amber-500'} />
          <span>Starred</span>
        </button>

        {PRESET_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wide shrink-0 transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-amber-500 text-slate-950 shadow-sm'
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
          <div className="text-center py-8 border border-dashed border-slate-850 rounded-2xl flex flex-col gap-2 items-center justify-center">
            <span className="text-slate-600 text-xl">🎛️</span>
            <span className="text-xs text-slate-400 font-medium">No matching presets found.</span>
            {onResetDefaults && (
              <button
                onClick={onResetDefaults}
                className="mt-1 text-[10px] font-mono text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={10} />
                <span>Reset Factory Presets</span>
              </button>
            )}
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
                    ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/40 border-slate-850 hover:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-wider">
                        {preset.category}
                      </span>
                      {isActive && (
                        <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[8px] font-mono font-bold rounded uppercase">
                          ACTIVE RIG
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                      {preset.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                      {preset.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Duplicate button */}
                    <button
                      onClick={(e) => handleDuplicate(e, preset)}
                      className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100"
                      title="Duplicate Preset"
                    >
                      <Copy size={12} />
                    </button>

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
                    {!['blues-overdrive', 'clean-jazz', 'clean-ambient', 'heavy-metal', 'funk-groove', 'acoustic-sparkle', 'gilmour-lead'].includes(preset.id) && (
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
                    PEDAL CHAIN:
                  </span>
                  {preset.effects.length === 0 ? (
                    <span className="text-[8px] font-mono text-slate-600">Empty board</span>
                  ) : (
                    preset.effects.map((fx) => (
                      <span
                        key={fx.id}
                        className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                          fx.enabled
                            ? 'bg-slate-800 text-slate-200 border border-slate-700/60'
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

