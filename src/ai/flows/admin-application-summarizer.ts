'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating an AI-powered summary of new vendor applications.
 *
 * - summarizeVendorApplication - A function that handles the vendor application summarization process.
 * - AdminApplicationSummarizerInput - The input type for the summarizeVendorApplication function.
 * - AdminApplicationSummarizerOutput - The return type for the summarizeVendorApplication function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AdminApplicationSummarizerInputSchema = z.object({
  businessName: z.string().describe("The name of the vendor's business."),
  businessCategory: z.string().describe("The primary category of the vendor's services (e.g., 'Wedding Photographer', 'Event Venue')."),
  businessDescription: z.string().describe("A detailed description of the vendor's business, including services, style, and unique selling points."),
  contactPerson: z.string().optional().describe("The name of the primary contact person for the business."),
  contactEmail: z.string().email().optional().describe("The contact email address for the business."),
  contactPhone: z.string().optional().describe("The contact phone number for the business."),
  website: z.string().url().optional().describe("The official website URL for the business."),
  socialMediaLinks: z.array(z.string().url()).optional().describe("A list of social media links for the business."),
  howDidYouHear: z.string().optional().describe("How the vendor heard about InFaith Journey."),
});
export type AdminApplicationSummarizerInput = z.infer<typeof AdminApplicationSummarizerInputSchema>;

const AdminApplicationSummarizerOutputSchema = z.object({
  summary: z.string().describe("A concise AI-generated summary of the vendor application, highlighting key aspects."),
  businessType: z.string().describe("The identified type or category of the vendor's business."),
  servicesOverview: z.string().describe("A summary of the main services offered by the vendor."),
  keyInformation: z.array(z.string()).describe("A list of other important or unique details extracted from the application."),
});
export type AdminApplicationSummarizerOutput = z.infer<typeof AdminApplicationSummarizerOutputSchema>;

export async function summarizeVendorApplication(input: AdminApplicationSummarizerInput): Promise<AdminApplicationSummarizerOutput> {
  return adminApplicationSummarizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminApplicationSummarizerPrompt',
  input: { schema: AdminApplicationSummarizerInputSchema },
  output: { schema: AdminApplicationSummarizerOutputSchema },
  prompt: `You are an AI assistant for InFaith Journey, a premium wedding vendor marketplace.
Your task is to summarize new vendor applications for an admin, Ricardo, to efficiently review them.
Provide a concise summary, highlighting the business type, main services, and any other crucial information.

Here is the vendor application details:
Business Name: {{{businessName}}}
Category: {{{businessCategory}}}
Description: {{{businessDescription}}}
{{#if contactPerson}}Contact Person: {{{contactPerson}}}{{/if}}
{{#if contactEmail}}Contact Email: {{{contactEmail}}}{{/if}}
{{#if contactPhone}}Contact Phone: {{{contactPhone}}}{{/if}}
{{#if website}}Website: {{{website}}}{{/if}}
{{#if socialMediaLinks}}Social Media: {{#each socialMediaLinks}}{{{this}}} {{/each}}{{/if}}
{{#if howDidYouHear}}How they heard about us: {{{howDidYouHear}}}{{/if}}

Based on the information above, generate a summary that adheres to the following structure:
`,
});

const adminApplicationSummarizerFlow = ai.defineFlow(
  {
    name: 'adminApplicationSummarizerFlow',
    inputSchema: AdminApplicationSummarizerInputSchema,
    outputSchema: AdminApplicationSummarizerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate summary.');
    }
    return output;
  }
);
