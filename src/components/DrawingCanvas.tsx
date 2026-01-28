import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react'
import * as fabric from 'fabric'
import type { DrawingTool, AIGeneratedImage } from '../types'

interface DrawingCanvasProps {
  width: number
  height: number
  backgroundColor: string
  tool: DrawingTool
  color: string
  strokeWidth: number
  aiImages: AIGeneratedImage[]
  onReady?: (canvas: fabric.Canvas) => void
}

export interface DrawingCanvasHandle {
  canvas: fabric.Canvas | null
  toDataURL: () => string
  clear: () => void
  undo: () => void
  redo: () => void
}

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(({
  width,
  height,
  backgroundColor,
  tool,
  color,
  strokeWidth,
  aiImages,
  onReady
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const isDrawingRef = useRef(false)

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor,
      isDrawingMode: true,
      selection: false
    })

    // Configure brush
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
    canvas.freeDrawingBrush.color = color
    canvas.freeDrawingBrush.width = strokeWidth

    // Save initial state
    const initialState = JSON.stringify(canvas.toJSON())
    setHistory([initialState])
    setHistoryIndex(0)

    // Listen for path creation
    canvas.on('path:created', () => {
      saveState(canvas)
    })

    fabricRef.current = canvas
    onReady?.(canvas)

    return () => {
      canvas.dispose()
      fabricRef.current = null
    }
  }, [])

  // Update brush settings
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    if (tool === 'eraser') {
      canvas.isDrawingMode = true
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
      canvas.freeDrawingBrush.color = backgroundColor
      canvas.freeDrawingBrush.width = strokeWidth * 3
    } else if (tool === 'pen' || tool === 'brush') {
      canvas.isDrawingMode = true
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
      canvas.freeDrawingBrush.color = color
      canvas.freeDrawingBrush.width = tool === 'brush' ? strokeWidth * 2 : strokeWidth
    } else if (tool === 'select') {
      canvas.isDrawingMode = false
      canvas.selection = true
    }
  }, [tool, color, strokeWidth, backgroundColor])

  // Add AI images to canvas
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas || aiImages.length === 0) return

    const lastImage = aiImages[aiImages.length - 1]
    
    fabric.FabricImage.fromURL(lastImage.imageUrl).then((img) => {
      img.set({
        left: lastImage.position.x,
        top: lastImage.position.y,
        scaleX: lastImage.width / (img.width || 200),
        scaleY: lastImage.height / (img.height || 200),
        selectable: true
      })
      canvas.add(img)
      canvas.renderAll()
      saveState(canvas)
    })
  }, [aiImages.length])

  const saveState = (canvas: fabric.Canvas) => {
    const json = JSON.stringify(canvas.toJSON())
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      return [...newHistory, json]
    })
    setHistoryIndex(prev => prev + 1)
  }

  const undo = () => {
    const canvas = fabricRef.current
    if (!canvas || historyIndex <= 0) return

    const newIndex = historyIndex - 1
    canvas.loadFromJSON(history[newIndex]).then(() => {
      canvas.renderAll()
      setHistoryIndex(newIndex)
    })
  }

  const redo = () => {
    const canvas = fabricRef.current
    if (!canvas || historyIndex >= history.length - 1) return

    const newIndex = historyIndex + 1
    canvas.loadFromJSON(history[newIndex]).then(() => {
      canvas.renderAll()
      setHistoryIndex(newIndex)
    })
  }

  const clear = () => {
    const canvas = fabricRef.current
    if (!canvas) return

    canvas.clear()
    canvas.backgroundColor = backgroundColor
    canvas.renderAll()
    saveState(canvas)
  }

  const toDataURL = () => {
    return fabricRef.current?.toDataURL({ format: 'png' }) || ''
  }

  useImperativeHandle(ref, () => ({
    canvas: fabricRef.current,
    toDataURL,
    clear,
    undo,
    redo
  }))

  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} />
    </div>
  )
})

DrawingCanvas.displayName = 'DrawingCanvas'

export default DrawingCanvas
