import React, { useState } from 'react'
import { InteractiveBoard } from '../index'
import type { CanvasState, AIGeneratedImage } from '../types'

export const DemoApp: React.FC = () => {
  const [savedImages, setSavedImages] = useState<string[]>([])

  const handleSave = (dataUrl: string, _state: CanvasState) => {
    setSavedImages(prev => [...prev, dataUrl])
    console.log('Canvas saved!')
  }

  const handleAIGenerate = (image: AIGeneratedImage) => {
    console.log('AI Generated:', image.prompt)
  }

  return (
    <div style={{ width: '100%', maxWidth: '900px' }}>
      <InteractiveBoard
        width={800}
        height={500}
        backgroundColor="#ffffff"
        enableVoice={true}
        aiConfig={{
          provider: 'gemini',
          apiKey: import.meta.env.VITE_GEMINI_API_KEY,
          style: 'illustration'
        }}
        onSave={handleSave}
        onAIGenerate={handleAIGenerate}
        onChange={(state) => console.log('Strokes:', state.strokes.length)}
      />

      {savedImages.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ color: '#fff', marginBottom: 10 }}>Saved Images</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {savedImages.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt={`Saved ${i + 1}`}
                style={{ 
                  width: 150, 
                  height: 100, 
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: '2px solid #333'
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 30, color: '#888', fontSize: 14 }}>
        <p>💡 <strong>Tips:</strong></p>
        <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
          <li>Use the toolbar to switch between pen, brush, and eraser</li>
          <li>Click the 🎤 button for voice input (say what you want to draw)</li>
          <li>Type a description and click "Generate" for AI illustrations</li>
          <li>Press Save to export your drawing</li>
        </ul>
      </div>
    </div>
  )
}

export default DemoApp
