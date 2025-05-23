
// src/services/firestoreService.ts
'use server';
/**
 * @fileOverview Service pour les interactions avec Firestore.
 */
// import { firestore } from '@/lib/firebase-admin'; // Nécessite la configuration de Firebase Admin SDK

export interface TwilioNumberConfig {
  companyId: string;
  agentId: string;
  // autres configurations spécifiques au numéro si besoin
}

export interface AgentConfig {
  systemPrompt: string;
  voiceProvider: 'xtts' | 'elevenlabs';
  voiceId: string;
  initialGreetingIncoming: string;
  // autres configurations de l'agent
}

export interface LeadData {
  id: string;
  // autres champs du prospect
}

export interface CallData {
  id: string;
  // autres champs de l'appel
}

/**
 * Récupère la configuration associée à un numéro de téléphone Twilio.
 * @param twilioPhoneNumber - Le numéro Twilio appelé.
 * @returns La configuration du numéro ou null si non trouvé.
 */
export async function getTwilioNumberConfig(twilioPhoneNumber: string): Promise<TwilioNumberConfig | null> {
  console.log(`[FirestoreService] Recherche de la configuration pour le numéro Twilio: ${twilioPhoneNumber}`);
  // TODO: Implémenter la logique de récupération depuis Firestore (collection 'twilioNumberMappings' par exemple)
  // Exemple de simulation :
  if (twilioPhoneNumber === process.env.TWILIO_PHONE_NUMBER || twilioPhoneNumber === '+33000000000') { // Simuler pour le numéro de test
    return {
      companyId: 'simulatedCompany123',
      agentId: 'defaultAgentForCompany123',
    };
  }
  return null;
}

/**
 * Récupère la configuration d'un agent IA.
 * @param agentId - L'ID de l'agent.
 * @returns La configuration de l'agent ou null si non trouvé.
 */
export async function getAgentConfig(agentId: string): Promise<AgentConfig | null> {
  console.log(`[FirestoreService] Recherche de la configuration pour l'agent ID: ${agentId}`);
  // TODO: Implémenter la logique de récupération depuis Firestore (collection 'agentConfigurations')
  // Exemple de simulation :
  if (agentId === 'defaultAgentForCompany123') {
    return {
      systemPrompt: "Vous êtes un assistant vocal de coccinelle.ai. Soyez professionnel, courtois et efficace. Votre objectif principal est de qualifier les prospects et de planifier des rendez-vous pour l'immobilier.",
      voiceProvider: 'xtts',
      voiceId: 'default-fr-voice', // À adapter selon votre config XTTS/ElevenLabs
      initialGreetingIncoming: "Bonjour, bienvenue chez coccinelle.ai, comment puis-je vous aider aujourd'hui ?",
    };
  }
  return null;
}

/**
 * Recherche un prospect existant par numéro de téléphone.
 * @param phoneNumber - Le numéro de téléphone de l'appelant.
 * @param companyId - L'ID de l'entreprise (pour cloisonner la recherche).
 * @returns Les données du prospect ou null si non trouvé.
 */
export async function findLeadByPhoneNumber(phoneNumber: string, companyId: string): Promise<LeadData | null> {
  console.log(`[FirestoreService] Recherche du prospect: ${phoneNumber} pour companyId: ${companyId}`);
  // TODO: Implémenter la logique de recherche dans la collection 'leads'
  // Exemple de simulation :
  // if (phoneNumber === '+33612345678' && companyId === 'simulatedCompany123') {
  //   return { id: 'existingLead456', fullName: 'Jean Existant' };
  // }
  return null;
}

/**
 * Enregistre les données initiales d'un appel dans Firestore.
 * @param callData - Les données de l'appel à enregistrer.
 * @returns L'ID du document d'appel créé.
 */
export async function saveInitialCall(callData: any): Promise<string> {
  console.log('[FirestoreService] Enregistrement de l\'appel initial:', callData);
  // TODO: Implémenter la logique d'écriture dans la collection 'calls'
  // const callRef = await firestore.collection('calls').add(callData);
  // return callRef.id;
  const simulatedCallId = `sim_call_${Date.now()}`;
  console.log(`[FirestoreService] Appel initial sauvegardé (simulation), ID: ${simulatedCallId}`);
  return simulatedCallId;
}

/**
 * Met à jour la transcription d'un appel.
 * @param callDocId - L'ID du document de l'appel.
 * @param newTranscriptSegment - Le nouveau segment de transcription à ajouter.
 * @param speaker - 'Utilisateur' ou 'Assistant'.
 */
export async function appendToCallTranscript(callDocId: string, newTranscriptSegment: string, speaker: 'Utilisateur' | 'Assistant'): Promise<void> {
    console.log(`[FirestoreService] Ajout à la transcription de ${callDocId}: [${speaker}] ${newTranscriptSegment}`);
    // TODO: Implémenter la logique pour récupérer la transcription existante, ajouter le nouveau segment, et mettre à jour.
    // Exemple:
    // const callRef = firestore.collection('calls').doc(callDocId);
    // await firestore.runTransaction(async (transaction) => {
    //   const callDoc = await transaction.get(callRef);
    //   if (!callDoc.exists) {
    //     throw new Error("Document d'appel non trouvé!");
    //   }
    //   const currentTranscript = callDoc.data()?.transcript || '';
    //   const updatedTranscript = `${currentTranscript}\n${speaker}: ${newTranscriptSegment}`;
    //   transaction.update(callRef, { transcript: updatedTranscript, lastUpdatedAt: Timestamp.now() });
    // });
}
