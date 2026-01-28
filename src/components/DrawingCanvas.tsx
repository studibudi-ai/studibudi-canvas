import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react'
import type { DrawingTool, DrawingStroke, Point, AIGeneratedImage } from '../types'

interface DrawingCanvasProps {
  width: number
  height: number
  backgroundColor: string
  tool: DrawingTool
  color: string
  strokeWidth: number
  strokes: DrawingStroke[]
  aiImages: AIGeneratedImage[]
  onStrokeComplete: (stroke: DrawingStroke) => void
}

export const DrawingCanvas = forwardRef<HTMLCanvasElement, DrawingCanvasProps>(({
  width,
  height,
  backgroundColor,
  tool,
  color,
  strokeWidth,
  strokes,
  aiImages,
  onStrokeComplete
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPoints, setCurrentPoints] = useState<Point[]>([])

  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement)

  // Redraw canvas when strokes or images change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear and set background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    // Draw AI-generated images
    aiImages.forEach(img => {
      const image = new Image()
      image.src = img.imageUrl
      image.onload = () => {
        ctx.drawImage(image, img.position.x, img.position.y, img.width, img.height)
      }
    })

    // Draw all strokes
    strokes.forEach(stroke => {
      drawStroke(ctx, stroke)
    })
  }, [strokes, aiImages, backgroundColor, width, height])

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: DrawingStroke) => {
    if (stroke.points.length < 2) return

    ctx.beginPath()
    ctx.strokeStyle = stroke.tool === 'eraser' ? backgroundColor : stroke.color
    ctx.lineWidth = stroke.width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
    }
    ctx.stroke()
  }

  const getPointerPosition = (e: React.PointerEvent): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (tool === 'select') return
    
    setIsDrawing(true)
    const point = getPointerPosition(e)
    setCurrentPoints([point])

    // Draw initial point
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.fillStyle = tool === 'eraser' ? backgroundColor : color
      ctx.arc(point.x, point.y, strokeWidth / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || tool === 'select') return

    const point = getPointerPosition(e)
    setCurrentPoints(prev => [...prev, point])

    // Draw line segment
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && currentPoints.length > 0) {
      const lastPoint = currentPoints[currentPoints.length - 1]
      ctx.beginPath()
      ctx.strokeStyle = tool === 'eraser' ? backgroundColor : color
      ctx.lineWidth = strokeWidth
      ctx.lineCap = 'round'
      ctx.moveTo(lastPoint.x, lastPoint.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    }
  }

  const handlePointerUp = () => {
    if (!isDrawing) return

    setIsDrawing(false)
    
    if (currentPoints.length > 0) {
      const stroke: DrawingStroke = {
        id: crypto.randomUUID(),
        points: currentPoints,
        color,
        width: strokeWidth,
        tool
      }
      onStrokeComplete(stroke)
    }
    
    setCurrentPoints([])
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="drawing-canvas"
      style={{ 
        cursor: tool === 'eraser' ? 'cell' : 'crosshair',
        touchAction: 'none'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  )
})

DrawingCanvas.displayName = 'DrawingCanvas'

export default DrawingCanvas
