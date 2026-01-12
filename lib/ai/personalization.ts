/**
 * AI Personalization Utilities
 * Generate personalized content for users based on their behavior and preferences
 */

interface UserProfile {
  email: string;
  purchaseHistory?: Array<{
    productId: string;
    productName: string;
    category: string;
    theme?: string;
    price: number;
    purchasedAt: string;
  }>;
  browsingHistory?: Array<{
    productId: string;
    productName: string;
    category: string;
    viewedAt: string;
  }>;
  tags?: string[];
  preferences?: {
    favoriteThemes?: string[];
    priceRange?: { min: number; max: number };
    ageRange?: string;
  };
}

interface PersonalizedContent {
  subject: string;
  greeting: string;
  recommendations: Array<{
    productId: string;
    productName: string;
    reason: string;
  }>;
  body: string;
  callToAction: string;
  discountCode?: string;
}

const USE_MOCK = !process.env.OPENAI_API_KEY;

async function callOpenAI(prompt: string): Promise<string> {
  if (USE_MOCK) {
    return 'This is a mock AI-generated personalized content. Please configure OPENAI_API_KEY to use real AI generation.';
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
            content: 'You are an expert email marketing copywriter specializing in children\'s party supplies. Create personalized, engaging email content that feels natural and helpful, not pushy.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 800,
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

/**
 * Generate personalized email content for a user
 */
export async function generatePersonalizedEmail(
  userProfile: UserProfile,
  campaignType: 'abandoned-cart' | 'product-recommendation' | 'birthday-reminder' | 'holiday-promotion'
): Promise<PersonalizedContent> {
  const firstName = userProfile.email.split('@')[0];
  const favoriteThemes = userProfile.preferences?.favoriteThemes || [];
  const recentPurchases = userProfile.purchaseHistory?.slice(0, 3) || [];
  const recentViews = userProfile.browsingHistory?.slice(0, 5) || [];

  let prompt = '';
  let recommendations: Array<{ productId: string; productName: string; reason: string }> = [];

  switch (campaignType) {
    case 'abandoned-cart':
      prompt = `Generate a personalized abandoned cart recovery email for a parent named ${firstName}.

User Profile:
- Favorite themes: ${favoriteThemes.join(', ') || 'Not specified'}
- Recent purchases: ${recentPurchases.map(p => p.productName).join(', ') || 'None'}
- Recently viewed: ${recentViews.map(v => v.productName).join(', ') || 'None'}

Requirements:
- Friendly, understanding tone (not pushy)
- Acknowledge they might be busy
- Create urgency with a limited-time discount
- Include a clear call-to-action
- Keep it concise (150-200 words)

Generate:
1. Subject line (under 50 characters)
2. Personalized greeting
3. Email body
4. Call-to-action text`;
      break;

    case 'product-recommendation':
      // Generate product recommendations based on user behavior
      const recommendedProducts = recentViews
        .filter(v => !recentPurchases.some(p => p.productId === v.productId))
        .slice(0, 3);

      recommendations = recommendedProducts.map(product => ({
        productId: product.productId,
        productName: product.productName,
        reason: `Based on your interest in ${product.category}`,
      }));

      prompt = `Generate a personalized product recommendation email for ${firstName}.

User Profile:
- Favorite themes: ${favoriteThemes.join(', ') || 'Not specified'}
- Recent purchases: ${recentPurchases.map(p => p.productName).join(', ') || 'None'}
- Recommended products: ${recommendedProducts.map(p => p.productName).join(', ')}

Requirements:
- Personal, helpful tone
- Explain why these products might interest them
- Include product benefits relevant to their preferences
- Soft call-to-action
- Keep it engaging (200-250 words)

Generate:
1. Subject line (under 60 characters)
2. Personalized greeting
3. Email body with product recommendations
4. Call-to-action text`;
      break;

    case 'birthday-reminder':
      prompt = `Generate a personalized birthday reminder email for ${firstName}.

User Profile:
- Favorite themes: ${favoriteThemes.join(', ') || 'Not specified'}
- Recent purchases: ${recentPurchases.map(p => `${p.productName} (${p.theme || 'general'})`).join(', ') || 'None'}

Context: It's been about a year since their last purchase, suggesting their child might have another birthday coming up.

Requirements:
- Warm, celebratory tone
- Remind them of their previous successful party
- Suggest new themes or products
- Offer a special birthday discount
- Keep it friendly and helpful (180-220 words)

Generate:
1. Subject line (under 60 characters)
2. Personalized greeting
3. Email body
4. Call-to-action text`;
      break;

    case 'holiday-promotion':
      prompt = `Generate a personalized holiday promotion email for ${firstName}.

User Profile:
- Favorite themes: ${favoriteThemes.join(', ') || 'Not specified'}
- Recent purchases: ${recentPurchases.map(p => p.productName).join(', ') || 'None'}

Requirements:
- Festive, exciting tone
- Highlight holiday-themed products matching their preferences
- Include special holiday discount
- Create urgency (limited time offer)
- Keep it engaging (200-250 words)

Generate:
1. Subject line (under 60 characters)
2. Personalized greeting
3. Email body
4. Call-to-action text`;
      break;
  }

  const aiResponse = await callOpenAI(prompt);
  
  // Parse AI response (simplified - in production, use structured output)
  const lines = aiResponse.split('\n').filter(line => line.trim());
  const subject = lines.find(line => line.toLowerCase().includes('subject'))?.replace(/subject:?/i, '').trim() || 
    `Special offer for ${firstName}!`;
  const greeting = lines.find(line => line.toLowerCase().includes('greeting'))?.replace(/greeting:?/i, '').trim() || 
    `Hi ${firstName},`;
  const body = lines.slice(2, -1).join('\n') || aiResponse;
  const callToAction = lines[lines.length - 1]?.replace(/call.to.action:?/i, '').trim() || 
    'Shop Now';

  return {
    subject,
    greeting,
    recommendations,
    body,
    callToAction,
    discountCode: campaignType === 'abandoned-cart' ? `RECOVER${Date.now().toString().slice(-6)}` : undefined,
  };
}

/**
 * Auto-generate user tags based on behavior
 */
export function generateUserTags(userProfile: UserProfile): string[] {
  const tags: string[] = [];

  // Purchase-based tags
  if (userProfile.purchaseHistory && userProfile.purchaseHistory.length > 0) {
    tags.push('has-purchased');
    
    const totalSpent = userProfile.purchaseHistory.reduce((sum, p) => sum + p.price, 0);
    if (totalSpent > 200) tags.push('high-value');
    if (totalSpent > 100) tags.push('medium-value');
    if (userProfile.purchaseHistory.length > 1) tags.push('repeat-customer');
    if (userProfile.purchaseHistory.length > 3) tags.push('loyal-customer');
  }

  // Theme preferences
  if (userProfile.preferences?.favoriteThemes) {
    userProfile.preferences.favoriteThemes.forEach(theme => {
      tags.push(`theme-${theme.toLowerCase()}`);
    });
  }

  // Age range
  if (userProfile.preferences?.ageRange) {
    tags.push(`age-${userProfile.preferences.ageRange}`);
  }

  // Price range
  if (userProfile.preferences?.priceRange) {
    if (userProfile.preferences.priceRange.max < 50) tags.push('budget-conscious');
    if (userProfile.preferences.priceRange.min > 100) tags.push('premium-customer');
  }

  // Browsing behavior
  if (userProfile.browsingHistory && userProfile.browsingHistory.length > 5) {
    tags.push('active-browser');
  }

  // Recent activity
  const recentActivity = userProfile.browsingHistory?.[0]?.viewedAt || 
    userProfile.purchaseHistory?.[0]?.purchasedAt;
  if (recentActivity) {
    const daysSince = (Date.now() - new Date(recentActivity).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 7) tags.push('recent-activity');
    if (daysSince > 90) tags.push('inactive');
  }

  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Generate product recommendations based on user profile
 */
export function generateProductRecommendations(
  userProfile: UserProfile,
  availableProducts: Array<{
    id: string;
    name: string;
    category: string;
    theme?: string;
    price: number;
    ageRange?: string;
  }>
): Array<{ productId: string; productName: string; reason: string; score: number }> {
  const recommendations: Array<{ productId: string; productName: string; reason: string; score: number }> = [];

  for (const product of availableProducts) {
    let score = 0;
    const reasons: string[] = [];

    // Skip if already purchased
    if (userProfile.purchaseHistory?.some(p => p.productId === product.id)) {
      continue;
    }

    // Theme match
    if (userProfile.preferences?.favoriteThemes?.includes(product.theme || '')) {
      score += 30;
      reasons.push(`Matches your favorite ${product.theme} theme`);
    }

    // Category match
    const purchasedCategories = userProfile.purchaseHistory?.map(p => p.category) || [];
    if (purchasedCategories.includes(product.category)) {
      score += 20;
      reasons.push(`Similar to products you've purchased`);
    }

    // Age range match
    if (userProfile.preferences?.ageRange && product.ageRange) {
      if (product.ageRange.includes(userProfile.preferences.ageRange)) {
        score += 15;
        reasons.push(`Perfect for your child's age`);
      }
    }

    // Price range match
    if (userProfile.preferences?.priceRange) {
      const { min, max } = userProfile.preferences.priceRange;
      if (product.price >= min && product.price <= max) {
        score += 15;
        reasons.push(`Within your preferred price range`);
      }
    }

    // Recently viewed similar
    const viewedSimilar = userProfile.browsingHistory?.some(
      v => v.category === product.category || v.productId === product.id
    );
    if (viewedSimilar) {
      score += 20;
      reasons.push(`You recently viewed similar products`);
    }

    if (score > 0) {
      recommendations.push({
        productId: product.id,
        productName: product.name,
        reason: reasons.join(', '),
        score,
      });
    }
  }

  // Sort by score and return top 5
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 5);
}

