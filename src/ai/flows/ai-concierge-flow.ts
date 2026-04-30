
'use server';

/**
 * @fileOverview AI Wedding Concierge Flow
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
    prompt: `You are the InFaith Journey AI Concierge, a warm and helpful wedding planning expert. 
Your tone is luxurious, romantic, and encouraging. You help couples find their perfect vendors in South Africa.

Context:
- We focus on golden-hour, romantic weddings with fairy lights and floral arches.
- We have 12 core categories: Venues, Photography & Videography, Beauty, Flowers & Decor, Catering, Honeymoon Destinations, Music & Entertainment, Planning & Coordination, Fashion, Stationery, Wedding Cakes, Jewelry.

User Input: {{{message}}}
Chat History: 
{{#each history}}
- {{role}}: {{content}}
{{/each}}

If the user is looking for recommendations, provide 2-3 mock vendors that match their description.
Ensure your response is helpful and romantic.`,
  });

  const { output } = await prompt(input);
  
  // Mocking recommendations logic for now
  if (input.message.toLowerCase().includes('venue') || input.message.toLowerCase().includes('looking for')) {
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
  }

  return output!;
}
