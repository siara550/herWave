import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PHASE_CONTEXT = {
  menstrual: 'The user is in their menstrual phase (days 1-5). Estrogen and progesterone are at their lowest. She may feel fatigued, experience cramps, and need rest and comfort.',
  follicular: 'The user is in their follicular phase. Estrogen is rising, energy is increasing, creativity and motivation are building.',
  ovulatory: 'The user is in their ovulatory phase. Estrogen peaks, she feels her most energetic, confident, and social. This is her power phase.',
  luteal: 'The user is in their luteal phase. Progesterone rises. She may experience PMS symptoms toward the end — bloating, mood shifts, cravings. She needs grounding and nourishment.',
}

export async function POST(request: Request) {
  try {
    const { phase, dayOfCycle } = await request.json()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `You are a compassionate women's health coach. Give one short, specific, actionable wellness tip (2-3 sentences max) for today based on this context:

Phase: ${PHASE_CONTEXT[phase as keyof typeof PHASE_CONTEXT]}
Day of cycle: ${dayOfCycle}

The tip should feel warm, personal, and practical. Focus on one specific thing: nutrition, movement, rest, or mindset. Do not use bullet points — write in flowing prose.`,
        },
      ],
    })

    const tip = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ tip })
  } catch (error) {
    console.error('AI tip error:', error)
    return NextResponse.json({ tip: 'Take a moment today to check in with yourself — your body always knows what it needs.' })
  }
}
