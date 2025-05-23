
'use server';
/**
 * @fileOverview coccinelle.ai: Gère un segment de parole durant un appel.
 * Ce flux transcrit le segment audio, interagit avec GPT-4 en utilisant le contexte
 * de la conversation, génère une réponse, la synthétise en audio, et met à jour
 * la transcription de l'appel.
 *
 * - handleSpeechSegment - Fonction principale pour traiter un segment de parole.
 * - SpeechSegmentInput - Type d'entrée pour handleSpeechSegment.
 * - SpeechSegmentOutput - Type de retour pour handleSpeechSegment.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
// import { firestore } from '@/lib/firebase-admin'; // Pour mettre à jour la transcription dans Firestore

export const SpeechSegmentInputSchema = z.object({
  callDocId: z.string().describe("ID du document de l'appel dans Firestore."),
  companyId: z.string().describe("ID de l'entreprise pour contextualiser la recherche d'informations (RAG)."),
  audioDataUri: z.string().describe("Segment audio de la parole de l'utilisateur sous forme d'URI de données (format: 'data:<mimetype>;base64,<encoded_data>')."),
  currentCallTranscript: z.string().optional().describe("Transcription complète de l'appel jusqu'à présent."),
  conversationHistorySummary: z.string().optional().describe("Résumé des points clés de la conversation jusqu'à présent."),
  agentSystemPrompt: z.string().describe("Prompt système de l'agent IA (peut inclure des instructions spécifiques, RAG context)."),
});
export type SpeechSegmentInput = z.infer<typeof SpeechSegmentInputSchema>;

export const SpeechSegmentOutputSchema = z.object({
  responseTextToSynthesize: z.string().describe("Texte de la réponse générée par l'IA, à synthétiser en audio."),
  fullUpdatedTranscript: z.string().describe("Transcription complète de l'appel, incluant le nouveau segment et la réponse de l'IA."),
  updatedConversationSummary: z.string().optional().describe("Résumé mis à jour de la conversation."),
  actionRequired: z.enum(['continue_conversation', 'end_call', 'transfer_call', 'schedule_appointment']).optional().describe("Action suggérée par l'IA."),
});
export type SpeechSegmentOutput = z.infer<typeof SpeechSegmentOutputSchema>;

export async function handleSpeechSegment(input: SpeechSegmentInput): Promise<SpeechSegmentOutput> {
  return onSpeechSegmentFlow(input);
}

// Prompt pour la transcription et la génération de réponse
// Ce prompt est une simulation ; dans la réalité, il pourrait y avoir plusieurs appels LLM
// ou des outils pour la transcription et le RAG.
const speechInteractionPrompt = ai.definePrompt({
  name: 'coccinelleSpeechInteractionPrompt',
  input: { schema: z.object({
    systemPrompt: z.string(),
    userAudio: z.string().describe("Audio de l'utilisateur, format: 'data:<mimetype>;base64,<encoded_data>'."),
    currentTranscript: z.string().optional(),
    conversationSummary: z.string().optional(),
  })},
  output: { schema: z.object({
    transcribedUserSpeech: z.string().describe("Transcription de l'audio de l'utilisateur."),
    aiResponseText: z.string().describe("Réponse textuelle de l'IA à l'utilisateur."),
    newSummary: z.string().optional().describe("Nouveau résumé de la conversation."),
    action: z.enum(['continue', 'end', 'transfer', 'schedule']).optional().describe("Action suggérée."),
  })},
  model: 'googleai/gemini-2.0-flash', // Utiliser un modèle capable de traiter l'audio et le texte (ex: Gemini Pro)
                                 // Pour une vraie implémentation :
                                 // 1. Whisper API pour audio -> texte
                                 // 2. GPT-4 (ou autre LLM) pour texte -> texte (réponse) avec RAG
                                 // 3. XTTS/ElevenLabs pour texte -> audio (synthèse)
  prompt: `{{{systemPrompt}}}

  {{#if conversationSummary}}
  Voici un résumé de la conversation jusqu'à présent :
  {{{conversationSummary}}}
  {{/if}}

  {{#if currentTranscript}}
  Transcription actuelle de l'appel :
  {{{currentTranscript}}}
  --- Fin de la transcription actuelle ---
  {{/if}}

  Nouveau segment audio de l'utilisateur : {{media url=userAudio}}

  Instructions:
  1. Transcrivez le nouveau segment audio de l'utilisateur.
  2. En vous basant sur la transcription complète (ancienne + nouvelle) et le contexte, générez une réponse appropriée.
  3. Fournissez un bref résumé mis à jour de la conversation si pertinent.
  4. Suggérez une action (continue, end, transfer, schedule) si une décision claire peut être prise.

  Votre réponse doit être concise et viser à atteindre les objectifs définis dans le prompt système.
  Ne répétez pas "Voici la transcription" ou "Voici la réponse". Fournissez directement les valeurs.
  Si l'audio est inaudible ou vide, indiquez-le dans la transcription et demandez à l'utilisateur de répéter.
  `,
});


const onSpeechSegmentFlow = ai.defineFlow(
  {
    name: 'coccinelleOnSpeechSegmentFlow',
    inputSchema: SpeechSegmentInputSchema,
    outputSchema: SpeechSegmentOutputSchema,
  },
  async (input) => {
    console.log('[coccinelleOnSpeechSegmentFlow] Traitement du segment audio pour l\'appel ID:', input.callDocId);

    // Étape 1 & 2: Transcrire l'audio et générer une réponse avec l'IA (simulation combinée)
    // Idéalement, la transcription (Whisper) et la génération de réponse (GPT-4 + RAG) sont des étapes séparées.
    // Le RAG impliquerait de récupérer des documents de `datasets` ou `memory` basés sur `companyId` et le contexte.

    // Simulation d'un appel à un modèle multimodal ou à une chaîne de services
    const { output: interactionResult } = await speechInteractionPrompt({
      systemPrompt: input.agentSystemPrompt,
      userAudio: input.audioDataUri,
      currentTranscript: input.currentCallTranscript,
      conversationSummary: input.conversationHistorySummary,
    });

    if (!interactionResult) {
      console.error('[coccinelleOnSpeechSegmentFlow] Erreur: Aucune sortie du prompt speechInteractionPrompt.');
      // Gérer le cas d'erreur, peut-être une réponse par défaut
      return {
        responseTextToSynthesize: "Je suis désolé, je n'ai pas pu traiter votre demande. Pouvez-vous répéter ?",
        fullUpdatedTranscript: input.currentCallTranscript || "",
      };
    }

    const transcribedUserSpeech = interactionResult.transcribedUserSpeech || "Segment audio non transcrit.";
    const aiResponseText = interactionResult.aiResponseText || "Je n'ai pas bien compris, pourriez-vous reformuler s'il vous plaît ?";
    
    console.log(`[coccinelleOnSpeechSegmentFlow] Segment utilisateur transcrit: "${transcribedUserSpeech}"`);
    console.log(`[coccinelleOnSpeechSegmentFlow] Réponse IA générée: "${aiResponseText}"`);

    // Étape 3: Mettre à jour la transcription complète dans Firestore (simulation)
    const fullUpdatedTranscript = `${input.currentCallTranscript || ''}\nUtilisateur: ${transcribedUserSpeech}\nAssistant: ${aiResponseText}`;
    
    // try {
    //   await firestore.collection('calls').doc(input.callDocId).update({
    //     transcript: fullUpdatedTranscript,
    //     // Mettre à jour d'autres champs si nécessaire, comme lastUpdatedAt
    //   });
    //   console.log(`[coccinelleOnSpeechSegmentFlow] Transcription mise à jour dans Firestore pour l'appel ID: ${input.callDocId}`);
    // } catch (error) {
    //   console.error(`[coccinelleOnSpeechSegmentFlow] Erreur lors de la mise à jour de Firestore pour l'appel ID ${input.callDocId}:`, error);
    // }
    
    // Étape 4: La synthèse vocale de `responseTextToSynthesize` sera gérée par le système appelant (ex: Twilio TwiML).

    let actionRequired: SpeechSegmentOutput['actionRequired'] = undefined;
    if (interactionResult.action) {
        switch(interactionResult.action) {
            case 'end': actionRequired = 'end_call'; break;
            case 'transfer': actionRequired = 'transfer_call'; break;
            case 'schedule': actionRequired = 'schedule_appointment'; break;
            default: actionRequired = 'continue_conversation'; break;
        }
    }


    return {
      responseTextToSynthesize: aiResponseText,
      fullUpdatedTranscript: fullUpdatedTranscript,
      updatedConversationSummary: interactionResult.newSummary || input.conversationHistorySummary,
      actionRequired: actionRequired,
    };
  }
);
