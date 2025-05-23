
'use server';
/**
 * @fileOverview Coccinelle.ai: Gère la fin d'un appel.
 * Ce flux génère un résumé structuré de l'appel complet, analyse l'intention,
 * identifie les informations clés, attribue un score au prospect, et met à jour les enregistrements
 * dans les collections `calls` et `leads` de Firestore.
 *
 * - handleCallEnded - Fonction principale pour traiter la fin d'un appel.
 * - CallEndedInput - Type d'entrée pour handleCallEnded.
 * - CallEndedOutput - Type de retour pour handleCallEnded.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
// import { firestore } from '@/lib/firebase-admin'; // Admin SDK pour Firestore

export const CallEndedInputSchema = z.object({
  callDocId: z.string().describe("ID du document de l'appel dans Firestore."),
  companyId: z.string().describe("ID de l'entreprise pour laquelle l'appel a été traité."),
  fullTranscript: z.string().describe("Transcription complète de l'appel."),
  callRecordingUrl: z.string().optional().describe("URL de l'enregistrement complet de l'appel."),
  finalDurationSeconds: z.number().describe("Durée totale de l'appel en secondes."),
  // Potentiellement d'autres métadonnées de fin d'appel de Twilio
});
export type CallEndedInput = z.infer<typeof CallEndedInputSchema>;

// Informations clés à extraire
const KeyInformationSchema = z.object({
  propertyName: z.string().optional().describe("Nom ou adresse du bien discuté."),
  propertyType: z.string().optional().describe("Type de bien (ex: appartement, maison)."),
  budgetRange: z.string().optional().describe("Fourchette de budget mentionnée."),
  desiredLocation: z.string().optional().describe("Localisation souhaitée."),
  numberOfBedrooms: z.number().optional().describe("Nombre de chambres souhaitées."),
  timeline: z.string().optional().describe("Échéance du projet immobilier."),
  // ... autres informations clés pertinentes pour l'immobilier
});

export const CallEndedOutputSchema = z.object({
  callUpdateStatus: z.string().describe("Statut de la mise à jour du document d'appel (ex: 'completed', 'failed')."),
  leadId: z.string().optional().describe("ID du prospect créé ou mis à jour dans Firestore."),
  leadUpdateStatus: z.string().optional().describe("Statut de la mise à jour du prospect."),
  structuredSummary: z.object({
    overallSummary: z.string().describe("Résumé global de l'appel."),
    intentDetected: z.string().describe("Intention principale de l'appelant (ex: 'prise_rdv', 'information_bien', 'plainte', 'autre')."),
    leadScore: z.number().min(0).max(100).describe("Score du prospect (0-100) basé sur l'intérêt et la qualification."),
    keyInformationExtracted: KeyInformationSchema.optional().describe("Informations clés extraites de la conversation."),
    nextStepsRecommended: z.array(z.string()).optional().describe("Prochaines étapes recommandées."),
    appointmentDetails: z.object({
        scheduled: z.boolean().describe("Indique si un RDV a été explicitement discuté ou programmé."),
        proposedDateTimes: z.array(z.string().datetime()).optional().describe("Dates et heures de RDV proposées ou discutées."),
        confirmedDateTime: z.string().datetime().optional().describe("Date et heure du RDV confirmé, si applicable.")
    }).optional().describe("Détails concernant un rendez-vous."),
  }).describe("Résumé structuré et analyse de l'appel."),
});
export type CallEndedOutput = z.infer<typeof CallEndedOutputSchema>;

export async function handleCallEnded(input: CallEndedInput): Promise<CallEndedOutput> {
  return onCallEndedFlow(input);
}

// Prompt pour analyser la transcription complète et générer un résumé structuré
const analyzeFullCallPrompt = ai.definePrompt({
  name: 'coccinelleAnalyzeFullCallPrompt',
  input: { schema: z.object({ transcript: z.string(), companyId: z.string() }) },
  output: {
    schema: z.object({
      summary: z.string().describe("Résumé concis et objectif de la conversation."),
      intent: z.string().describe("Intention principale de l'appelant (ex: 'demande_info_achat', 'demande_info_location', 'prise_rdv_visite', 'prise_rdv_estimation', 'plainte', 'relance_dossier', 'hors_sujet', 'autre')."),
      leadScore: z.number().min(0).max(100).describe("Score du prospect de 0 (pas intéressé/qualifié) à 100 (très intéressé/qualifié)."),
      keyInfo: KeyInformationSchema.describe("Informations clés spécifiques à l'immobilier extraites."),
      nextSteps: z.array(z.string()).optional().describe("Actions ou prochaines étapes suggérées (ex: 'Envoyer brochure', 'Planifier rappel', 'Préparer dossier')."),
      appointment: z.object({
        scheduled: z.boolean().describe("Un RDV a-t-il été clairement évoqué ou planifié ?"),
        proposedDateTimes: z.array(z.string().datetime()).optional().describe("Si un RDV a été discuté, quelles dates/heures ont été proposées ? Format ISO 8601."),
        confirmedDateTime: z.string().datetime().optional().describe("Si un RDV a été confirmé, quelle est la date/heure ? Format ISO 8601.")
      }).optional().describe("Détails concernant un éventuel RDV.")
    })
  },
  model: 'googleai/gemini-2.0-flash', // Modèle à adapter (GPT-4 pour meilleure qualité)
  prompt: `Vous êtes un expert en analyse d'appels pour des agences immobilières de l'entreprise avec l'ID {{{companyId}}}.
  Analysez la transcription d'appel suivante. Votre objectif est de fournir un résumé structuré complet.

  Transcription:
  {{{transcript}}}
  --- Fin de la Transcription ---

  Basé sur cette transcription, fournissez les éléments suivants :
  1.  **summary**: Un résumé concis et objectif de l'ensemble de la conversation.
  2.  **intent**: L'intention principale de l'appelant (ex: 'demande_info_achat', 'demande_info_location', 'prise_rdv_visite', 'prise_rdv_estimation', 'plainte', 'relance_dossier', 'hors_sujet', 'autre').
  3.  **leadScore**: Un score de prospect de 0 à 100. Un score élevé (70+) indique un prospect chaud et qualifié. Un score bas (<30) indique un prospect froid ou non pertinent.
  4.  **keyInfo**: Les informations immobilières clés mentionnées :
      - Nom/adresse du bien (propertyName)
      - Type de bien (propertyType)
      - Fourchette de budget (budgetRange)
      - Localisation souhaitée (desiredLocation)
      - Nombre de chambres (numberOfBedrooms)
      - Échéance du projet (timeline)
  5.  **nextSteps**: Une liste d'actions ou de prochaines étapes recommandées pour l'agent immobilier.
  6.  **appointment**: Détails concernant un rendez-vous :
      - `scheduled`: (boolean) Indique si un RDV a été activement discuté ou planifié.
      - `proposedDateTimes`: (array of ISO datetime strings) Si un RDV a été discuté, quelles dates/heures ont été proposées.
      - `confirmedDateTime`: (ISO datetime string) Si un RDV a été explicitement confirmé, la date et l'heure.

  Soyez précis et extrayez uniquement les informations présentes dans la transcription.
  Si une information n'est pas disponible, omettez le champ correspondant dans l'objet keyInfo ou appointment (sauf pour `appointment.scheduled` qui doit toujours être présent).
  `,
});


const onCallEndedFlow = ai.defineFlow(
  {
    name: 'coccinelleOnCallEndedFlow',
    inputSchema: CallEndedInputSchema,
    outputSchema: CallEndedOutputSchema,
  },
  async (input) => {
    console.log('[coccinelleOnCallEndedFlow] Démarrage du flux pour l\'appel Doc ID:', input.callDocId);

    // Étape 1: Analyser la transcription complète avec l'IA
    const { output: analysis } = await analyzeFullCallPrompt({ transcript: input.fullTranscript, companyId: input.companyId });

    if (!analysis) {
      console.error('[coccinelleOnCallEndedFlow] Échec de l\'analyse de la transcription.');
      // Gérer l'erreur, peut-être sauvegarder avec un statut d'erreur
      return {
        callUpdateStatus: 'failed_analysis',
        structuredSummary: {
          overallSummary: "Analyse de l'appel échouée.",
          intentDetected: "inconnu",
          leadScore: 0,
        }
      };
    }

    console.log('[coccinelleOnCallEndedFlow] Analyse de la transcription terminée:', analysis);

    // Étape 2: Mettre à jour le document d'appel dans Firestore
    const callUpdateData = {
      transcript: input.fullTranscript, // Assurer que la transcription complète est bien sauvegardée
      summary: analysis.summary,
      intentDetected: analysis.intent,
      leadScoring: analysis.leadScore, // Sauvegarder le score au niveau de l'appel aussi
      keyInformationExtracted: analysis.keyInfo || {},
      appointmentDetails: analysis.appointment || { scheduled: false },
      duration: input.finalDurationSeconds,
      callRecordingURL: input.callRecordingUrl,
      status: 'completed', // Marquer l'appel comme terminé
      // lastUpdatedAt: Timestamp.now(), // Pour Firestore Admin SDK
    };

    let callUpdateStatus = 'pending';
    // try {
    //   await firestore.collection('calls').doc(input.callDocId).update(callUpdateData);
    //   callUpdateStatus = 'completed';
    //   console.log(`[coccinelleOnCallEndedFlow] Document d'appel ${input.callDocId} mis à jour dans Firestore.`);
    // } catch (error) {
    //   console.error(`[coccinelleOnCallEndedFlow] Erreur lors de la mise à jour du document d'appel ${input.callDocId}:`, error);
    //   callUpdateStatus = 'failed_firestore_update';
    // }

    // Étape 3: Créer ou mettre à jour le prospect (lead) dans Firestore
    let leadId: string | undefined = undefined;
    let leadUpdateStatus: string | undefined = 'not_applicable';

    // Condition pour créer/MAJ un lead (par exemple, si l'intention n'est pas 'hors_sujet' et score > seuil)
    if (analysis.intent !== 'hors_sujet' && analysis.intent !== 'plainte' && analysis.leadScore > 20) {
      // Essayer de récupérer le numéro de téléphone du prospect depuis la transcription ou les données d'appel
      // Pour la simulation, on suppose qu'il est dans keyInfo ou qu'il faut le récupérer autrement
      const prospectPhoneNumber = analysis.keyInfo?.phoneNumber || (await getCallOriginatorPhoneNumber(input.callDocId)); // Placeholder function
      const prospectEmail = analysis.keyInfo?.email; // Placeholder

      if (prospectPhoneNumber) {
        const leadData = {
          companyId: input.companyId,
          userId: callUpdateData.userId, // L'utilisateur associé à l'appel (agent IA ou humain)
          fullName: analysis.keyInfo?.contactName || "Prospect Inconnu",
          phoneNumber: prospectPhoneNumber,
          email: prospectEmail,
          interest: analysis.summary, // Ou une extraction plus ciblée de l'intérêt
          scoring: analysis.leadScore,
          preferredDateTime: analysis.appointment?.confirmedDateTime || (analysis.appointment?.proposedDateTimes && analysis.appointment.proposedDateTimes[0]) || undefined,
          status: analysis.appointment?.scheduled ? 'rdv_planifie' : 'a_contacter',
          lastCallDocId: input.callDocId,
          // lastCallTimestamp: callUpdateData.timestamp,
          // createdAt: Timestamp.now(), // Géré par Firestore ou lors de la première création
          // updatedAt: Timestamp.now(),
        };

        // Logique pour créer un nouveau lead ou mettre à jour un existant basé sur le numéro de téléphone/email
        // leadId = await createOrUpdateLeadInFirestore(leadData); // Placeholder
        leadId = `sim_lead_${Date.now()}`;
        leadUpdateStatus = 'created_or_updated (simulation)';
        console.log(`[coccinelleOnCallEndedFlow] Prospect ${leadId} créé/mis à jour (simulation).`);
      } else {
        console.warn('[coccinelleOnCallEndedFlow] Numéro de téléphone du prospect non trouvé, création de lead ignorée.');
        leadUpdateStatus = 'skipped_no_phone';
      }
    } else {
      console.log('[coccinelleOnCallEndedFlow] Création/mise à jour de lead non pertinente pour cet appel.');
    }

    return {
      callUpdateStatus,
      leadId,
      leadUpdateStatus,
      structuredSummary: {
        overallSummary: analysis.summary,
        intentDetected: analysis.intent,
        leadScore: analysis.leadScore,
        keyInformationExtracted: analysis.keyInfo,
        nextStepsRecommended: analysis.nextSteps,
        appointmentDetails: analysis.appointment,
      },
    };
  }
);

// Fonction placeholder pour simuler la récupération du numéro de l'initiateur de l'appel
async function getCallOriginatorPhoneNumber(callDocId: string): Promise<string | undefined> {
  // Dans une vraie application, vous liriez le document d'appel depuis Firestore.
  // const callDoc = await firestore.collection('calls').doc(callDocId).get();
  // if (callDoc.exists) {
  //   const callData = callDoc.data();
  //   return callData?.direction === 'incoming' ? callData.fromPhoneNumber : callData.toPhoneNumber;
  // }
  console.warn(`[getCallOriginatorPhoneNumber] Simulation: impossible de trouver le numéro pour l'appel ${callDocId}.`);
  return undefined;
}

// Fonction placeholder pour la création/mise à jour de lead
// async function createOrUpdateLeadInFirestore(leadData: any): Promise<string> {
//    // Logique pour chercher un lead par phoneNumber/email et companyId, puis créer ou mettre à jour.
//    // Retourner l'ID du document du lead.
//    return `lead_${Date.now()}`;
// }
