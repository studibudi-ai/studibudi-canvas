import React, { useState, useCallback, useRef, useEffect } from 'react'
import type { PromptInputProps } from '../types'

export const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  isGenerating,
  enableVoice
}) => {
  const [prompt, setPrompt] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (!enableVoice) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceError('Voice input not supported in this browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('')
      setPrompt(transcript)
    }

    recognition.onerror = (event) => {
      setVoiceError(`Voice error: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [enableVoice])

  const toggleVoice = useCallback(() => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setVoiceError(null)
      recognitionRef.current.start()
      setIsListening(true)
    }
  }, [isListening])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isGenerating) {
      onSubmit(prompt.trim())
      setPrompt('')
    }
  }, [prompt, isGenerating, onSubmit])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }, [handleSubmit])

  return (
    <div className="prompt-input-container">
      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to draw... (e.g., 'a happy sun with sunglasses')"
            disabled={isGenerating}
            className="prompt-input"
          />
          
          {enableVoice && (
            <button
              type="button"
              onClick={toggleVoice}
              className={`voice-btn ${isListening ? 'listening' : ''}`}
              disabled={isGenerating}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? '🔴' : '🎤'}
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="generate-btn"
        >
          {isGenerating ? (
            <>⏳ Generating...</>
          ) : (
            <>✨ Generate</>
          )}
        </button>
      </form>

      {voiceError && (
        <p className="voice-error">{voiceError}</p>
      )}

      {isListening && (
        <p className="listening-indicator">🎙️ Listening... speak now</p>
      )}
    </div>
  )
}

// Add TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

export default PromptInput
