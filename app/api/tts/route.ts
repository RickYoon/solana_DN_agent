import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const demoScript = `Welcome to Solana DeFi Navigator, your AI-powered companion for DeFi investments.
Today, I'll demonstrate how our AI assistant guides users through complex DeFi protocols with ease and precision.

I'll guide you through a strategic investment process across multiple Solana protocols.

Step 1: Let's start by converting your USDC to SOL on Raydium.
I'll help you find the best rates and execute the swap safely.

Step 2: Now, we'll maximize your yields through restaking on Fragmetric.
This protocol offers competitive APY for SOL staking.

Step 3: We'll provide liquidity on Rate-X.
Their innovative LP strategy helps optimize your returns.

Step 4: Finally, let's set up a strategic position on Drift protocol.
This will help diversify your investment portfolio.

As you've seen, our AI navigator simplifies the complex DeFi landscape by:
- Providing real-time yield data
- Offering step-by-step guidance
- Ensuring secure transactions
- Optimizing investment strategies

Start your DeFi journey with confidence using Solana DeFi Navigator.`;

export async function GET() {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "echo",  // 전문적인 남성 목소리
      input: demoScript,
    });

    // 스트림을 버퍼로 변환
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // MP3 파일로 응답
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
} 