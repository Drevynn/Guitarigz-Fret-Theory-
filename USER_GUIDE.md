# Guitarigz: Fret & Theory Studio — User Guide & Setup Manual 🎸

Welcome to **Guitarigz: Fret & Theory Studio**! This guide is designed to help you set up, navigate, troubleshoot, and integrate this interactive workstation into your custom Digital Audio Workstation (DAW) development projects (such as *Myrigz Studio*).

---

## 🚀 Quick Start: How to Get Rocking

### 1. The Fretboard Visualizer
- **Click to Play:** Simply tap or click any note node on the fretboard to pluck a simulated acoustic guitar string.
- **Visual Mapping:** Notes corresponding to your selected **Key** and **Scale** are highlighted on the fretboard. The **Root notes** of your scale feature a distinct gold highlight border.
- **Tunings:** Use the top tuning dropdown to toggle between standard tuning, drop-D, open chord tunings, or 4/5-string bass modes.

### 2. Chord Builder & CAGED Voicings
- **Chord Selection:** Use the **Progression Loops** tab or **CAGED Voicings** tab to generate beautiful chords.
- **Interactive Strumming:** Hover over chord blocks to click **"Strum"** (sounds all chord notes sequentially with dynamic, lush spacing) or **"Arpeggiate"**.
- **Voicings:** Tap any shape name (like standard moveable E-shape or A-shape barre chords) to instantly overlay fingering guides on the neck.

### 3. Fretboard Trainer (Quiz)
- Test your music theory speed! Toggle the **Fretboard Trainer** tab and answer note-recall questions to build visual memory of the fretboard.

---

## 🎙️ AI Rack Studio (Real-Time Audio Input)

*Note: Requires Premium activation (simulated via the footer link).*

1. **Activate Microphone:** In the **AI Rack Studio** tab, click **Live Input (Mic)**. Authorize the browser microphone request.
2. **Audio Interface (Recommended):** For guitars, plug a USB direct-input guitar interface (e.g., Focusrite, Behringer) into your USB port and select it as your browser default input device.
3. **Prevent Feedback:** Always wear **headphones** when routing live audio to avoid loud speaker feedback screeching.
4. **AI Tone Generator:** Type natural language requests (e.g., *"give me a warm smoky jazz tone with high delay"* or *"heavy thrash metal crunch"*) into the **AI Roadie Prompt**, and our backend Gemini model will automatically sequence delay cabinets, filters, and digital distortion parameters for you in real-time.

---

## 🔌 Connecting to Your Custom DAW (e.g., Myrigz Studio)

If you are developing a digital audio workstation (like **Myrigz Studio**) and want to use **Guitarigz** as an interactive guitar/bass visualizer instrument:

### 1. Iframe Embed
You can load the entire Guitarigz fretboard app safely inside your DAW workspace:
```html
<iframe 
  src="https://ais-pre-ws7h5dacpe6bf4xt3bdagk-186944557149.us-west1.run.app" 
  style="width: 100%; height: 680px; border: none; border-radius: 12px;"
  title="Guitarigz DAW Plugin"
></iframe>
```

### 2. Listen to MIDI Note Out (postMessage)
When a user clicks notes or strums chords inside Guitarigz, the plugin emits standard Window `postMessage` handlers you can listen to and record in your DAW sequencer:
```javascript
window.addEventListener('message', (event) => {
  const data = event.data;
  if (data.source === 'guitarigz-plugin') {
    if (data.type === 'PLUGIN_NOTE_PLAYED') {
      console.log(`[DAW Recorded Note] MIDI Pitch: ${data.midi} | Velocity: ${data.velocity}`);
      // Send note event to your DAW's internal synthesizer or drum roll!
    }
  }
});
```

### 3. Send Commands Into the Plugin (MIDI In)
Highlight notes or trigger fretboard animations from your DAW timeline sequencer:
```javascript
const iframe = document.querySelector('iframe');

function sendNoteOn(midiPitch, velocity = 127) {
  iframe.contentWindow.postMessage({
    target: 'guitarigz-plugin',
    type: 'DAW_NOTE_ON',
    midi: midiPitch,
    velocity: velocity
  }, '*');
}
```

---

## 🧩 Running as a Chrome Extension

**Guitarigz** is fully configured as a Google Chrome Extension using the latest **Manifest V3** standard! 

### How to Install it in Google Chrome:
1. **Build the extension**: Run the build process using `npm run build` to generate the production-ready `dist` folder.
2. **Open Extensions page**: In Google Chrome, navigate to `chrome://extensions/` (or click the puzzle piece icon -> **Manage Extensions**).
3. **Enable Developer Mode**: In the top-right corner of the Extensions page, toggle the **"Developer mode"** switch to **ON**.
4. **Load the Unpacked Extension**:
   - Click the **"Load unpacked"** button in the top-left corner.
   - In the file dialog, select the **`dist`** directory of this project (which contains the compiled code, `manifest.json`, and the vector `logo.svg`).
5. **Pin & Launch**:
   - Click the Extensions puzzle piece icon in Chrome, locate **Guitarigz: Fret & Theory Studio**, and click the Pin icon.
   - Click the custom Guitarigz icon to open the complete interactive guitar studio as a beautiful, high-performance browser extension popup!

---

## 🛠️ Audio Troubleshooting FAQ

### Q: Why do I hear no sound when clicking notes?
- **Interaction Needed:** Modern web browsers block web audio contexts until you click something on the screen. Click any node on the fretboard or tap **"Trigger Test Strum"** in the Help & Guide panel to awaken the Web Audio synthesis context.
- **Check Mute Button:** Ensure the volume icon in the top header is active and shows **"Sound On"**.
- **Hardware Routing:** Make sure your computer is routing audio to the correct output destination (headphones or speakers).

### Q: Why is my microphone audio screeching?
- You are experiencing acoustic feedback (sound looping from your speakers back into your microphone). **Plug in headphones** to break the feedback loop instantly!

### Q: How do I reset my custom presets?
- Select **Reset to Defaults** inside the presets list sidebar, or clear your browser local storage cache to restore factory presets.

---

*Handcrafted with care for developers and musicians alike. Get rocking!* 🤘
