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
  ],
  health: [
    "The healing energies of the universe flow through your being. Your body and spirit are entering a period of renewal and balance. Honor your physical vessel with rest and nourishment—it is the temple of your soul.",
    "The ancient wisdom of wellness speaks to your condition. A time of restoration approaches, bringing vitality and inner peace. Listen to your body's whispers; it holds the knowledge of what you need.",
    "Your path to wholeness is illuminated by celestial guidance. The stars foretell a strengthening of both body and mind. Embrace practices that nurture your complete well-being—mind, body, and spirit in harmony."
  ],
  finance: [
    "The cosmic energies of abundance are swirling around your aura. Opportunities for prosperity are emerging on your horizon. Trust your instincts when making financial decisions—the universe guides those who seek wealth with wisdom.",
    "The oracle sees golden threads weaving through your future. Material fortunes may shift in unexpected but favorable ways. Practice gratitude for what you have, and more will flow to you—this is the eternal law.",
    "Your financial destiny is written in the stars. A period of growth and stability approaches. Be mindful in your transactions, generous in your giving, and patient in your expectations—wealth comes to those who wait wisely."
  ]
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, dateOfBirth, question, topic, card, mode, language } = body;

    const langInstruction = language === 'th'
      ? 'Respond entirely in Thai language. Use poetic and mystical Thai expressions appropriate for fortune telling.'
      : 'Respond entirely in English language with mystical poetic style.';

    // For direct question mode, only name, dateOfBirth, and question are required
    if (!name || !dateOfBirth || !question) {
      return NextResponse.json(
        { error: language === 'th' ? 'ข้อมูลไม่ครบถ้วน' : 'Missing required fields' },
        { status: 400 }
      );
    }

    // Direct question mode - no topic/card needed
    if (mode === 'direct') {
      const systemPrompt = `You are a mystical fortune oracle with ancient wisdom. You speak in an enchanting, poetic style while remaining helpful and insightful. Your readings are mysterious yet meaningful, combining elements of astrology, numerology, and oracle wisdom. Keep responses concise but impactful (2-3 paragraphs max). Always address the seeker by name and reference their specific question. Provide wisdom and guidance on any topic the seeker asks about. ${langInstruction}`;

      const userPrompt = `The seeker ${name}, born on ${dateOfBirth}, asks: "${question}"

Based on their birth date and specific question, provide a personalized and insightful response. Include mystical elements, practical guidance, and address their question directly.`;

      // Check if API key is configured
      if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_api_key_here') {
        const randomFortune = fallbackFortunes.personality[Math.floor(Math.random() * fallbackFortunes.personality.length)];
        return NextResponse.json({ fortune: randomFortune });
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'Fortune Oracle',
        },
        body: JSON.stringify({
          model: 'z-ai/glm5',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 500,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const randomFortune = fallbackFortunes.personality[Math.floor(Math.random() * fallbackFortunes.personality.length)];
        return NextResponse.json({ fortune: randomFortune });
      }

      const data = await response.json();
      const fortune = data.choices?.[0]?.message?.content || 'The stars are silent today...';

      return NextResponse.json({ fortune });
    }

    // Prophecy mode - Life guidance
    if (mode === 'prophecy') {
      const systemPrompt = `You are an ancient prophet and oracle who channels divine wisdom about life paths and destiny. You speak in a profound, sacred tone as if delivering a prophecy from the cosmic realm. Your guidance focuses on how to live life according to one's destiny, offering deep spiritual insights about:
- The seeker's soul purpose and life mission
- Principles and values they should embrace
- Paths they should follow or avoid
- Spiritual practices that will benefit them
- How to align with cosmic forces and universal wisdom
- Lessons they need to learn in this lifetime
- Ways to find inner peace and fulfillment
- Connection between their actions and fate

Keep responses profound but practical (3-4 paragraphs). Speak with authority and compassion, as a prophet guiding a seeker through their life journey. Always address them by name and provide actionable guidance they can apply to their daily life. ${langInstruction}`;

      const userPrompt = `The seeker ${name}, born on ${dateOfBirth}, seeks prophetic guidance: "${question}"

Based on their birth date, cosmic alignment, and their request for life guidance, deliver a sacred prophecy about how they should live their life. Provide deep spiritual wisdom, practical principles to follow, and insights about their destiny. Help them understand their life path according to the prophecy.`;

      // Check if API key is configured
      if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_api_key_here') {
        const prophecyFallback = [
          "Your soul carries a sacred mission that has been written in the stars since before your birth. Live each day with intention and mindfulness, for your actions ripple through the fabric of destiny. Seek balance in all things—work and rest, giving and receiving, action and reflection. The universe whispers its wisdom through the quiet moments; learn to listen. Your path is illuminated by compassion—extend it to yourself and others, and you will find doors opening where walls once stood. Trust the journey, even when the road seems unclear, for the prophecy unfolds in divine timing.",
          "The ancient ones see your spirit seeking its true north. Live according to the principle of authenticity—let your outer life reflect your inner truth. What you seek is already within you; the prophecy asks you to uncover it through daily practice of presence and gratitude. Walk gently upon the earth, leaving traces of kindness wherever you go. Your destiny is intertwined with service to others—find ways to contribute, and abundance will flow to you naturally. When faced with choices, ask not what is easiest, but what aligns with your soul's highest calling. This is how you live according to the prophecy.",
          "In the scroll of your destiny, three truths are written: you are here to learn, to love, and to leave a legacy. Embrace each lesson that life presents, for they are gifts from the cosmos wrapped in challenge. Let love guide your decisions—not just romantic love, but love for humanity, for nature, for the journey itself. Create something that will outlast your time here: kindness shared, wisdom imparted, lives touched. The prophecy reveals that your greatest power lies in gentleness, your strongest weapon is patience, and your most reliable compass is your own heart. Trust these gifts, and your life will unfold as the sacred text foretold."
        ];
        const randomFortune = prophecyFallback[Math.floor(Math.random() * prophecyFallback.length)];
        return NextResponse.json({ fortune: randomFortune });
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'Fortune Oracle',
        },
        body: JSON.stringify({
          model: 'z-ai/glm5',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 600,
          temperature: 0.85,
        }),
      });

      if (!response.ok) {
        const prophecyFallback = [
          "Your soul carries a sacred mission that has been written in the stars since before your birth. Live each day with intention and mindfulness, for your actions ripple through the fabric of destiny. Seek balance in all things—work and rest, giving and receiving, action and reflection. The universe whispers its wisdom through the quiet moments; learn to listen. Your path is illuminated by compassion—extend it to yourself and others, and you will find doors opening where walls once stood. Trust the journey, even when the road seems unclear, for the prophecy unfolds in divine timing.",
          "The ancient ones see your spirit seeking its true north. Live according to the principle of authenticity—let your outer life reflect your inner truth. What you seek is already within you; the prophecy asks you to uncover it through daily practice of presence and gratitude. Walk gently upon the earth, leaving traces of kindness wherever you go. Your destiny is intertwined with service to others—find ways to contribute, and abundance will flow to you naturally. When faced with choices, ask not what is easiest, but what aligns with your soul's highest calling. This is how you live according to the prophecy."
        ];
        const randomFortune = prophecyFallback[Math.floor(Math.random() * prophecyFallback.length)];
        return NextResponse.json({ fortune: randomFortune });
      }

      const data = await response.json();
      const fortune = data.choices?.[0]?.message?.content || 'The ancient scrolls are silent today...';

      return NextResponse.json({ fortune });
    }

    // Topic mode - requires topic
    if (!topic) {
      return NextResponse.json(
        { error: 'Missing topic for topic mode' },
        { status: 400 }
      );
    }

    const topicPrompts = {
      love: 'Provide a mystical and romantic fortune reading about love, relationships, soulmates, and matters of the heart.',
      studies: 'Provide an inspiring fortune reading about academic success, career growth, professional development, and intellectual pursuits.',
      personality: 'Provide a deep and insightful fortune reading about personality traits, character development, self-discovery, and future life path.',
      health: 'Provide a soothing and holistic fortune reading about physical wellness, mental peace, spiritual balance, and overall well-being.',
      finance: 'Provide an auspicious fortune reading about financial prosperity, wealth opportunities, career advancement, and material abundance.',
    };

    const cardInfo = card ? `They have drawn the oracle card "${card.name}" (${card.symbol}), which represents: "${card.meaning}"` : '';

    const systemPrompt = `You are a mystical fortune oracle with ancient wisdom. You speak in an enchanting, poetic style while remaining helpful and insightful. Your readings are mysterious yet meaningful, combining elements of astrology, numerology, and oracle wisdom. Keep responses concise but impactful (2-3 paragraphs max). Always address the seeker by name and reference their specific question. ${topicPrompts[topic as keyof typeof topicPrompts]} ${langInstruction}`;

    const userPrompt = `The seeker ${name}, born on ${dateOfBirth}, asks: "${question}"
${cardInfo}

Based on their birth date, specific question, and the oracle card they drew, provide a personalized and comprehensive fortune reading for their ${topic} inquiry. Include mystical elements, practical guidance, and address their question directly.`;

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
        'X-Title': 'Fortune Oracle',
      },
      body: JSON.stringify({
        model: 'z-ai/glm5', // Using GLM-5 model as requested
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