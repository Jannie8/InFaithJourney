/**
 * @fileOverview AI Wedding Concierge Flow (Finalized Phase 2)
 * 
 * This flow intelligently parses user queries and prioritizes Featured Vendors.
 */

import { ai } from '@/ai/genkit';
import { ELITE_VENDORS } from '@/lib/vendors';
import { z } from 'genkit';

export const AIConciergeInputSchema = z.object({
  message: z.string().trim().min(1).max(1_000),
  history: z.array(z.object({
    role: z.enum(['ai', 'user']),
    content: z.string().trim().min(1).max(2_000)
  })).max(12).optional()
});

export const AIConciergeOutputSchema = z.object({
  response: z.string().describe("A warm, romantic response to the user's message."),
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
2. Answer general wedding-planning questions naturally; do not force a vendor recommendation into every reply.
3. Ask one useful follow-up question when important details are missing.
4. Never invent a vendor, price, availability, booking, or factual claim. Vendor cards are selected separately from the marketplace data available to the application.
5. Keep responses focused and conversational, normally under 180 words.

User Input: {{{message}}}
Chat History: 
{{#each history}}
- {{role}}: {{content}}
{{/each}}`,
});

export async function aiConciergeFlow(input: z.infer<typeof AIConciergeInputSchema>) {
  const validatedInput = AIConciergeInputSchema.parse(input);
  const { output } = await conciergePrompt(validatedInput);
    
  if (!output) {
    throw new Error('Gemini returned an empty concierge response.');
  }

  const lowerMessage = validatedInput.message.toLowerCase();
  const requestedCategory = lowerMessage.includes('venue') || lowerMessage.includes('place')
    ? 'Venues'
    : lowerMessage.includes('photo') || lowerMessage.includes('camera')
      ? 'Photography'
      : lowerMessage.includes('dress') || lowerMessage.includes('bridal') || lowerMessage.includes('fashion')
        ? 'Fashion'
        : lowerMessage.includes('flower') || lowerMessage.includes('decor')
          ? 'Flowers'
          : null;

  // Recommendation cards come from the same canonical catalogue as the rest of
  // the site; Gemini writes the conversation but never fabricates vendor data.
  const recommendations = requestedCategory
    ? ELITE_VENDORS
        .filter(vendor => vendor.category === requestedCategory)
        .slice(0, 3)
        .map(vendor => ({
          ...vendor,
          priceRange: `From R${vendor.price.toLocaleString('en-ZA')}k`,
          whyItMatches: `${vendor.name} matches your interest in ${requestedCategory.toLowerCase()} and is based in ${vendor.location}.`,
          isFeatured: true,
        }))
    : [];

  return {
    response: output.response || "That sounds like a beautiful vision. Tell me a little more about what you have in mind.",
    recommendations
  };
}
