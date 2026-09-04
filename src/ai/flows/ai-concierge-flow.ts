/**
 * @fileOverview AI Wedding Concierge Flow (Finalized Phase 2)
 * 
 * This flow intelligently parses user queries and prioritizes Featured Vendors.
 */

import { ELITE_VENDORS } from '@/lib/vendors';
import { z } from 'zod';

export const AIConciergeInputSchema = z.object({
  message: z.string().trim().min(1).max(1_000),
  history: z.array(z.object({
    role: z.enum(['ai', 'user']),
    content: z.string().trim().min(1).max(2_000)
  })).max(12).optional()
});

const CONCIERGE_INSTRUCTIONS = `You are the InFaith Journey AI Concierge, an expert wedding planning partner for high-end couples in South Africa.
Your tone is luxurious, encouraging, and deeply romantic.

Look for these details in the conversation:
- Budget (e.g., R100k)
- Location (Cape Town, Stellenbosch, etc.)
- Style (Romantic, Minimalist, etc.)
- Guest Count

Guidelines:
1. Always be romantic and encouraging.
2. Answer general wedding-planning questions naturally; do not force a vendor recommendation into every reply.
3. Ask one useful follow-up question when important details are missing.
4. Never invent a vendor, price, availability, booking, or factual claim. Vendor cards are selected separately from the marketplace data available to the application.
5. Keep responses focused and conversational, normally under 180 words.`;

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
};

async function generateConciergeReply(input: z.infer<typeof AIConciergeInputSchema>) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured.');

  const contents = [
    ...(input.history ?? []).map(message => ({
      role: message.role === 'ai' ? 'model' : 'user',
      parts: [{ text: message.content }],
    })),
    { role: 'user', parts: [{ text: input.message }] },
  ];

  // Call Gemini directly. This avoids the Genkit development-server action
  // discovery path that can fail under Next/Turbopack with "Unknown action type".
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: CONCIERGE_INSTRUCTIONS }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${detail.slice(0, 500)}`);
  }

  const result = await response.json() as GeminiResponse;
  const reply = result.candidates?.[0]?.content?.parts
    ?.map(part => part.text ?? '')
    .join('')
    .trim();
  if (!reply) throw new Error('Gemini returned an empty concierge response.');
  return reply;
}

export async function aiConciergeFlow(input: z.infer<typeof AIConciergeInputSchema>) {
  const validatedInput = AIConciergeInputSchema.parse(input);
  const response = await generateConciergeReply(validatedInput);

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
    response,
    recommendations
  };
}
