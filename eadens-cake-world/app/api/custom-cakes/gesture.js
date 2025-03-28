import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { flavor, filling, frosting, decoration, shape, size, color } = await request.json()

    // Enhanced DALL-E prompt
    const prompt = `
      A professional bakery-style ${size} ${shape} cake with:
      - ${flavor} cake layers
      - ${filling} filling
      - ${frosting} frosting
      - Decorated with ${decoration}
      - ${color} color scheme
      Food photography, studio lighting, 8K resolution, 
      photorealistic, shallow depth of field
    `.replace(/\s+/g, ' ').trim()

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",  // Use DALL-E 3 specifically
        prompt: prompt,
        n: 1,
        size: "1024x1024",  // DALL-E 3 supports higher resolution
        quality: "hd"       // Higher quality for food images
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Failed to generate image')
    }

    const result = await response.json()
    return NextResponse.json({
      imageUrl: result.data[0].url,  // DALL-E returns URL directly
      revisedPrompt: result.data[0].revised_prompt // Helpful for debugging
    })

  } catch (error) {
    console.error("DALL-E Error:", error)
    return NextResponse.json(
      { error: error.message || "Image generation failed" },
      { status: 500 }
    )
  }
}