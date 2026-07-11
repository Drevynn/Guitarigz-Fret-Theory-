import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI client with key from process.env
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API: AI Roadie tone generator proxy
app.post('/api/ai/generate-tone', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Please supply a sound description prompt.' });
      return;
    }

    const systemInstruction = `You are an expert guitar tech, recording engineer, and professional rig designer. 
Your task is to take a guitarist's description of a target sound, vibe, song, or artist, and design a customized guitar pedalboard rig.
You have 12 specific pedals at your disposal, each with precise parameter bounds:
1. "distortion": parameters: ["Gain" (0-100, default 65), "Tone" (0-100, default 50)]
2. "overdrive": parameters: ["Drive" (0-100, default 45), "Tone" (0-100, default 60)]
3. "delay": parameters: ["Time" (50-1500, default 350, unit "ms"), "Feedback" (0-100, default 40), "Mix" (0-100, default 35)]
4. "reverb": parameters: ["Size" (0-100, default 75), "Decay" (0-100, default 60), "Mix" (0-100, default 40)]
5. "chorus": parameters: ["Rate" (0-100, default 35), "Depth" (0-100, default 50), "Mix" (0-100, default 45)]
6. "flanger": parameters: ["Rate" (0-100, default 25), "Depth" (0-100, default 55), "Feedback" (0-100, default 40)]
7. "phaser": parameters: ["Rate" (0-100, default 30)]
8. "compressor": parameters: ["Threshold" (0-100, default 40, unit "dB"), "Ratio" (1-20, default 4, unit ":1"), "Attack" (1-100, default 10, unit "ms"), "Release" (10-1000, default 100, unit "ms")]
9. "eq": parameters: ["Low" (0-100, default 55), "Mid" (0-100, default 45), "High" (0-100, default 60), "Presence" (0-100, default 50)]
10. "tremolo": parameters: ["Rate" (0-100, default 40), "Depth" (0-100, default 60)]
11. "wah": parameters: ["Position" (0-100, default 30), "Range" (0-100, default 70)]
12. "octave": parameters: ["Octave Down" (0-100, default 50)]

Instructions:
- Select between 1 and 4 pedals that best synthesize the requested sound. Arrange them in a sensible studio guitar signal chain sequence (e.g. compressor/wah -> overdrive/distortion -> chorus/phaser -> delay/reverb).
- Set parameters (value, min, max, unit) matching the boundaries above exactly.
- Provide a creative, descriptive presetName and a brief personal message explanation about your rig design and how to jam on it.`;

    // Call Gemini using the recommended model and strict JSON responseSchema
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Design a pedalboard rig for: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['presetName', 'message', 'effects'],
          properties: {
            presetName: {
              type: Type.STRING,
              description: 'A creative title for this custom guitar preset rig.',
            },
            message: {
              type: Type.STRING,
              description: 'An enthusiastic guitar roadie message describing the rig, settings, and performance tips.',
            },
            effects: {
              type: Type.ARRAY,
              description: 'The series chain of guitar pedals designed for the rig.',
              items: {
                type: Type.OBJECT,
                required: ['id', 'type', 'name', 'enabled', 'dryWet', 'parameters'],
                properties: {
                  id: {
                    type: Type.STRING,
                    description: 'A unique string id for the pedal, e.g. "distortion-123"',
                  },
                  type: {
                    type: Type.STRING,
                    description: 'The exact type of the pedal matching one of the 12 available types.',
                  },
                  name: {
                    type: Type.STRING,
                    description: 'A custom branded name for the pedal, e.g. "Plexi Crunch" or "Celestial Echoes"',
                  },
                  enabled: {
                    type: Type.BOOLEAN,
                    description: 'Whether the pedal starts active (should always be true).',
                  },
                  dryWet: {
                    type: Type.INTEGER,
                    description: 'The dry/wet blend level (0 to 100).',
                  },
                  parameters: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ['name', 'value', 'min', 'max'],
                      properties: {
                        name: { type: Type.STRING },
                        value: { type: Type.NUMBER },
                        min: { type: Type.NUMBER },
                        max: { type: Type.NUMBER },
                        unit: { type: Type.STRING },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Gemini tone generator error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate guitar tone.' });
  }
});

// Configure Vite or Production static files serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Guitarigz Fret & Theory server running on port ${PORT}`);
  });
}

setupServer();
