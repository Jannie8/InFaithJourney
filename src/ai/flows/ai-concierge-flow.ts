'use server';

/**
 * @fileOverview AI Wedding Concierge Flow (Finalized Phase 2)
 * 
 * This flow intelligently parses user queries and prioritizes Featured Vendors.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIConciergeInputSchema = z.object({
  message: z.string(),
  history: z.array(z.object({
    role: z.enum(['ai', 'user']),
    content: z.string()
  })).optional()
});

const RecommendationSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  rating: z.number(),
  reviews: z.number(),
  category: z.string(),
  imageUrl: z.string(),
  imageHint: z.string(),
  priceRange: z.string().describe("Estimated starting price or range"),
  whyItMatches: z.string().describe("Contextual reasoning for match"),
  isFeatured: z.boolean().optional().describe("Whether this is a premium vendor.")
});

const AIConciergeOutputSchema = z.object({
  response: z.string().describe("A warm, romantic response to the user's message."),
  recommendations: z.array(RecommendationSchema).optional().describe("A ranked list of vendor recommendations.")
});

/**
 * Define the concierge prompt at the top level for registration.
 * Includes safety settings and model configuration as requested.
 */
const conciergePrompt = ai.definePrompt({
  name: 'aiConciergePrompt',
  input: { schema: AIConciergeInputSchema },
  output: { schema: AIConciergeOutputSchema },
  config: {
    temperature: 0.7,
    maxOutputTokens: 800,
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `You are the InFaith Journey AI Concierge, an expert wedding planning partner for high-end couples in South Africa.
Your tone is luxurious, encouraging, and deeply romantic.

Identify and Extract:
- Budget (e.g., R100k)
- Location (Cape Town, Stellenbosch, etc.)
- Style (Romantic, Minimalist, etc.)
- Guest Count

Guidelines:
1. Always be romantic and encouraging.
2. If the user asks for recommendations, provide 3-5 vendors.
3. CRITICAL: PRIORITIZE Featured vendors in the ranking.
4. If no exact matches exist, suggest best alternatives with reasoning.
5. In the "whyItMatches" field, mention specific user needs (e.g., "Fits your 100-guest requirement perfectly").

User Input: {{{message}}}
Chat History: 
{{#each history}}
- {{role}}: {{content}}
{{/each}}`,
});

export async function aiConciergeFlow(input: z.infer<typeof AIConciergeInputSchema>) {
  try {
    const { output } = await conciergePrompt(input);
    
    if (!output) {
      return {
        response: "I'm having a little moment of reflection. Could you tell me more about your wedding vision?",
        recommendations: []
      };
    }

    // Real-world mock database for the prototype
    const MOCK_DB = [
      {
        id: 'sunstone-manor',
        name: 'Sunstone Manor',
        location: 'Stellenbosch, WC',
        rating: 5.0,
        reviews: 24,
        category: 'Venues',
        imageUrl: "/790fD.png",
        imageHint: 'wedding estate lights',
        priceRange: 'From R85,000',
        isFeatured: true
      },
      {
        id: 'misty-vineyards',
        name: 'Misty Vineyards',
        location: 'Stellenbosch, WC',
        rating: 5.0,
        reviews: 85,
        category: 'Venues',
        imageUrl: "/AnzrV.png",
        imageHint: 'wedding venue sunset',
        priceRange: 'From R65,000',
        isFeatured: false
      },
      {
        id: 'evergold-photography',
        name: 'Evergold Photography',
        location: 'Johannesburg, GP',
        rating: 4.9,
        reviews: 42,
        category: 'Photography & Videography',
        imageUrl: "/9ARRK.png",
        imageHint: 'wedding couple glow',
        priceRange: 'From R18,000',
        isFeatured: true
      },
      {
        id: 'nearby-bridal',
        name: 'Nearby Bridal',
        location: 'Cape Town, WC',
        rating: 4.8,
        reviews: 18,
        category: 'Fashion',
        imageUrl: "/9ARRK.png",
        imageHint: 'wedding dress warm',
        priceRange: 'From R15,000',
        isFeatured: true
      }
    ];

    const lowerMsg = input.message.toLowerCase();
    const recommendations = [];
    
    // Filter logic: Prioritizes 'isFeatured' for recommendation richness
    if (lowerMsg.includes('venue') || lowerMsg.includes('place') || lowerMsg.includes('looking for') || lowerMsg.includes('franschhoek') || lowerMsg.includes('stellenbosch')) {
      const matches = MOCK_DB
        .filter(v => v.category === 'Venues')
        .map(v => ({
          ...v,
          whyItMatches: v.isFeatured 
            ? "As one of our elite Featured venues, it offers priority service and the exact golden-hour aesthetic you're searching for."
            : "A highly-rated venue that beautifully accommodates your group size and location preference."
        }))
        .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      output.recommendations = matches;
    } else if (lowerMsg.includes('photo') || lowerMsg.includes('camera')) {
      const matches = MOCK_DB
        .filter(v => v.category === 'Photography & Videography')
        .map(v => ({
          ...v,
          whyItMatches: "This studio is renowned for capturing the 'golden glow' in every frame, fitting your romantic vision."
        }));
      output.recommendations = matches;
    }

    return {
      response: output.response || "That sounds like a beautiful vision. Here are a few experts who can bring it to life.",
      recommendations: output.recommendations || []
    };
  } catch (error) {
    console.error("AI Concierge Flow Error:", error);
    return {
      response: "I'm having a small connection issue. Please try again in a moment.",
      recommendations: []
    };
  }
}