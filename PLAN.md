# StudiBudi Canvas - Detailed Development Plan

## 🎯 Project Vision

An injectable React component that provides an interactive whiteboard with voice/text input that converts to AI-generated drawings and illustrations. Designed for educational use in StudiBudi.

---

## 🔍 Market Research

### Similar Projects

| Project | Stars | Description | Pros | Cons |
|---------|-------|-------------|------|------|
| **[tldraw](https://github.com/tldraw/tldraw)** | 40k+ | Infinite canvas SDK | Full-featured, great UX, real-time collab | Complex, watermark on free tier |
| **[Excalidraw](https://github.com/excalidraw/excalidraw)** | 95k+ | Hand-drawn diagrams | Beautiful sketchy style, open source | Heavy bundle, no AI integration |
| **[Fabric.js](https://github.com/fabricjs/fabric.js)** | 30k+ | Canvas library | Mature, object model, SVG support | Lower-level, no React bindings |
| **[React Konva](https://github.com/konvajs/react-konva)** | 6k+ | React canvas bindings | Declarative, React-native feel | Limited drawing tools OOB |

### AI Generation APIs

| Provider | Model | Speed | Quality | Cost |
|----------|-------|-------|---------|------|
| **Google Gemini** | gemini-2.0-flash-exp | ⚡ Fast | ⭐⭐⭐⭐ | Free tier available |
| **fal.ai** | FLUX, SD3, etc. | ⚡⚡ Very Fast | ⭐⭐⭐⭐⭐ | Pay per image |
| **OpenAI** | DALL-E 3 | 🐢 Slower | ⭐⭐⭐⭐⭐ | $0.04-0.08/image |
| **Stability AI** | SDXL | ⚡ Fast | ⭐⭐⭐⭐ | Pay per image |
| **Replicate** | Various | ⚡ Fast | ⭐⭐⭐⭐ | Pay per second |

### Voice Input Technologies

| Technology | Browser Support | Accuracy | Offline |
|------------|-----------------|----------|---------|
| **Web Speech API** | Chrome, Safari, Edge | ⭐⭐⭐⭐ | ❌ |
| **Whisper (local)** | All (WASM) | ⭐⭐⭐⭐⭐ | ✅ |
| **Deepgram** | All (API) | ⭐⭐⭐⭐⭐ | ❌ |
| **AssemblyAI** | All (API) | ⭐⭐⭐⭐⭐ | ❌ |

---

## 🏗️ Architecture

### Recommended Stack

```
┌─────────────────────────────────────────────────────────┐
│                    StudiBudi Canvas                      │
├─────────────────────────────────────────────────────────┤
│  UI Layer                                                │
│  ├── React 18/19                                        │
│  ├── TypeScript                                         │
│  └── CSS Modules / Tailwind                             │
├─────────────────────────────────────────────────────────┤
│  Canvas Engine (choose one)                             │
│  ├── Option A: Fabric.js (recommended)                  │
│  │   └── Mature, object model, good for drawings        │
│  ├── Option B: React Konva                              │
│  │   └── React-native, declarative                      │
│  └── Option C: tldraw SDK                               │
│      └── Full features but heavier                      │
├─────────────────────────────────────────────────────────┤
│  AI Layer                                               │
│  ├── Primary: fal.ai (fastest, best quality)            │
│  ├── Fallback: Gemini 2.0 Flash                         │
│  └── Optional: DALL-E 3, Stability AI                   │
├─────────────────────────────────────────────────────────┤
│  Voice Layer                                            │
│  ├── Primary: Web Speech API (free, built-in)           │
│  └── Premium: Whisper API / Deepgram                    │
├─────────────────────────────────────────────────────────┤
│  Build & Package                                        │
│  ├── Vite (build)                                       │
│  ├── Vitest (testing)                                   │
│  └── npm package (@studibudi/canvas)                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Feature Roadmap

### Phase 1: Core Drawing (Week 1-2)
- [ ] Canvas setup with Fabric.js
- [ ] Basic drawing tools (pen, brush, eraser)
- [ ] Color picker and stroke width
- [ ] Undo/redo history
- [ ] Export to PNG/SVG
- [ ] Touch/stylus support
- [ ] Unit tests for core components

### Phase 2: Voice Input (Week 2-3)
- [ ] Web Speech API integration
- [ ] Real-time transcription display
- [ ] Voice command detection ("draw", "erase", "clear")
- [ ] Multi-language support (Arabic, English)
- [ ] Microphone permission handling
- [ ] Fallback for unsupported browsers

### Phase 3: AI Generation (Week 3-4)
- [ ] fal.ai integration (primary)
- [ ] Gemini 2.0 Flash integration (fallback)
- [ ] Prompt enhancement for better results
- [ ] Style presets (sketch, illustration, cartoon, realistic)
- [ ] Loading states and progress
- [ ] Error handling and retry logic
- [ ] Image placement and resizing on canvas

### Phase 4: Advanced Features (Week 4-5)
- [ ] Text tool with fonts
- [ ] Shape tools (rectangle, circle, arrow)
- [ ] Layers support
- [ ] Zoom and pan
- [ ] Grid/snap options
- [ ] Keyboard shortcuts
- [ ] Selection and transform tools

### Phase 5: Education Features (Week 5-6)
- [ ] Guided drawing mode (step-by-step)
- [ ] Drawing templates
- [ ] Sticker library
- [ ] Collaborative drawing (WebSocket)
- [ ] Teacher annotation tools
- [ ] Drawing replay/playback

### Phase 6: Polish & Package (Week 6-7)
- [ ] Performance optimization
- [ ] Bundle size reduction
- [ ] Documentation
- [ ] Storybook components
- [ ] npm publish
- [ ] Demo site

---

## 🛠️ Recommended Technologies

### Canvas Engine: **Fabric.js**
```bash
npm install fabric
```
**Why:** Object model, mature, great for manipulation, supports SVG import/export

### AI Generation: **fal.ai**
```bash
npm install @fal-ai/client
```
**Why:** Fastest inference, multiple models, competitive pricing

### Voice: **Web Speech API** (built-in) + **Whisper** (premium)
```typescript
// Free, built-in
const recognition = new webkitSpeechRecognition()

// Premium option
npm install @xenova/transformers  // Whisper in browser
```

### State Management: **Zustand** (lightweight)
```bash
npm install zustand
```

### Testing: **Vitest + Testing Library**
```bash
npm install -D vitest @testing-library/react
```

---

## 📦 Package Structure

```
@studibudi/canvas/
├── dist/                      # Build output
├── src/
│   ├── components/
│   │   ├── InteractiveBoard.tsx      # Main component
│   │   ├── Canvas/
│   │   │   ├── DrawingCanvas.tsx     # Fabric.js wrapper
│   │   │   ├── CanvasToolbar.tsx     # Tools UI
│   │   │   └── CanvasLayers.tsx      # Layer panel
│   │   ├── Voice/
│   │   │   ├── VoiceInput.tsx        # Mic button
│   │   │   ├── TranscriptDisplay.tsx # Live text
│   │   │   └── useVoice.ts           # Voice hook
│   │   ├── AI/
│   │   │   ├── PromptInput.tsx       # Text input
│   │   │   ├── StyleSelector.tsx     # Art styles
│   │   │   ├── GenerationPreview.tsx # Loading/result
│   │   │   └── useAIGeneration.ts    # AI hook
│   │   └── common/
│   │       ├── ColorPicker.tsx
│   │       ├── Slider.tsx
│   │       └── Modal.tsx
│   ├── services/
│   │   ├── AIGenerator.ts            # AI API calls
│   │   ├── VoiceRecognition.ts       # Voice handling
│   │   └── CanvasHistory.ts          # Undo/redo
│   ├── hooks/
│   │   ├── useCanvas.ts
│   │   ├── useVoice.ts
│   │   └── useAI.ts
│   ├── stores/
│   │   └── canvasStore.ts            # Zustand store
│   ├── types/
│   │   └── index.ts
│   ├── styles/
│   │   └── themes/
│   └── index.ts                      # Exports
├── stories/                          # Storybook
├── tests/
├── package.json
└── README.md
```

---

## 🎨 Props API Design

```typescript
interface InteractiveBoardProps {
  // Dimensions
  width?: number
  height?: number
  
  // Appearance
  theme?: 'light' | 'dark' | 'auto'
  backgroundColor?: string
  className?: string
  
  // Features toggles
  enableVoice?: boolean
  enableAI?: boolean
  enableLayers?: boolean
  enableCollaboration?: boolean
  
  // AI Configuration
  aiConfig?: {
    provider: 'fal' | 'gemini' | 'openai' | 'stability'
    apiKey?: string
    proxyUrl?: string  // For hiding API keys
    defaultStyle?: 'sketch' | 'illustration' | 'realistic' | 'cartoon'
    maxGenerations?: number
  }
  
  // Voice Configuration
  voiceConfig?: {
    language?: string  // 'en-US', 'ar-SA'
    continuous?: boolean
    commands?: Record<string, () => void>
  }
  
  // Toolbar Configuration
  toolbar?: {
    position?: 'top' | 'left' | 'right' | 'bottom' | 'floating'
    tools?: DrawingTool[]
    colors?: string[]
  }
  
  // Callbacks
  onChange?: (state: CanvasState) => void
  onSave?: (data: ExportData) => void
  onAIGenerate?: (result: AIGenerationResult) => void
  onVoiceInput?: (transcript: string) => void
  onError?: (error: CanvasError) => void
  
  // Initial state
  initialState?: CanvasState
  
  // Localization
  locale?: 'en' | 'ar'
  customStrings?: Record<string, string>
}
```

---

## 🔐 API Key Security

For production, use a proxy to hide API keys:

```typescript
// Client-side
<InteractiveBoard
  aiConfig={{
    provider: 'fal',
    proxyUrl: '/api/ai/generate'  // Your backend
  }}
/>

// Server-side (Next.js example)
// pages/api/ai/generate.ts
import { fal } from '@fal-ai/client'

export default async function handler(req, res) {
  fal.config({ credentials: process.env.FAL_KEY })
  const result = await fal.run(req.body.model, req.body.input)
  res.json(result)
}
```

---

## 📊 Success Metrics

- [ ] Bundle size < 100KB (gzipped)
- [ ] First paint < 500ms
- [ ] AI generation < 3s
- [ ] Voice recognition accuracy > 90%
- [ ] Test coverage > 80%
- [ ] Lighthouse score > 90

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/studibudi-ai/studibudi-canvas.git
cd studibudi-canvas

# Install
npm install

# Develop
npm run dev

# Test
npm test

# Build library
npm run build:lib

# Publish
npm publish
```

---

## 📅 Timeline

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1-2 | Core Drawing | Canvas, tools, history, export |
| 2-3 | Voice Input | Speech recognition, commands |
| 3-4 | AI Generation | fal.ai, Gemini, styles |
| 4-5 | Advanced | Shapes, layers, zoom |
| 5-6 | Education | Templates, collab |
| 6-7 | Polish | Docs, tests, publish |

---

## 🔗 Resources

- [Fabric.js Docs](http://fabricjs.com/docs/)
- [fal.ai Models](https://fal.ai/models)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [tldraw Examples](https://tldraw.dev)
- [Excalidraw Libraries](https://libraries.excalidraw.com)
