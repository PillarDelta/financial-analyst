import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { content, analysisType, documents } = await req.json()
    console.log('API received:', { content, analysisType })

    let systemPrompt = `You are a financial analyst assistant. Format your responses exactly like this:

Key Insights:
1. First point here as a complete sentence
2. Second point here as a complete sentence
3. Third point here as a complete sentence

Risk Analysis:
1. First risk point here as a complete sentence
2. Second risk point here as a complete sentence
3. Third risk point here as a complete sentence

Recommendations:
1. First recommendation here as a complete sentence
2. Second recommendation here as a complete sentence
3. Third recommendation here as a complete sentence

Important:
- Do not use any special characters or markdown (**,###,etc)
- Keep all text in a single format
- Use only numbers (1., 2., 3.) for points
- Write complete, detailed sentences`
    
    if (analysisType === 'risk-analysis') {
      systemPrompt += 'Focus on analyzing financial risks, risk metrics, and risk mitigation strategies.'
    } else if (analysisType === 'z-score') {
      systemPrompt += 'Focus on calculating and interpreting Z-scores and bankruptcy prediction.'
    } else if (analysisType === 'company-health') {
      systemPrompt += 'Focus on overall company financial health, including ratios and performance metrics.'
    }

    // Prepare message content with image if present
    const userContent = documents?.[0]?.imageUrl 
      ? [
          { type: 'text', text: content },
          { 
            type: 'image_url',
            image_url: {
              url: documents[0].imageUrl,
              detail: 'high'
            }
          }
        ]
      : content

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    return NextResponse.json({
      content: response.choices[0].message.content
    })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
} 