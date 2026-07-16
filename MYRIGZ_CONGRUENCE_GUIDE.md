# MYRIGZ CONNECTED STUDIO — ECOSYSTEM CONGRUENCE GUIDE

This document serves as the master blueprint for the entire **MyRigz Studio Suite**. Paste these instructions directly into the **Custom Instructions** or **System Prompts** of any individual applet (**Fret & Theory**, **Guitarigz Studio**, **Hum Drumz**, or the **MyRigz SaaS DAW**) to maintain absolute technical, financial, and visual congruence across the workspace.

---

## 1. THE MYRIGZ ECOSYSTEM VISION

The MyRigz suite is a modular, federated collection of audio apps designed to operate both as **high-performance standalone tools** (such as Chrome Extensions or native web utilities) and as **tightly-integrated plugins** inside a central cloud-hosted DAW.

### The App Suite Matrix:
1. **Fret & Theory (Guitar & Bass Edition)**:
   * **Role**: Standalone, freemium fretboard and music theory learning tool.
   * **Scope**: Chord spelling, scale intervals, CAGED shapes, real-time fret visualization, and customized training quizzes.
   * **Onboarding**: Offered as a free Chrome Extension (limited daily quizzes, showing sponsors) to funnel players into paid standalone tiers or SaaS add-ons.
   * **Logo / Theme**: Brain/shield emblem containing integrated circuit boards, neon wiring, and a guitar neck (high-tech cybernetic look with script display typography).

2. **Guitarigz Studio**:
   * **Role**: Standalone **AI voice-generated FX modular rack** for electric guitar and bass players.
   * **Scope**: Custom cabinet modelers, amplifier emulation, modular effect pedals, and dynamic DSP sound processing.
   * **Synergy**: The **Paid Premium Version** comes fully pre-bundled with **Fret & Theory** integrated natively under the hood.
   * **Logo / Theme**: Bold graffiti-style typography paired with a vibrant, liquid-neon electric guitar resting on abstract landscape hills with dynamic audio-wave highlights.

3. **Hum Drumz**:
   * **Role**: Hands-free, AI voice-controlled drum machine/sequencer.
   * **Scope**: Lets players "keep both hands on the wheel" (keep jamming on the fretboard). 
   * **Voice Controls**: Integrates voice prompts to trigger tempo changes, select drum kits, start/stop patterns, and load fills completely hands-free (e.g., *"Hum Drumz, set tempo ninety BPM"*, *"start jazz shuffle"*, *"fill on measure four"*).

4. **MyRigz DAW (SaaS/SONAR)**:
   * **Role**: The central Digital Audio Workstation.
   * **Scope**: Links all standalone modules together into a unified multi-track recording canvas, allowing live audio streaming, stem import/export, and master project editing. It can also operate as a standalone SaaS multi-track editor.

---

## 2. MONETIZATION, ACCESS FLOWS, & CROSS-APP SYNERGY

Standalone Chrome Extensions (like **Fret & Theory**) act as entry points to drive high-intent users into paid modules:

* **The Free (Limited) Tier (Fret & Theory)**:
  - Ad-banners (`<AdBanner />`) are active to promote upgrading.
  - Quizzes (Fretboard Trainer) are capped at a set number of daily attempts (e.g., 3-5).
  - Advanced progressions and CAGED templates are hidden.
* **The Upgrade Screen / Extensions Store**:
  - Users can buy a **Lifetime Standalone License** (e.g., $9.99 one-time payment) to strip ads, unlock the full fretboard trainer, and access CAGED shapes.
  - Users can subscribe to **Micro-Billing Add-ons** (e.g., $0.99/month) for specific lessons and progressions (e.g., Acoustic Travis fingerstyle packs or Blues-Jazz turnaround modules).
* **Bundle Check (Guitarigz Synergies)**:
  - If a user owns the **Paid Premium Version of Guitarigz Studio**, the Fret & Theory components are unlocked automatically inside the application.

---

## 3. REAL-TIME AUDIO LINK (`postMessage` Protocol)

To let users record stems inside standalone instruments (like a guitar practice track in Guitarigz or a beat loop in Hum Drumz) and load them directly into the multi-track timeline of the active DAW, apps communicate via browser `window.parent.postMessage`.

