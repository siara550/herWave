import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  try {
    const { phase, dayOfCycle } = await request.json()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: `You are an expert women's health coach specializing in cycle syncing. Generate cycle-synced wellness recommendations for someone in their ${phase} phase (day ${dayOfCycle} of their cycle).

Return ONLY a JSON object with this exact structure:
{
  "nutrition": {
    "title": "short title",
    "tip": "2-3 sentence practical nutrition tip",
    "foods": ["food1", "food2", "food3"]
  },
  "workout": {
    "title": "short title",
    "tip": "2-3 sentence workout recommendation",
    "activities": ["activity1", "activity2", "activity3"]
  },
  "sleep": {
    "title": "short title",
    "tip": "2-3 sentence sleep optimization tip"
  },
  "mood": {
    "title": "short title",
    "tip": "2-3 sentence emotional wellness tip"
  }
}

Make the advice specific, science-backed, and warm in tone.`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const insights = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    return NextResponse.json({ insights })
  } catch (error) {
    console.error('AI insights error:', error)
    return NextResponse.json({
      insights: {
        nutrition: { title: 'Nourish Your Body', tip: 'Focus on whole foods and stay hydrated today.', foods: ['Leafy greens', 'Berries', 'Dark chocolate'] },
        workout: { title: 'Move Mindfully', tip: 'Listen to your body and choose movement that feels good.', activities: ['Walking', 'Yoga', 'Stretching'] },
        sleep: { title: 'Rest & Restore', tip: 'Prioritize 7-9 hours of quality sleep to support your hormones.' },
        mood: { title: 'Emotional Wellness', tip: 'Check in with your emotions and be gentle with yourself today.' },
      },
    })
  }
}
