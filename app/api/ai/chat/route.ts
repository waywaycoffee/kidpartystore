/**
 * AI Chat API
 * Handles customer service chat messages
 */

import { NextRequest, NextResponse } from 'next/server';

const USE_MOCK = !process.env.OPENAI_API_KEY;

async function getAIResponse(message: string, context?: string): Promise<string> {
  if (USE_MOCK) {
    // Mock responses for common questions
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return 'We offer international shipping to most countries. Standard shipping takes 7-14 business days, and express shipping takes 3-7 business days. Free shipping is available for orders over $50.';
    }
    
    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return 'We offer a 30-day return policy. If you\'re not satisfied with your purchase, you can return it for a full refund. Please contact our support team to initiate a return.';
    }
    
    if (lowerMessage.includes('age') || lowerMessage.includes('suitable')) {
      return 'Our party supplies are designed for children of various ages. Each product page includes recommended age ranges. Most products are suitable for children aged 3-12 years.';
    }
    
    if (lowerMessage.includes('safe') || lowerMessage.includes('safety')) {
      return 'All our products are certified safe and meet international safety standards (ASTM, EN 71). We use non-toxic materials and ensure all products are age-appropriate.';
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return 'Our prices vary by product. Most party packages range from $30-$100. You can view detailed pricing on each product page. We also offer discounts for bulk orders.';
    }
    
    return 'Thank you for your question! I\'m here to help with party planning needs. Could you provide more details about what you\'re looking for? For complex inquiries, I can connect you with our support team.';
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
            content: `You are a helpful customer service representative for a children's party supplies e-commerce store called PartyExpert. 

Company Information:
- We sell party supplies including theme packages, balloons, decorations, and tableware
- We ship internationally to US, CA, GB, AU, EU, and other countries
- Standard shipping: 7-14 business days, Express: 3-7 business days
- Free shipping for orders over $50
- 30-day return policy
- All products are safety certified (ASTM, EN 71)
- Products are suitable for children aged 3-12 years

Your role:
- Answer questions about products, shipping, returns, and general inquiries
- Be friendly, helpful, and professional
- If you don't know something, suggest contacting support
- Keep responses concise and helpful
- For complex issues, offer to connect with a human agent`,
          },
          ...(context ? [{ role: 'system', content: `Context: ${context}` }] : []),
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
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
    const body = await request.json();
    const { message, context } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await getAIResponse(message, context);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return NextResponse.json(
      { error: 'Failed to process message. Please try again.' },
      { status: 500 }
    );
  }
}

