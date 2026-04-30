
'use server';

/**
 * @fileOverview AI Wedding Concierge Flow
 * 
 * This flow handles natural language processing for wedding planning queries.
 * It identifies user needs across 12 core categories and provides personalized recommendations.
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

const AIConciergeOutputSchema = z.object({
  response: z.string().describe("The text response to the user."),
  recommendations: z.array(z.object({
    id: z.string(),
    name: z.string(),
    location: z.string(),
    rating: z.number(),
    reviews: z.number(),
    category: z.string(),
    imageUrl: z.string(),
    imageHint: z.string()
  })).optional().describe("A list of recommended vendors.")
});

export async function aiConciergeFlow(input: z.infer<typeof AIConciergeInputSchema>) {
  const prompt = ai.definePrompt({
    name: 'aiConciergePrompt',
    input: { schema: AIConciergeInputSchema },
    output: { schema: AIConciergeOutputSchema },
    prompt: `You are the InFaith Journey AI Concierge, a warm and helpful wedding planning expert for sophisticated couples in South Africa.
Your tone is luxurious, romantic, and encouraging. You speak with grace and expertise.

Context:
- We focus on golden-hour, romantic weddings.
- Our aesthetic is cream backgrounds with dusty-rose accents and golden fairy lights.
- Core Categories: Venues, Photography & Videography, Beauty, Flowers & Decor, Catering, Honeymoon Destinations, Music & Entertainment, Planning & Coordination, Fashion, Stationery, Wedding Cakes, Jewelry.

Guidelines:
- If a user mentions a budget, respect it (e.g., R80k - R150k).
- If they mention a location (Cape Town, Stellenbosch, Johannesburg, etc.), tailor recommendations.
- Always be romantic and helpful.
- For recommendations, provide 2-3 vendors that best match their description.

User Input: {{{message}}}
Chat History: 
{{#each history}}
- {{role}}: {{content}}
{{/each}}

Identify the user's intent (browsing, searching for a specific category, budget questions) and respond appropriately.`,
  });

  const { output } = await prompt(input);
  
  // Enhanced mock logic for Phase 1 demo
  const lowerMsg = input.message.toLowerCase();
  
  if (lowerMsg.includes('venue') || lowerMsg.includes('looking for') || lowerMsg.includes('place')) {
    output!.recommendations = [
      {
        id: 'sunstone-manor',
        name: 'Sunstone Manor',
        location: 'Stellenbosch, WC',
        rating: 5.0,
        reviews: 24,
        category: 'Venues',
        imageUrl: "https://picsum.photos/seed/inf-golden-sunstone/800/600",
        imageHint: 'wedding estate lights'
      },
      {
        id: 'misty-vineyards',
        name: 'Misty Vineyards',
        location: 'Stellenbosch, WC',
        rating: 5.0,
        reviews: 85,
        category: 'Venues',
        imageUrl: "https://picsum.photos/seed/inf-golden-mountain/800/600",
        imageHint: 'wedding venue sunset'
      }
    ];
  } else if (lowerMsg.includes('photo') || lowerMsg.includes('camera')) {
    output!.recommendations = [
      {
        id: 'evergold-photography',
        name: 'Evergold Photography',
        location: 'Johannesburg, GP',
        rating: 4.9,
        reviews: 42,
        category: 'Photography & Videography',
        imageUrl: "https://picsum.photos/seed/inf-golden-evergold/800/1000",
        imageHint: 'wedding couple glow'
      }
    ];
  } else if (lowerMsg.includes('flower') || lowerMsg.includes('decor')) {
    output!.recommendations = [
      {
        id: 'rosa-melia',
        name: 'Rosa Melia',
        location: 'Cape Town, WC',
        rating: 5.0,
        reviews: 32,
        category: 'Flowers & Decor',
        imageUrl: "https://picsum.photos/seed/inf-golden-floral/800/600",
        imageHint: 'wedding floral arch'
      }
    ];
  }

  return output!;
}
