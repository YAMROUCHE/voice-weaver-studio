
'use server';
/**
 * @fileOverview coccinelle.ai: Gère le démarrage d'un appel (entrant ou sortant).
 * Ce flux est responsable de l'initialisation de l'appel dans Firestore,
 * de la récupération de la configuration de l'agent (prompt, voix) et
 * de la génération de la réponse TwiML initiale pour Twilio.
 *
 * - handleCallStart - Fonction principale (wrapper pour le flux Genkit).
 * - TwilioWebhookInputSchema - Schéma d'entrée pour les données du webhook Twilio.
 * - OnCallStartFlowOutput - Type de retour (TwiML string).
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { generateInitialResponseTwiml } from '@/services/twimlService';
import { 
  getTwilioNumberConfig, 
  getAgentConfig, 
  findLeadByPhoneNumber, 
  saveInitialCall 
} from '@/services/firestoreService';
// import { Timestamp } from 'firebase-admin/firestore'; // Activer si Firebase Admin SDK est configuré

// Schéma d'entrée basé sur les paramètres courants de Twilio Voice Webhook
// Voir: https://www.twilio.com/docs/voice/twiml#request-parameters
export const TwilioWebhookInputSchema = z.object({
  CallSid: z.string().describe("ID de l'appel Twilio unique."),
  AccountSid: z.string().describe("ID du compte Twilio."),
  From: z.string().describe("Numéro de téléphone de l'appelant."),
  To: z.string().describe("Numéro de téléphone Twilio appelé."),
  CallStatus: z.string().describe("Statut de l'appel (ex: 'ringing', 'in-progress')."),
  Direction: z.enum(['inbound', 'outbound-api', 'outbound-dial']).describe("Direction de l'appel."),
  // Ajouter d'autres paramètres Twilio si nécessaire (FromCity, FromState, etc.)
});
export type TwilioWebhookInput = z.infer<typeof TwilioWebhookInputSchema>;

// Le flux doit retourner une chaîne TwiML
export type OnCallStartFlowOutput = string; 

// Fonction principale exportée qui appelle le flux Genkit
// Genkit s'attend à ce que cette fonction retourne la sortie brute (string pour TwiML).
export async function handleCallStart(input: TwilioWebhookInput): Promise<OnCallStartFlowOutput> {
  return onCallStartFlow(input);
}

const onCallStartFlow = ai.defineFlow(
  {
    name: 'coccinelleOnCallStartFlow',
    inputSchema: TwilioWebhookInputSchema,
    outputSchema: z.string().describe("Réponse TwiML pour Twilio."), // TwiML est une chaîne XML
    // Configuration pour que Genkit expose ce flux comme un endpoint HTTP
    // adapté pour les webhooks Twilio.
    // Par défaut, Genkit utilise application/json. Twilio attend application/xml.
    // Nous gérons cela en retournant une string et en configurant l'entête Content-Type
    // via la fonction Cloud elle-même ou la configuration du déploiement Genkit.
    // Pour l'instant, Genkit retournera du JSON contenant la string TwiML.
    // Une étape de configuration de la fonction Cloud sera nécessaire pour fixer le Content-Type.
  },
  async (input) => {
    console.log('[coccinelleOnCallStartFlow] Démarrage du flux pour l\'appel SID:', input.CallSid);
    console.log('[coccinelleOnCallStartFlow] Données Twilio reçues:', input);

    // 1. Déterminer companyId et agentId à partir du numéro Twilio appelé (input.To)
    const numberConfig = await getTwilioNumberConfig(input.To);
    if (!numberConfig) {
      console.error(`[coccinelleOnCallStartFlow] Aucune configuration trouvée pour le numéro Twilio: ${input.To}`);
      // Répondre avec un TwiML d'erreur ou raccrocher poliment
      return '<Response><Say language="fr-FR">Désolé, une erreur technique est survenue. Veuillez réessayer plus tard.</Say><Hangup/></Response>';
    }
    const { companyId, agentId } = numberConfig;
    console.log(`[coccinelleOnCallStartFlow] CompanyId: ${companyId}, AgentId: ${agentId}`);

    // 2. Récupérer la configuration de l'agent (prompt, voix, message d'accueil)
    const agentConfig = await getAgentConfig(agentId);
    if (!agentConfig) {
      console.error(`[coccinelleOnCallStartFlow] Aucune configuration trouvée pour l'agent ID: ${agentId}`);
      return '<Response><Say language="fr-FR">Désolé, l\'agent vocal n\'est pas correctement configuré.</Say><Hangup/></Response>';
    }
    console.log('[coccinelleOnCallStartFlow] Configuration de l\'agent récupérée.');

    // 3. Rechercher un prospect existant avec le numéro de l'appelant (input.From)
    const existingLead = await findLeadByPhoneNumber(input.From, companyId);
    const leadId = existingLead?.id;
    if (existingLead) {
      console.log(`[coccinelleOnCallStartFlow] Prospect existant trouvé, ID: ${leadId}`);
    } else {
      console.log(`[coccinelleOnCallStartFlow] Aucun prospect existant trouvé pour: ${input.From}`);
    }

    // 4. Enregistrer les données initiales de l'appel dans Firestore
    const callDataToSave = {
      twilioCallSid: input.CallSid,
      companyId,
      agentId,
      userId: agentId, // L'agent IA est l'utilisateur pour cet appel
      leadId: leadId || null,
      direction: input.Direction,
      fromPhoneNumber: input.From,
      toPhoneNumber: input.To,
      status: input.CallStatus, // ou 'initiated'
      timestamp: new Date(), // Ou admin.firestore.Timestamp.now() pour serverTimestamp
      transcript: '', // Initialisé à vide
      summary: '',    // Initialisé à vide
      duration: 0,
      rawTwilioInput: input, // Sauvegarder les données brutes de Twilio pour débogage/audit
    };
    const callDocId = await saveInitialCall(callDataToSave);
    console.log(`[coccinelleOnCallStartFlow] Appel initial enregistré, Doc ID: ${callDocId}`);

    // 5. Générer la réponse TwiML initiale
    // L'URL de l'action pour <Gather> doit pointer vers le webhook de onSpeechSegmentFlow
    // et inclure callDocId pour contextualiser les segments de parole.
    // Note: l'URL exacte du flux onSpeechSegmentFlow dépendra de son déploiement.
    // Elle pourrait être construite dynamiquement ou récupérée depuis une variable d'environnement.
    // Exemple: `${process.env.FUNCTION_BASE_URL}/coccinelleOnSpeechSegmentFlow?callDocId=${callDocId}`
    // Pour l'instant, utilisons un chemin relatif pour les tests locaux avec Genkit start.
    // Ce chemin sera de la forme /api/genkit/flows/NOM_DU_FLUX_ONSPEECHSEGMENT
    const speechSegmentActionUrl = `/api/genkit/flows/coccinelleOnSpeechSegmentFlow?callDocId=${callDocId}&companyId=${companyId}&agentId=${agentId}`;

    const twimlResponse = generateInitialResponseTwiml({
      greeting: agentConfig.initialGreetingIncoming,
      voice: agentConfig.voiceId, // Adapter pour le format attendu par <Say> (ex: 'Polly.Mathieu-FR', 'alice')
      language: 'fr-FR',
      gatherActionUrl: speechSegmentActionUrl,
      speechHints: 'visite, appartement, maison, acheter, louer, rendez-vous, information, estimation', // Aide Twilio
    });

    console.log('[coccinelleOnCallStartFlow] TwiML généré:', twimlResponse);
    return twimlResponse;
  }
);
