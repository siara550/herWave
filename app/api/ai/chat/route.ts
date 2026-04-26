import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: Request) {
  try {
    const { message, phaseName, dayRange, cycleLength, userName } = await req.json()

    const systemPrompt = `You are HerAI, a warm, knowledgeable women's health companion inside the HerWave app.
The user is currently in their ${phaseName} phase (${dayRange}).
Their cycle is ${cycleLength} days long.
Their name is ${userName}.
Provide accurate, compassionate, evidence-based advice about menstrual health, hormones, and wellbeing.
Keep responses concise (2-4 sentences), warm, and empowering.
Use occasional soft emojis. Never be clinical or cold.`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    })

    const reply =
      response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json(
      { reply: "I'm having a moment — try again in a sec 💜" },
      { status: 500 }
    )
  }
}
