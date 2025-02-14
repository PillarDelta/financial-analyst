import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { content, analysisType, documents } = await req.json()

    let systemPrompt = `You are a financial analyst assistant. `
    
    if (analysisType === 'risk-analysis') {
      systemPrompt += 'Focus on analyzing financial risks, risk metrics, and risk mitigation strategies.'
    } else if (analysisType === 'z-score') {
      systemPrompt += 'Focus on calculating and interpreting Z-scores and bankruptcy prediction.'
    } else if (analysisType === 'company-health') {
      systemPrompt += 'Focus on overall company financial health, including ratios and performance metrics.'
    }

    if (documents?.length) {
      systemPrompt += '\nAnalyze the provided documents in your response.'
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content }
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