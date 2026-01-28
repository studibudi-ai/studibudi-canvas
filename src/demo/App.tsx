import React, { useState } from 'react'
import { InteractiveBoard } from '../index'
import type { CanvasState, AIGeneratedImage } from '../types'

export const DemoApp: React.FC = () => {
  const [savedImages, setSavedImages] = useState<string[]>([])
  const [lastPrompt, setLastPrompt] = useState<string>('')

  const handleSave = (dataUrl: string, _state: CanvasState) => {
    setSavedImages(prev => [dataUrl, ...prev].slice(0, 5))
    console.log('✅ Canvas saved!')
  }

  const handleAIGenerate = (image: AIGeneratedImage) => {
    setLastPrompt(image.prompt)
    console.log('🎨 Generated:', image.prompt)
  }

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <InteractiveBoard
        width={850}
        height={500}
        backgroundColor="#ffffff"
        enableVoice={true}
        aiConfig={{
          provider: 'gemini',
          apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
          style: 'illustration'
        }}
        onSave={handleSave}
        onAIGenerate={handleAIGenerate}
      />

      {lastPrompt && (
        <div style={{ 
          marginTop: 16, 
          padding: '12px 16px',
          background: 'rgba(233, 69, 96, 0.1)',
          borderRadius: 8,
          color: '#e94560',
          fontSize: 14
        }}>
          🤖 Last prompt: "{lastPrompt}"
        </div>
      )}

      {savedImages.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ 
            color: '#fff', 
            marginBottom: 12,
            fontSize: 16,
            fontWeight: 500
          }}>
            💾 Saved Drawings ({savedImages.length})
          </h3>
          <div style={{ 
            display: 'flex', 
            gap: 12, 
            flexWrap: 'wrap' 
          }}>
            {savedImages.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt={`Saved ${i + 1}`}
                style={{ 
                  width: 160, 
                  height: 100, 
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: '2px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer'
                }}
                onClick={() => window.open(img, '_blank')}
              />
            ))}
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: 32, 
        padding: 20,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        color: '#888', 
        fontSize: 14,
        lineHeight: 1.8
      }}>
        <p style={{ color: '#fff', fontWeight: 600, marginBottom: 8 }}>
          💡 How to use:
        </p>
        <ul style={{ marginLeft: 20, margin: 0, paddingLeft: 20 }}>
          <li>🖌️ <strong>Draw</strong> - Use pen/brush tools to draw on the canvas</li>
          <li>🎨 <strong>Colors</strong> - Pick any color from the palette</li>
          <li>🧹 <strong>Eraser</strong> - Remove mistakes</li>
          <li>🎤 <strong>Voice</strong> - Click mic and describe what to draw</li>
          <li>✨ <strong>AI Generate</strong> - Type a prompt and click Generate</li>
          <li>💾 <strong>Save</strong> - Download your drawing as PNG</li>
        </ul>
        
        <p style={{ 
          marginTop: 16, 
          padding: '10px 14px',
          background: 'rgba(74, 222, 128, 0.1)',
          borderRadius: 6,
          color: '#4ade80',
          fontSize: 13
        }}>
          💡 Try: "a happy sun with sunglasses" or "a cute robot waving"
        </p>
      </div>
    </div>
  )
}

export default DemoApp
