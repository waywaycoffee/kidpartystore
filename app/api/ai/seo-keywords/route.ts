/**
 * AI SEO Keywords Research API
 * Uses AI to discover and optimize SEO keywords
 */

import { verifyAdminAuth } from '@/lib/api-auth';
import { NextRequest, NextResponse } from 'next/server';

const USE_MOCK = !process.env.OPENAI_API_KEY;

async function generateKeywordsWithAI(productInfo: string, targetMarket: string): Promise<{
  demandKeywords: string[];
  productKeywords: string[];
  longTailKeywords: string[];
}> {
  if (USE_MOCK) {
    return {
      demandKeywords: [
        'how to plan a birthday party',
        'kids party decoration ideas',
        'children birthday party themes',
      ],
      productKeywords: [
        'party supplies',
        'birthday decorations',
        'kids party set',
      ],
      longTailKeywords: [
        'affordable princess party supplies for 5 year old',
        'dinosaur party set for 3-5 year olds',
        'safe balloon decorations for toddler party',
      ],
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert specializing in e-commerce keyword research. Generate relevant keywords for children\'s party supplies.',
          },
          {
            role: 'user',
            content: `Generate SEO keywords for this product:
Product Info: ${productInfo}
Target Market: ${targetMarket}

Generate:
1. 5 demand keywords (how-to, ideas, tips)
2. 5 product keywords (product names, categories)
3. 10 long-tail keywords (specific, low competition, high conversion)

Return as JSON:
{
  "demandKeywords": ["..."],
  "productKeywords": ["..."],
  "longTailKeywords": ["..."]
}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    
    return {
      demandKeywords: content.demandKeywords || [],
      productKeywords: content.productKeywords || [],
      longTailKeywords: content.longTailKeywords || [],
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productInfo, targetMarket } = body;

    if (!productInfo) {
      return NextResponse.json(
        { error: 'Product information is required' },
        { status: 400 }
      );
    }

    const keywords = await generateKeywordsWithAI(
      productInfo,
      targetMarket || 'US'
    );

    return NextResponse.json({ keywords });
  } catch (error) {
    console.error('Error generating keywords:', error);
    return NextResponse.json(
      { error: 'Failed to generate keywords' },
      { status: 500 }
    );
  }
}

