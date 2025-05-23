'use server';
/**
 * @fileOverview Génère un score de prospect pour chaque appel en fonction de la conversation.
 *
 * - generateLeadScore - Une fonction qui gère le processus de génération de score de prospect.
 * - GenerateLeadScoreInput - Le type d'entrée pour la fonction generateLeadScore.
 * - GenerateLeadScoreOutput - Le type de retour pour la fonction generateLeadScore.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLeadScoreInputSchema = z.object({
  transcript: z.string().describe('La transcription de l\'appel.'),
  callSummary: z.string().optional().describe('Le résumé de l\'appel.'),
});
export type GenerateLeadScoreInput = z.infer<typeof GenerateLeadScoreInputSchema>;

const GenerateLeadScoreOutputSchema = z.object({
  leadScore: z.number().min(0).max(100).describe('Le score du prospect, de 0 à 100, indiquant la probabilité de conversion.'),
  reason: z.string().describe('La raison du score attribué.'),
  potentialNeeds: z.array(z.string()).optional().describe('Besoins potentiels identifiés (ex: "3 chambres", "jardin", "proche écoles").'),
});
export type GenerateLeadScoreOutput = z.infer<typeof GenerateLeadScoreOutputSchema>;

export async function generateLeadScore(input: GenerateLeadScoreInput): Promise<GenerateLeadScoreOutput> {
  return generateLeadScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLeadScorePrompt',
  input: {schema: GenerateLeadScoreInputSchema},
  output: {schema: GenerateLeadScoreOutputSchema},
  model: 'googleai/gemini-2.0-flash',
  prompt: `Vous êtes un expert en IA analysant les transcriptions et résumés d'appels pour une agence immobilière afin de générer un score de prospect.

  En vous basant sur la transcription et le résumé fournis, déterminez un score de prospect de 0 à 100, où 0 indique une très faible probabilité de conversion et 100 une très forte probabilité.
  Fournissez également une raison pour le score attribué et identifiez les besoins potentiels exprimés par l'appelant (type de bien, nombre de chambres, quartier, budget approximatif, etc.).

  Transcription: {{{transcript}}}
  {{#if callSummary}}
  Résumé de l'appel: {{{callSummary}}}
  {{/if}}
  `,
});

const generateLeadScoreFlow = ai.defineFlow(
  {
    name: 'generateLeadScoreFlow',
    inputSchema: GenerateLeadScoreInputSchema,
    outputSchema: GenerateLeadScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
