export interface Point {
  x: number
  y: number
}

export interface DrawingStroke {
  id: string
  points: Point[]
  color: string
  width: number
  tool: DrawingTool
}

export type DrawingTool = 'pen' | 'brush' | 'eraser' | 'select' | 'text'

export type AIProvider = 'gemini' | 'openai' | 'stability'

export interface AIGenerationOptions {
  provider: AIProvider
  apiKey?: string
  model?: string
  style?: 'sketch' | 'illustration' | 'realistic' | 'cartoon'
}

export interface CanvasState {
  strokes: DrawingStroke[]
  aiGeneratedImages: AIGeneratedImage[]
  width: number
  height: number
  backgroundColor: string
}

export interface AIGeneratedImage {
  id: string
  prompt: string
  imageUrl: string
  position: Point
  width: number
  height: number
  timestamp: Date
}

export interface VoiceInputState {
  isListening: boolean
  transcript: string
  error: string | null
}

export interface InteractiveBoardProps {
  /** Width of the canvas */
  width?: number
  /** Height of the canvas */
  height?: number
  /** Background color */
  backgroundColor?: string
  /** AI provider configuration */
  aiConfig?: AIGenerationOptions
  /** Callback when canvas state changes */
  onChange?: (state: CanvasState) => void
  /** Callback when user saves/exports */
  onSave?: (dataUrl: string, state: CanvasState) => void
  /** Callback when AI generates an image */
  onAIGenerate?: (image: AIGeneratedImage) => void
  /** Enable voice input */
  enableVoice?: boolean
  /** Custom class name */
  className?: string
  /** Initial canvas state to restore */
  initialState?: CanvasState
}

export interface ToolbarProps {
  activeTool: DrawingTool
  onToolChange: (tool: DrawingTool) => void
  activeColor: string
  onColorChange: (color: string) => void
  strokeWidth: number
  onStrokeWidthChange: (width: number) => void
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
  canUndo: boolean
  canRedo: boolean
}

export interface PromptInputProps {
  onSubmit: (prompt: string) => void
  isGenerating: boolean
  enableVoice: boolean
}
