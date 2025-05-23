// src/ai/flows/answer-call.ts
'use server';

/**
 * @fileOverview Ce fichier définit le flux answerCall, qui gère la réponse aux appels,
 * la transcription audio, la génération d'une réponse contextuelle et la vocalisation
 * de cette réponse à l'appelant.
 *
 * @exports answerCall - La fonction principale pour initier le processus de réponse à l'appel.
 * @exports AnswerCallInput - Le type d'entrée pour la fonction answerCall.
 * @exports AnswerCallOutput - Le type de sortie pour la fonction answerCall.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerCallInputSchema = z.object({
  audioDataUri: z.string().describe("Données audio de la voix de l'appelant sous forme d'URI de données qui doit inclure un type MIME et utiliser l'encodage Base64. Format attendu : 'data:<mimetype>;base64,<encoded_data>'."),
  systemPrompt: z.string().optional().describe("Prompt système optionnel pour guider l'IA."),
  phoneNumber: z.string().optional().describe("Numéro de téléphone de l'appelant."),
});
export type AnswerCallInput = z.infer<typeof AnswerCallInputSchema>;

const AnswerCallOutputSchema = z.object({
  spokenResponse: z.string().describe('La réponse générée par l\'IA, vocalisée à l\'aide d\'un modèle de synthèse vocale.'),
  transcription: z.string().describe('La transcription de l\'audio de l\'appelant.'),
  summary: z.string().describe('Résumé de l\'appel.'),
  // Adding fields for real estate context
  leadStatus: z.string().optional().describe('Statut du prospect (ex: Chaud, Tiède, Froid).'),
  appointmentScheduled: z.boolean().optional().describe('Indique si un RDV a été programmé.'),
});
export type AnswerCallOutput = z.infer<typeof AnswerCallOutputSchema>;

export async function answerCall(input: AnswerCallInput): Promise<AnswerCallOutput> {
  return answerCallFlow(input);
}

const answerCallPrompt = ai.definePrompt({
  name: 'answerCallPrompt',
  input: {schema: AnswerCallInputSchema},
  output: {schema: AnswerCallOutputSchema},
  model: 'googleai/gemini-2.0-flash', // Explicitly set model
  prompt: `{{#if systemPrompt}}{{{systemPrompt}}}{{else}}Vous êtes un assistant IA serviable répondant à un appel téléphonique pour une agence immobilière. Soyez poli, concis et cherchez à qualifier le prospect ou à planifier une visite si pertinent.{{/if}}

  Transcrivez l'audio suivant, générez une réponse contextuelle et créez un résumé de l'appel.
  Si l'appelant exprime un intérêt clair pour un bien ou une visite, essayez de déterminer un statut de prospect (Chaud, Tiède, Froid) et indiquez si un RDV pourrait être programmé.

  Numéro de l'appelant: {{#if phoneNumber}}{{{phoneNumber}}}{{else}}Non fourni{{/if}}
  Audio: {{media url=audioDataUri}}
  `,
});

const answerCallFlow = ai.defineFlow(
  {
    name: 'answerCallFlow',
    inputSchema: AnswerCallInputSchema,
    outputSchema: AnswerCallOutputSchema,
  },
  async input => {
    const {output} = await answerCallPrompt(input);
    // Basic logic placeholder for leadStatus and appointmentScheduled
    // A more complex logic or tool use would be needed in a real scenario
    let finalOutput = output!;
    if (output?.summary.toLowerCase().includes('visite') || output?.summary.toLowerCase().includes('rendez-vous')) {
      finalOutput = {
        ...output!,
        leadStatus: output?.leadStatus || 'Tiède',
        appointmentScheduled: output?.appointmentScheduled || true,
      };
    }
    return finalOutput;
  }
);
