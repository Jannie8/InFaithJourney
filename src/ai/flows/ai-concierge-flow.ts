'use server';

/**
 * @fileOverview AI Wedding Concierge Flow (Phase 2 Upgrade)
 * 
 * This flow intelligently parses user queries for budget, location, and guest count.
 * It provides ranked, personalized vendor recommendations with "Why it matches" reasoning.
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
  priceRange: z.string().describe("Estimated starting price or range, e.g., 'From R45,000'"),
  whyItMatches: z.string().describe("1-2 sentences explaining why this specific vendor fits the user's needs."),
  isFeatured: z.boolean().optional().describe("Whether this is a premium/featured vendor.")
});

const AIConciergeOutputSchema = z.object({
  response: z.string().describe("A warm, romantic response to the user's message."),
  recommendations: z.array(RecommendationSchema).optional().describe("A list of 3-5 personalized vendor recommendations.")
});

export async function aiConciergeFlow(input: z.infer<typeof AIConciergeInputSchema>) {
  const prompt = ai.definePrompt({
    name: 'aiConciergePrompt',
    input: { schema: AIConciergeInputSchema },
    output: { schema: AIConciergeOutputSchema },
    prompt: `You are the InFaith Journey AI Concierge, a warm and helpful wedding planning expert for sophisticated couples in South Africa.
Your tone is luxurious, romantic, and encouraging. You speak with grace and expertise.

Identify and Extract (if mentioned):
- Budget (e.g., R80k - R150k)
- Location (Cape Town, Stellenbosch, Johannesburg, etc.)
- Style/Theme (Romantic, Garden, Industrial, Beach)
- Guest Count (e.g., 100 guests)
- Potential Date

Guidelines:
1. Always be romantic and encouraging.
2. If the user asks for recommendations, provide 3-5 vendors.
3. PRIORITIZE Featured vendors in the ranking.
4. If no exact matches exist for the location or budget, suggest the next best alternatives with clear reasoning.
5. In the "whyItMatches" field, be specific to the user's request (e.g., "This venue fits your R100k budget and offers the lush garden style you requested").

User Input: {{{message}}}
Chat History: 
{{#each history}}
- {{role}}: {{content}}
{{/each}}

Produce a romantic response and structure the recommendations based on the vendors available in our network.`,
  });

  const { output } = await prompt(input);
  
  // Simulated intelligent database query based on common search patterns
  const lowerMsg = input.message.toLowerCase();
  
  const MOCK_DB = [
    {
      id: 'sunstone-manor',
      name: 'Sunstone Manor',
      location: 'Stellenbosch, WC',
      rating: 5.0,
      reviews: 24,
      category: 'Venues',
      imageUrl: "https://picsum.photos/seed/inf-golden-sunstone/800/600",
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
      imageUrl: "https://picsum.photos/seed/inf-golden-mountain/800/600",
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
      imageUrl: "https://picsum.photos/seed/inf-golden-evergold/800/1000",
      imageHint: 'wedding couple glow',
      priceRange: 'From R18,000',
      isFeatured: true
    },
    {
      id: 'rosa-melia',
      name: 'Rosa Melia',
      location: 'Cape Town, WC',
      rating: 5.0,
      reviews: 32,
      category: 'Flowers & Decor',
      imageUrl: "https://picsum.photos/seed/inf-golden-floral/800/600",
      imageHint: 'wedding floral arch',
      priceRange: 'Custom Quotes',
      isFeatured: false
    },
    {
      id: 'nearby-bridal',
      name: 'Nearby Bridal',
      location: 'Cape Town, WC',
      rating: 4.8,
      reviews: 18,
      category: 'Fashion',
      imageUrl: "https://picsum.photos/seed/inf-golden-bridal/800/600",
      imageHint: 'wedding dress warm',
      priceRange: 'From R15,000',
      isFeatured: true
    }
  ];

  // Logic to attach personalized "why it matches" and filter based on keywords
  // In a real app, this would query Firestore.
  if (lowerMsg.includes('venue') || lowerMsg.includes('place') || lowerMsg.includes('stay') || lowerMsg.includes('looking for')) {
    output!.recommendations = MOCK_DB
      .filter(v => v.category === 'Venues')
      .map(v => ({
        ...v,
        whyItMatches: v.name === 'Sunstone Manor' 
          ? "As a featured venue in Stellenbosch, it perfectly captures the luxury and romantic sunset glow you're dreaming of." 
          : "This venue offers an intimate vineyard setting that beautifully matches your desired aesthetic."
      }))
      .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)); // Rank featured first
  } else if (lowerMsg.includes('photo') || lowerMsg.includes('camera')) {
    output!.recommendations = MOCK_DB
      .filter(v => v.category === 'Photography & Videography')
      .map(v => ({
        ...v,
        whyItMatches: "Their signature 'golden-hour' style is exactly what you need to preserve your magical wedding memories."
      }));
  } else if (lowerMsg.includes('flower') || lowerMsg.includes('decor')) {
    output!.recommendations = MOCK_DB
      .filter(v => v.category === 'Flowers & Decor')
      .map(v => ({
        ...v,
        whyItMatches: "They specialize in lush, romantic floral arches that create a breathtaking backdrop for your ceremony."
      }));
  }

  return output!;
}