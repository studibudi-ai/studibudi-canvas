import type { AIGenerationOptions, AIProvider } from '../types'

export class AIGenerator {
  private provider: AIProvider
  private apiKey?: string
  private model?: string
  private style: string

  constructor(options: AIGenerationOptions) {
    this.provider = options.provider
    this.apiKey = options.apiKey
    this.model = options.model
    this.style = options.style || 'illustration'
  }

  async generate(prompt: string): Promise<string> {
    const styledPrompt = this.buildPrompt(prompt)

    switch (this.provider) {
      case 'gemini':
        return this.generateWithGemini(styledPrompt)
      case 'openai':
        return this.generateWithOpenAI(styledPrompt)
      case 'stability':
        return this.generateWithStability(styledPrompt)
      default:
        throw new Error(`Unknown AI provider: ${this.provider}`)
    }
  }

  private buildPrompt(userPrompt: string): string {
    const styleGuides: Record<string, string> = {
      sketch: 'simple hand-drawn sketch style, pencil drawing',
      illustration: 'clean digital illustration, vibrant colors',
      realistic: 'photorealistic, detailed, high quality',
      cartoon: 'cartoon style, fun and colorful, suitable for children'
    }

    const styleGuide = styleGuides[this.style] || styleGuides.illustration
    return `${userPrompt}. Style: ${styleGuide}. White background, centered composition.`
  }

  private async generateWithGemini(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key required')
    }

    const model = this.model || 'gemini-2.0-flash-exp'
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Generate an image: ${prompt}` }]
          }],
          generationConfig: {
            responseModalities: ['image', 'text']
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    // Extract image from response
    const imagePart = data.candidates?.[0]?.content?.parts?.find(
      (p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData?.mimeType?.startsWith('image/')
    )

    if (imagePart?.inlineData) {
      return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`
    }

    throw new Error('No image generated')
  }

  private async generateWithOpenAI(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key required')
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model || 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json'
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const b64 = data.data?.[0]?.b64_json
    
    if (b64) {
      return `data:image/png;base64,${b64}`
    }

    throw new Error('No image generated')
  }

  private async generateWithStability(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Stability API key required')
    }

    const response = await fetch(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt, weight: 1 }],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Stability API error: ${response.status}`)
    }

    const data = await response.json()
    const b64 = data.artifacts?.[0]?.base64
    
    if (b64) {
      return `data:image/png;base64,${b64}`
    }

    throw new Error('No image generated')
  }
}

export default AIGenerator
