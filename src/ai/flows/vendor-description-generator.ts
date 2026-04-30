'use server';
/**
 * @fileOverview A Genkit flow for generating compelling and SEO-optimized business descriptions for wedding vendors.
 *
 * - generateVendorDescription - A function that handles the business description generation process.
 * - VendorDescriptionGeneratorInput - The input type for the generateVendorDescription function.
 * - VendorDescriptionGeneratorOutput - The return type for the generateVendorDescription function (the generated description string).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VendorDescriptionGeneratorInputSchema = z.object({
  businessName: z.string().describe("The name of the vendor's business."),
  category: z.string().describe("The primary category of the vendor (e.g., 'Wedding Photographer', 'Wedding Venue', 'Floral Designer')."),
  location: z.string().describe("The primary service location of the vendor (e.g., 'Cape Town', 'Johannesburg', 'Stellenbosch')."),
  keyServices: z.string().describe('A comma-separated list or brief description of the vendor\'s key services and specialties.'),
  uniqueSellingPoints: z.string().describe('What makes this vendor unique or stand out from competitors.'),
  targetAudienceVibe: z.string().describe('A description of the ideal client or wedding style the vendor caters to (e.g., 'luxury and romance', 'rustic charm', 'modern elegance').'),
});
export type VendorDescriptionGeneratorInput = z.infer<typeof VendorDescriptionGeneratorInputSchema>;

const VendorDescriptionGeneratorOutputSchema = z.string().describe('A compelling and SEO-optimized business description for the vendor.');
export type VendorDescriptionGeneratorOutput = z.infer<typeof VendorDescriptionGeneratorOutputSchema>;

export async function generateVendorDescription(input: VendorDescriptionGeneratorInput): Promise<VendorDescriptionGeneratorOutput> {
  return vendorDescriptionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'vendorDescriptionGeneratorPrompt',
  input: { schema: VendorDescriptionGeneratorInputSchema },
  output: { schema: VendorDescriptionGeneratorOutputSchema },
  prompt: `You are a skilled marketing copywriter for 'InFaith Journey', a premium, luxurious wedding vendor marketplace focused on romantic South African weddings. Your task is to craft a compelling and SEO-optimized business description for a vendor based on the following details. The description should be engaging, highlight their unique offerings, and resonate with couples seeking a high-end, romantic wedding experience. Incorporate relevant keywords naturally for search engines to improve visibility within the South African wedding market (e.g., wedding photography Cape Town, luxury wedding venue Johannesburg, bespoke floral design Stellenbosch). Focus on the brand's aesthetic: luxurious, feminine, spacious, and romantic.

Business Name: {{{businessName}}}
Category: {{{category}}}
Location: {{{location}}}
Key Services/Specialties: {{{keyServices}}}
Unique Selling Points: {{{uniqueSellingPoints}}}
Target Audience/Vibe: {{{targetAudienceVibe}}}`,
});

const vendorDescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'vendorDescriptionGeneratorFlow',
    inputSchema: VendorDescriptionGeneratorInputSchema,
    outputSchema: VendorDescriptionGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate vendor description.');
    }
    return output;
  }
);
