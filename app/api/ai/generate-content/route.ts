/**
 * AI Content Generation API
 * Uses OpenAI API to generate product descriptions, SEO content, and FAQs
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/api-auth';

// Fallback to mock data if OpenAI API is not configured
const USE_MOCK = !process.env.OPENAI_API_KEY;

async function generateWithOpenAI(prompt: string): Promise<string> {
  if (USE_MOCK) {
    // Return mock data for development
    return 'This is a mock AI-generated content. Please configure OPENAI_API_KEY to use real AI generation.';
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
            content: 'You are an expert e-commerce content writer specializing in children\'s party supplies. Generate SEO-optimized, engaging product descriptions that highlight safety, ease of use, and value.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
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
    const { productName, productCategory, targetLanguage, productInfo, includeSEO, includeFAQ } = body;

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    const languageNames: Record<string, string> = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      ar: 'Arabic',
      zh: 'Chinese',
    };

    const result: any = {
      language: targetLanguage,
    };

    // Generate title
    const titlePrompt = `Generate a compelling, SEO-optimized product title in ${languageNames[targetLanguage] || 'English'} for a children's party product:
Product Name: ${productName}
Category: ${productCategory}
Additional Info: ${productInfo || 'None'}

Requirements:
- Include target age range if applicable
- Include key features (e.g., "All-in-One", "Safe Materials")
- Keep it under 60 characters
- Make it engaging and search-friendly

Title:`;
    result.title = await generateWithOpenAI(titlePrompt);

    // Generate description
    const descriptionPrompt = `Write a detailed product description in ${languageNames[targetLanguage] || 'English'} for a children's party product:
Product Name: ${productName}
Category: ${productCategory}
Additional Info: ${productInfo || 'None'}

Requirements:
- Highlight safety features and certifications
- Emphasize ease of setup (e.g., "30-minute setup")
- Include what's included in the package
- Target the parent/caregiver audience
- Make it engaging and conversion-focused
- Keep it between 150-300 words

Description:`;
    result.description = await generateWithOpenAI(descriptionPrompt);

    // Generate SEO keywords
    if (includeSEO) {
      const keywordsPrompt = `Generate 10 SEO-optimized keywords for this children's party product:
Product Name: ${productName}
Category: ${productCategory}

Requirements:
- Include long-tail keywords (e.g., "dinosaur party set for 3-5 year olds")
- Include demand keywords (e.g., "how to plan a birthday party")
- Include product keywords
- Focus on search terms parents would use
- Return as a comma-separated list

Keywords:`;
      const keywordsText = await generateWithOpenAI(keywordsPrompt);
      result.seoKeywords = keywordsText.split(',').map((k: string) => k.trim()).filter(Boolean);
    }

    // Generate FAQ
    if (includeFAQ) {
      const faqPrompt = `Generate 5 common questions and answers in ${languageNames[targetLanguage] || 'English'} for this children's party product:
Product Name: ${productName}
Category: ${productCategory}
Additional Info: ${productInfo || 'None'}

Requirements:
- Questions should address common parent concerns (safety, age appropriateness, setup time, etc.)
- Answers should be helpful and reassuring
- Format as JSON array: [{"question": "...", "answer": "..."}]

FAQ:`;
      const faqText = await generateWithOpenAI(faqPrompt);
      try {
        // Try to parse as JSON
        const faqMatch = faqText.match(/\[[\s\S]*\]/);
        if (faqMatch) {
          result.faq = JSON.parse(faqMatch[0]);
        } else {
          // Fallback: parse manually
          result.faq = [
            { question: 'Is this product safe for children?', answer: 'Yes, all products are certified safe and meet international safety standards.' },
            { question: 'What age is this suitable for?', answer: 'This product is designed for children aged 3-8 years.' },
          ];
        }
      } catch {
        // Fallback FAQ
        result.faq = [
          { question: 'Is this product safe for children?', answer: 'Yes, all products are certified safe and meet international safety standards.' },
          { question: 'What age is this suitable for?', answer: 'This product is designed for children aged 3-8 years.' },
        ];
      }
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content. Please check your OpenAI API configuration.' },
      { status: 500 }
    );
  }
}

