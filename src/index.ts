// Main component
export { InteractiveBoard, default } from './components/InteractiveBoard'

// Sub-components (for advanced customization)
export { DrawingCanvas } from './components/DrawingCanvas'
export { Toolbar } from './components/Toolbar'
export { PromptInput } from './components/PromptInput'

// Services
export { AIGenerator } from './services/AIGenerator'

// Types
export type {
  InteractiveBoardProps,
  CanvasState,
  DrawingStroke,
  DrawingTool,
  AIProvider,
  AIGenerationOptions,
  AIGeneratedImage,
  Point,
  VoiceInputState,
  ToolbarProps,
  PromptInputProps
} from './types'