### 3.1 The Exporter (Inside Sub-App / Iframe)
When a recording finishes, convert the resulting audio `Blob` into Base64 format and transmit it upwards:

```typescript
// Convert recording Blob to base64 and export back to parent DAW
const reader = new FileReader();
reader.readAsDataURL(audioBlob);
reader.onloadend = () => {
  const base64data = reader.result as string;
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({
      type: "sonar:import",
      audio_blob_base64: base64data,
      filename: `MyRig_Capture_${Date.now()}.webm`,
      mimetype: audioBlob.type || "audio/webm"
    }, "*");
    console.log(`[MyRigz Link] Exported stem to parent DAW via postMessage.`);
  }
};
```

### 3.2 The Importer (Inside Parent DAW / SONAR)
The host DAW registers an event listener on startup to handle these incoming audio imports. When received, the DAW loads the audio into a new audio clip on an active or selected audio track:

```typescript
useEffect(() => {
  const handleIframeMessage = (event: MessageEvent) => {
    // Validate message payload
    if (event.data && event.data.type === 'sonar:import') {
      const { audio_blob_base64, filename, mimetype } = event.data;
      console.log(`[DAW Loader] Received incoming audio stem: ${filename}`);
      
      // Convert Base64 back to a usable URL or file reference
      fetch(audio_blob_base64)
        .then(res => res.blob())
        .then(blob => {
          const audioUrl = URL.createObjectURL(blob);
          
          // Trigger your DAW's state modifier to append a new clip to the timeline
          addNewAudioClipToSelectedTrack({
            id: `clip-${Date.now()}`,
            name: filename || 'Imported Stem',
            url: audioUrl,
            duration: 4.0 // or calculate dynamic duration via AudioContext
          });
        });
    }
  };

  window.addEventListener('message', handleIframeMessage);
  return () => window.removeEventListener('message', handleIframeMessage);
}, []);
```

---

## 4. DYNAMIC ENVIRONMENT SUBDOMAIN ROUTING

To avoid hardcoded URLs when launching/pointing to iframes or links, apps must dynamically compute target URLs based on the current hostname (distinguishing development preview sandboxes from static production environments).

### Subdomain Helper:
```typescript
const getMyRigzAppUrl = (appName: 'fret-theory-bass-edition' | 'hum-drumz' | 'guitarigz-studio' | 'my-rigz-daw') => {
  if (typeof window === 'undefined') return '';
  const currentHostname = window.location.hostname;
  
  // Extract sandbox run ID (e.g. "425151855682" or similar numerical hashes)
  const match = currentHostname.match(/-(\d+)\.us-west1\.run\.app/);
  const runId = match ? match[1] : '425151855682'; // fallback fallback ID
  
  return `https://${appName}-${runId}.us-west1.run.app`;
};
```

---

## 5. VISUAL & INDUSTRIAL DESIGN LANGUAGE

All MyRigz apps must share a cohesive, tactile **Industrial Console Dark Mode** aesthetics:

* **The Palette**:
  - **Base Canvas**: Very dark carbon-gray (`#0B0F19` or `slate-950`) paired with deep metallic frame borders (`#1E293B` or `slate-800`).
  - **Aesthetic Accent 1 (Main Control)**: Warm Amber/Tangerine (`#FF5722` / `#F59E0B`). Used for active buttons, sliders, neon power states, and highlights.
  - **Aesthetic Accent 2 (Sustain/Safety)**: Emerald Green (`#00E676` / `#10B981`). Used for tempo indicators, locks, success states, and live meters.
* **The Tactile Detailing**:
  - Use high-contrast metallic borders, subtle inner shadows for audio wells, and responsive neon glow filters (`drop-shadow-amber`).
* **The Typography Pairing**:
  - **Headings & Display**: Bold, wide, modern tracking fonts like **Space Grotesk** or **Outfit**.
  - **Data, Frequencies, & Parameters**: High-contrast monospace fonts like **JetBrains Mono** or **Fira Code**.
  - **User Labels**: Keep them humble, literal, and human (e.g., *"Current Tempo"*, *"Practice Quiz"*). Avoid pseudo-intellectual telemetry logs, simulated ping states, or mock terminal lines to avoid looking like over-decorated "AI slop".
