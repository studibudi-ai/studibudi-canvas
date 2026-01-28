import React, { useState, useCallback, useRef } from 'react'
import { DrawingCanvas, DrawingCanvasHandle } from './DrawingCanvas'
import { Toolbar } from './Toolbar'
import { PromptInput } from './PromptInput'
import type { 
  InteractiveBoardProps, 
  CanvasState, 
  DrawingTool,
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
  height = 500,
  backgroundColor = '#ffffff',
  aiConfig,
  onChange,
  onSave,
  onAIGenerate,
  enableVoice = true,
  className = ''
}) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    ...defaultState, 
    width, 
    height, 
    backgroundColor
  })
  const [activeTool, setActiveTool] = useState<DrawingTool>('pen')
  const [activeColor, setActiveColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const canvasRef = useRef<DrawingCanvasHandle>(null)

  const handlePromptSubmit = useCallback(async (prompt: string) => {
    if (!aiConfig?.apiKey) {
      console.warn('AI not configured - showing placeholder')
      // For demo, add a placeholder colored rectangle
      const aiImage: AIGeneratedImage = {
        id: crypto.randomUUID(),
        prompt,
        imageUrl: createPlaceholderImage(prompt),
        position: { x: width / 2 - 100, y: height / 2 - 75 },
        width: 200,
        height: 150,
        timestamp: new Date()
      }
      
      setCanvasState(prev => ({
        ...prev,
        aiGeneratedImages: [...prev.aiGeneratedImages, aiImage]
      }))
      onAIGenerate?.(aiImage)
      return
    }

    setIsGenerating(true)
    try {
      const imageUrl = await generateWithAI(prompt, aiConfig)
      const aiImage: AIGeneratedImage = {
        id: crypto.randomUUID(),
        prompt,
        imageUrl,
        position: { x: width / 2 - 100, y: height / 2 - 100 },
        width: 200,
        height: 200,
        timestamp: new Date()
      }
      
      setCanvasState(prev => ({
        ...prev,
        aiGeneratedImages: [...prev.aiGeneratedImages, aiImage]
      }))
      onAIGenerate?.(aiImage)
    } catch (error) {
      console.error('AI generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [aiConfig, width, height, onAIGenerate])

  const handleUndo = useCallback(() => {
    canvasRef.current?.undo()
  }, [])

  const handleRedo = useCallback(() => {
    canvasRef.current?.redo()
  }, [])

  const handleClear = useCallback(() => {
    canvasRef.current?.clear()
    setCanvasState(prev => ({
      ...prev,
      strokes: [],
      aiGeneratedImages: []
    }))
  }, [])

  const handleSave = useCallback(() => {
    const dataUrl = canvasRef.current?.toDataURL() || ''
    onSave?.(dataUrl, canvasState)
    
    // Also trigger download
    const link = document.createElement('a')
    link.download = `studibudi-canvas-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  }, [canvasState, onSave])

  return (
    <div className={`studibudi-canvas-container ${className}`}>
      <div className="canvas-header">
        <h2>🎨 StudiBudi Canvas</h2>
        <span className="canvas-subtitle">Draw or describe what you want!</span>
      </div>
      
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
        canUndo={true}
        canRedo={true}
      />
      
      <DrawingCanvas
        ref={canvasRef}
        width={width}
        height={height}
        backgroundColor={backgroundColor}
        tool={activeTool}
        color={activeColor}
        strokeWidth={strokeWidth}
        aiImages={canvasState.aiGeneratedImages}
      />
      
      <PromptInput
        onSubmit={handlePromptSubmit}
        isGenerating={isGenerating}
        enableVoice={enableVoice}
      />
      
      <div className="canvas-actions">
        <button onClick={handleSave} className="save-btn">
          💾 Save Drawing
        </button>
      </div>
    </div>
  )
}

// Placeholder image generator for demo
function createPlaceholderImage(prompt: string): string {
  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 150
  const ctx = canvas.getContext('2d')!
  
  // Random gradient background
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#a29bfe']
  const color1 = colors[Math.floor(Math.random() * colors.length)]
  const color2 = colors[Math.floor(Math.random() * colors.length)]
  
  const gradient = ctx.createLinearGradient(0, 0, 200, 150)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(1, color2)
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 200, 150)
  
  // Add text
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'center'
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 4
  
  const words = prompt.split(' ').slice(0, 4).join(' ')
  ctx.fillText(words.length > 20 ? words.slice(0, 20) + '...' : words, 100, 75)
  ctx.font = '10px Arial'
  ctx.fillText('🤖 AI Placeholder', 100, 95)
  
  return canvas.toDataURL('image/png')
}

// AI generation function
async function generateWithAI(prompt: string, config: NonNullable<InteractiveBoardProps['aiConfig']>): Promise<string> {
  const { provider, apiKey, style = 'illustration' } = config
  
  const styledPrompt = `${prompt}. Style: ${style}, white background, centered.`
  
  if (provider === 'gemini') {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate an image: ${styledPrompt}` }] }],
          generationConfig: { responseModalities: ['image', 'text'] }
        })
      }
    )
    
    const data = await response.json()
    const imagePart = data.candidates?.[0]?.content?.parts?.find(
      (p: any) => p.inlineData?.mimeType?.startsWith('image/')
    )
    
    if (imagePart?.inlineData) {
      return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`
    }
  }
  
  throw new Error('AI generation failed')
}

export default InteractiveBoard
