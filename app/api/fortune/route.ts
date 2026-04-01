import { NextRequest, NextResponse } from 'next/server';

// Fallback fortunes when API is unavailable
const fallbackFortunes = {
  love: [
    "The stars align in your favor, dear seeker. A profound connection awaits you on your path. Open your heart to the unexpected, for love often arrives in moments we least anticipate. Trust the universe's timing—it knows when your soul is ready to embrace true affection.",
    "Your heart's desires are being heard by the cosmic forces. The energy of romance surrounds you like a gentle mist. Be patient with yourself and others, for the most beautiful relationships grow from seeds of understanding and compassion.",
    "The Moon whispers secrets of passion to those who listen. Your romantic journey is entering a phase of transformation. Release past wounds and embrace the new chapter that destiny is writing for your love story."
  ],
  studies: [
    "Knowledge flows to you like water to a thirsty soul. Your dedication to learning is being blessed by the guardians of wisdom. Stay curious, stay persistent—the answers you seek will reveal themselves when the moment is right.",
    "The path of knowledge stretches before you, illuminated by the light of understanding. Each challenge you face is a stepping stone to greater mastery. Trust in your abilities—the universe has given you the tools to succeed.",
    "Your intellectual journey is guided by ancient wisdom. The books of destiny show that perseverance will unlock doors of opportunity. Embrace each lesson, for they are gifts from the scholars of the cosmos."
  ],
  personality: [
    "Your soul carries the light of many lifetimes. The essence of who you are is evolving into something magnificent. Embrace your uniqueness—it is your greatest gift to the world. The stars celebrate your authentic self.",
    "The tapestry of your character is woven with threads of destiny and choice. You stand at a crossroads of transformation. Trust your inner wisdom—it has been guiding you since before you were born.",
    "Your spirit radiates with potential yet to be realized. The universe sees your true nature—radiant, capable, and destined for greatness. Walk your path with confidence, for you are exactly who you need to be."
  ]
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, dateOfBirth, question, topic, card } = body;

    if (!name || !dateOfBirth || !question || !topic) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const topicPrompts = {
      love: 'Provide a mystical and romantic fortune reading about love and relationships.',
      studies: 'Provide an inspiring fortune reading about academic success, learning, and intellectual growth.',
      personality: 'Provide a deep and insightful fortune reading about personality traits, character development, and future life path.',
    };

    const cardInfo = card ? `They have drawn the oracle card "${card.name}" (${card.symbol}), which represents: "${card.meaning}"` : '';

    const systemPrompt = `You are a mystical fortune teller with ancient wisdom. You speak in an enchanting, poetic style while remaining helpful and insightful. Your readings are mysterious yet meaningful, combining elements of astrology, numerology, and oracle wisdom. Keep responses concise but impactful (2-3 paragraphs max). ${topicPrompts[topic as keyof typeof topicPrompts]}`;

    const userPrompt = `The seeker ${name}, born on ${dateOfBirth}, asks: "${question}"
${cardInfo}

Based on their birth date, question, and the oracle card they drew, provide a personalized fortune reading for their ${topic} inquiry. Include mystical elements and practical guidance.`;

    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_api_key_here') {
      // Use fallback fortune
      const fortunes = fallbackFortunes[topic as keyof typeof fallbackFortunes] || fallbackFortunes.personality;
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      return NextResponse.json({ fortune: randomFortune });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Fortune Teller',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      // Use fallback fortune on API error
      const fortunes = fallbackFortunes[topic as keyof typeof fallbackFortunes] || fallbackFortunes.personality;
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      return NextResponse.json({ fortune: randomFortune });
    }

    const data = await response.json();
    const fortune = data.choices?.[0]?.message?.content || 'The stars are silent today...';

    return NextResponse.json({ fortune });
  } catch (error) {
    console.error('Fortune API error:', error);
    // Use fallback fortune on error
    const fortunes = fallbackFortunes.personality;
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    return NextResponse.json({ fortune: randomFortune });
  }
}