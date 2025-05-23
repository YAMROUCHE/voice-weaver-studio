// Summarize the call and store the summary in Firestore.
'use server';
/**
 * @fileOverview Résume un appel après sa fin. Conçu pour un contexte immobilier.
 *
 * - summarizeCall - Une fonction qui gère le processus de résumé d'appel.
 * - SummarizeCallInput - Le type d'entrée pour la fonction summarizeCall.
 * - SummarizeCallOutput - Le type de retour pour la fonction summarizeCall.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCallInputSchema = z.object({
  transcription: z.string().describe('La transcription de l\'appel.'),
  audioUrl: z.string().optional().describe('L\'URL de l\'enregistrement audio de l\'appel.'),
  callerPhoneNumber: z.string().optional().describe('Numéro de téléphone de l\'appelant.'),
});
export type SummarizeCallInput = z.infer<typeof SummarizeCallInputSchema>;

const SummarizeCallOutputSchema = z.object({
  summary: z.string().describe('Un résumé de l\'appel.'),
  keywords: z.array(z.string()).describe('Mots-clés importants de l\'appel (ex: type de bien, quartier, budget).'),
  actionItems: z.array(z.string()).optional().describe('Actions à entreprendre suite à l\'appel.'),
  sentiment: z.enum(["positif", "neutre", "négatif"]).optional().describe('Sentiment général de l\'appelant.'),
});
export type SummarizeCallOutput = z.infer<typeof SummarizeCallOutputSchema>;

export async function summarizeCall(input: SummarizeCallInput): Promise<SummarizeCallOutput> {
  return summarizeCallFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCallPrompt',
  input: {schema: SummarizeCallInputSchema},
  output: {schema: SummarizeCallOutputSchema},
  model: 'googleai/gemini-2.0-flash',
  prompt: `Vous êtes un expert en résumé d'appels téléphoniques pour une agence immobilière.
  Veuillez résumer la transcription de l'appel suivante.
  Incluez les sujets clés (type de bien recherché, budget, quartier, etc.), les actions à entreprendre (planifier une visite, envoyer des informations), et les décisions prises.
  Identifiez également les mots-clés importants et le sentiment général de l'appelant.

  {{#if callerPhoneNumber}}Appelant: {{{callerPhoneNumber}}}{{/if}}
  Transcription: {{{transcription}}}
  `,
});

const summarizeCallFlow = ai.defineFlow(
  {
    name: 'summarizeCallFlow',
    inputSchema: SummarizeCallInputSchema,
    outputSchema: SummarizeCallOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
