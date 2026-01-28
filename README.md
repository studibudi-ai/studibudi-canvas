# @studibudi/canvas

🎨 **Interactive whiteboard component with voice/text to AI-generated drawings**

A standalone React component that can be injected into any frontend app. Supports drawing tools, voice input, and AI-powered illustration generation.

## Features

- ✏️ **Drawing Tools** - Pen, brush, eraser, text
- 🎤 **Voice Input** - Speak your drawing prompt using Web Speech API
- ✨ **AI Generation** - Convert text to illustrations (Gemini, OpenAI, Stability AI)
- 💾 **Export** - Save drawings as PNG
- ↩️ **Undo/Redo** - Full history support
- 🎨 **Customizable** - Colors, stroke sizes, themes

## Installation

```bash
npm install @studibudi/canvas
# or
yarn add @studibudi/canvas
```

## Quick Start

```tsx
import { InteractiveBoard } from '@studibudi/canvas'

function App() {
  return (
    <InteractiveBoard
      width={800}
      height={600}
      enableVoice={true}
      aiConfig={{
        provider: 'gemini',
        apiKey: 'your-api-key',
        style: 'illustration'
      }}
      onSave={(dataUrl, state) => {
        console.log('Saved!', dataUrl)
      }}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `800` | Canvas width in pixels |
| `height` | `number` | `600` | Canvas height in pixels |
| `backgroundColor` | `string` | `#ffffff` | Canvas background color |
| `enableVoice` | `boolean` | `true` | Enable voice input |
| `aiConfig` | `AIGenerationOptions` | - | AI provider configuration |
| `onChange` | `(state) => void` | - | Callback on canvas change |
| `onSave` | `(dataUrl, state) => void` | - | Callback on save |
| `onAIGenerate` | `(image) => void` | - | Callback on AI generation |
| `initialState` | `CanvasState` | - | Restore previous state |
| `className` | `string` | - | Custom CSS class |

## AI Configuration

```tsx
aiConfig={{
  provider: 'gemini',  // 'gemini' | 'openai' | 'stability'
  apiKey: 'your-key',
  model: 'gemini-2.0-flash-exp',  // optional
  style: 'illustration'  // 'sketch' | 'illustration' | 'realistic' | 'cartoon'
}}
```

## Voice Input

Voice input uses the Web Speech API. Supported in Chrome, Edge, and Safari.

```tsx
<InteractiveBoard
  enableVoice={true}
  // User can click 🎤 and say "draw a happy cat"
/>
```

## Advanced: Custom Components

Import individual components for full customization:

```tsx
import { 
  DrawingCanvas, 
  Toolbar, 
  PromptInput,
  AIGenerator 
} from '@studibudi/canvas'
```

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build library
npm run build:lib

# Run tests
npm test
```

## License

MIT © StudiBudi
