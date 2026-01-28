import React, { useState, useCallback, useRef } from 'react'
import { DrawingCanvas } from './DrawingCanvas'
import { Toolbar } from './Toolbar'
import { PromptInput } from './PromptInput'
import { AIGenerator } from '../services/AIGenerator'
import type { 
  InteractiveBoardProps, 
  CanvasState, 
  DrawingTool,
  DrawingStroke,
  AIGeneratedImage
} from '../types'
import './InteractiveBoard.css'

const defaultState: CanvasState = {
  strokes: [],
  aiGeneratedImages: [],
  width: 800,
  height: 600,
  backgroundColor: '#ffffff'
}

export const InteractiveBoard: React.FC<InteractiveBoardProps> = ({
  width = 800,
  height = 600,
  backgroundColor = '#ffffff',
  aiConfig,
  onChange,
  onSave,
  onAIGenerate,
  enableVoice = true,
  className = '',
  initialState
}) => {
  const [canvasState, setCanvasState] = useState<CanvasState>(
    initialState || { ...defaultState, width, height, backgroundColor }
  )
  const [activeTool, setActiveTool] = useState<DrawingTool>('pen')
  const [activeColor, setActiveColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState<CanvasState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const aiGenerator = useRef(aiConfig ? new AIGenerator(aiConfig) : null)

  const updateState = useCallback((newState: CanvasState) => {
    setCanvasState(newState)
    // Add to history for undo/redo
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newState])
    setHistoryIndex(prev => prev + 1)
    onChange?.(newState)
  }, [historyIndex, onChange])

  const handleStrokeComplete = useCallback((stroke: DrawingStroke) => {
    const newState = {
      ...canvasState,
      strokes: [...canvasState.strokes, stroke]
    }
    updateState(newState)
  }, [canvasState, updateState])

  const handlePromptSubmit = useCallback(async (prompt: string) => {
    if (!aiGenerator.current) {
      console.warn('AI generator not configured')
      return
    }

    setIsGenerating(true)
    try {
      const image = await aiGenerator.current.generate(prompt)
      const aiImage: AIGeneratedImage = {
        id: crypto.randomUUID(),
        prompt,
        imageUrl: image,
        position: { x: width / 2 - 100, y: height / 2 - 100 },
        width: 200,
        height: 200,
        timestamp: new Date()
      }
      
      const newState = {
        ...canvasState,
        aiGeneratedImages: [...canvasState.aiGeneratedImages, aiImage]
      }
      updateState(newState)
      onAIGenerate?.(aiImage)
    } catch (error) {
      console.error('AI generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [canvasState, updateState, onAIGenerate, width, height])

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setCanvasState(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      setCanvasState(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  const handleClear = useCallback(() => {
    const newState = {
      ...canvasState,
      strokes: [],
      aiGeneratedImages: []
    }
    updateState(newState)
  }, [canvasState, updateState])

  const handleSave = useCallback(() => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png')
      onSave?.(dataUrl, canvasState)
    }
  }, [canvasState, onSave])

  return (
    <div className={`studibudi-canvas-container ${className}`}>
      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        activeColor={activeColor}
        onColorChange={setActiveColor}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={setStrokeWidth}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />
      
      <DrawingCanvas
        ref={canvasRef}
        width={width}
        height={height}
        backgroundColor={backgroundColor}
        tool={activeTool}
        color={activeColor}
        strokeWidth={strokeWidth}
        strokes={canvasState.strokes}
        aiImages={canvasState.aiGeneratedImages}
        onStrokeComplete={handleStrokeComplete}
      />
      
      <PromptInput
        onSubmit={handlePromptSubmit}
        isGenerating={isGenerating}
        enableVoice={enableVoice}
      />
      
      <div className="canvas-actions">
        <button onClick={handleSave} className="save-btn">
          💾 Save
        </button>
      </div>
    </div>
  )
}

export default InteractiveBoard
