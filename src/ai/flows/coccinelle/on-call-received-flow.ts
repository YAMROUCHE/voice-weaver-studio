
'use server';
/**
 * @fileOverview coccinelle.ai: Gère la réception d'un appel entrant via Twilio.
 * NOTE: Ce flux est susceptible d'être déprécié ou largement refactorisé au profit
 * de `on-call-start-flow.ts` pour l'initialisation et `on-speech-segment-flow.ts`
 * pour la gestion des interactions vocales.
 *
 * Ce flux est responsable de la transcription de l'audio, de l'interaction avec GPT-4
 * pour générer une réponse contextuelle, de la synthèse vocale de cette réponse,
 * et de l'enregistrement initial des données de l'appel.
 *
 * - handleIncomingCall - Fonction principale pour traiter un appel reçu.
 * - IncomingCallInput - Type d'entrée pour handleIncomingCall.
 * - IncomingCallOutput - Type de retour pour handleIncomingCall.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
// import { CallDirection } from '@/lib/types'; // Assuming types for call direction etc.

// Placeholder for Twilio, Whisper, OpenAI, XTTS/ElevenLabs service calls
// import { transcribeAudioWithWhisper } from '@/services/openai';
// import { synthesizeSpeech } from '@/services/tts'; // (XTTS or ElevenLabs)
// import { getOpenAIResponse } from '@/services/openai';
// import { saveCallInitialData } from '@/services/firestore'; // To save to 'calls' collection

const IncomingCallInputSchema = z.object({
  companyId: z.string().describe("ID de l'entreprise pour laquelle l'appel est traité."),
  twilioCallSid: z.string().describe('ID de l\'appel Twilio.'),
  fromPhoneNumber: z.string().describe('Numéro de téléphone de l\'appelant.'),
  toPhoneNumber: z.string().describe('Numéro de téléphone coccinelle.ai appelé.'),
  audioDataUri: z.string().optional().describe("Optionnel: Premiers segments audio de l'appelant sous forme d'URI de données (si fourni par Twilio event stream). Format attendu : 'data:<mimetype>;base64,<encoded_data>'."),
  agentId: z.string().optional().describe("ID de l'agent coccinelle.ai configuré pour ce numéro."),
});
export type IncomingCallInput = z.infer<typeof IncomingCallInputSchema>;

const IncomingCallOutputSchema = z.object({
  callDocId: z.string().describe("ID de l'appel interne (pourrait être le même que Twilio SID ou un ID Firestore)."),
  responseAudioDataUri: z.string().describe("Réponse audio synthétisée à jouer à l'appelant. Format: 'data:audio/wav;base64,<encoded_data>'."),
  // Champs maintenant gérés par onCallStartFlow et onSpeechSegmentFlow
  // initialTranscript: z.string().optional().describe('Transcription du premier segment audio, si disponible.'),
  // initialSummary: z.string().optional().describe('Résumé initial basé sur la première interaction.'),
});
export type IncomingCallOutput = z.infer<typeof IncomingCallOutputSchema>;

export async function handleIncomingCall(input: IncomingCallInput): Promise<IncomingCallOutput> {
  return onCallReceivedFlow(input);
}

// This prompt is for the AI to generate a response based on transcription
// Note: This interaction logic is better suited for onSpeechSegmentFlow.ts
const generateResponsePrompt = ai.definePrompt({
  name: 'coccinelleLegacyCallResponsePrompt', // Renamed to avoid conflict
  input: { schema: z.object({ transcript: z.string(), agentSystemPrompt: z.string().optional(), companyContext: z.string().optional() }) },
  output: { schema: z.object({responseText: z.string().describe("Texte de la réponse à synthétiser.") }) },
  model: 'googleai/gemini-2.0-flash', // Placeholder
  prompt: `{{{agentSystemPrompt}}}
  Contexte de l'entreprise: {{{companyContext}}}

  Le client a dit: "{{{transcript}}}"
  
  Votre réponse (polie, concise, orientée qualification et prise de RDV immobilier):`,
});


const onCallReceivedFlow = ai.defineFlow(
  {
    name: 'coccinelleOnCallReceivedFlow',
    inputSchema: IncomingCallInputSchema,
    outputSchema: IncomingCallOutputSchema,
  },
  async (input) => {
    console.warn('[coccinelleOnCallReceivedFlow] ATTENTION: Ce flux est en cours de dépréciation. Utilisez onCallStartFlow et onSpeechSegmentFlow.');
    console.log('[coccinelleOnCallReceivedFlow] Début du flux pour l\'appel:', input.twilioCallSid);

    // Étape 1: Appel à onCallStartFlow pour initialiser l'appel
    // Ceci est une simulation de comment onCallStartFlow serait appelé.
    // Les vrais paramètres seraient passés ici.
    const callStartInputSim = {
      companyId: input.companyId,
      twilioCallSid: input.twilioCallSid,
      direction: 'incoming' as const,
      fromPhoneNumber: input.fromPhoneNumber,
      toPhoneNumber: input.toPhoneNumber,
      agentId: input.agentId,
    };
    // const callStartResult = await handleCallStart(callStartInputSim); // Appel réel au nouveau flux
    const callStartResult = { // Simulation du retour de onCallStartFlow
        callDocId: `sim_call_${input.twilioCallSid}`,
        initialSystemPrompt: `Assistant pour ${input.companyId}. But: qualifier et RDV.`,
        voiceConfig: { provider: 'xtts' as const, voiceId: 'default-fr' }
    };
    console.log('[coccinelleOnCallReceivedFlow] Appel initialisé (simulation via onCallStartFlow), ID Doc:', callStartResult.callDocId);

    let transcript = "Bonjour, je voudrais des informations."; // Placeholder
    if (input.audioDataUri) {
      // Simulation de la transcription
      // transcript = await transcribeAudioWithWhisper(input.audioDataUri);
      console.log('[coccinelleOnCallReceivedFlow] Audio initial transcrit (simulation):', transcript);
    }

    // Étape 2: Générer une réponse initiale (logique déplacée vers onSpeechSegmentFlow)
    // const { output: gptOutput } = await generateResponsePrompt({
    //   transcript,
    //   agentSystemPrompt: callStartResult.initialSystemPrompt,
    //   companyContext: `Contexte spécifique pour ${input.companyId}`
    // });
    // const responseText = gptOutput?.responseText || "Bonjour, comment puis-je vous aider ?";
    const responseText = "Bonjour, c'est l'assistant coccinelle.ai, comment puis-je vous aider aujourd'hui ?"; // Réponse initiale simple
    console.log('[coccinelleOnCallReceivedFlow] Réponse texte initiale générée (simulation):', responseText);

    // Étape 3: Synthétiser la réponse (XTTS ou ElevenLabs)
    // const responseAudioDataUri = await synthesizeSpeech(responseText, callStartResult.voiceConfig);
    const responseAudioDataUri = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="; // Placeholder: Empty WAV
    console.log('[coccinelleOnCallReceivedFlow] Réponse audio synthétisée (simulation).');


    // La mise à jour de la transcription/summary est maintenant gérée par onSpeechSegmentFlow et onCallEndedFlow.
    return {
      callDocId: callStartResult.callDocId,
      responseAudioDataUri: responseAudioDataUri,
    };
  }
);

