
'use server';
/**
 * @fileOverview coccinelle.ai: Gère le suivi d'un prospect.
 * Ce flux peut être déclenché manuellement, par webhook, ou automatiquement (ex: X jours après le dernier contact).
 * Il est responsable de l'envoi de communications de suivi (SMS, email) ou de la planification
 * d'un appel de suivi par un agent IA.
 *
 * - handleLeadFollowUp - Fonction principale.
 * - LeadFollowUpInput - Type d'entrée.
 * - LeadFollowUpOutput - Type de retour.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
// import { firestore } from '@/lib/firebase-admin'; // Pour lire/écrire dans Firestore
// import { sendSmsViaTwilio } from '@/services/twilioService';
// import { sendEmailViaSendGrid } from '@/services/sendgridService';
// import { triggerAutomatedCall } from '@/services/outboundCallService'; // Service pour initier un appel Twilio sortant

export const LeadFollowUpInputSchema = z.object({
  companyId: z.string().describe("ID de l'entreprise pour laquelle le suivi est effectué."),
  leadId: z.string().describe("ID du prospect dans Firestore."),
  followUpStrategy: z.enum(['sms_reminder', 'email_info', 'schedule_ai_call', 'webhook_crm'])
    .describe("Type de stratégie de suivi à appliquer."),
  messageTemplateId: z.string().optional().describe("ID optionnel d'un modèle de message pré-défini (pour SMS/email)."),
  customMessage: z.string().optional().describe("Message personnalisé si `messageTemplateId` n'est pas utilisé."),
  // Pour `schedule_ai_call`
  aiAgentIdToCall: z.string().optional().describe("ID de l'agent IA à utiliser pour l'appel de suivi."),
  callReasonPrompt: z.string().optional().describe("Contexte ou raison spécifique pour l'appel de suivi de l'IA."),
  // Pour `webhook_crm`
  crmWebhookUrl: z.string().url().optional().describe("URL du webhook CRM à notifier."),
  crmPayload: z.record(z.any()).optional().describe("Données à envoyer au webhook CRM."),
});
export type LeadFollowUpInput = z.infer<typeof LeadFollowUpInputSchema>;

export const LeadFollowUpOutputSchema = z.object({
  leadId: z.string(),
  strategyApplied: LeadFollowUpInputSchema.shape.followUpStrategy,
  status: z.enum(['success', 'pending_call', 'failed', 'skipped']).describe("Statut de l'opération de suivi."),
  details: z.string().optional().describe("Détails supplémentaires sur le résultat de l'opération."),
});
export type LeadFollowUpOutput = z.infer<typeof LeadFollowUpOutputSchema>;

export async function handleLeadFollowUp(input: LeadFollowUpInput): Promise<LeadFollowUpOutput> {
  return onLeadFollowUpFlow(input);
}

// Ce flux est principalement orienté action, mais pourrait utiliser l'IA pour générer des messages de suivi personnalisés à l'avenir.
const onLeadFollowUpFlow = ai.defineFlow(
  {
    name: 'coccinelleOnLeadFollowUpFlow',
    inputSchema: LeadFollowUpInputSchema,
    outputSchema: LeadFollowUpOutputSchema,
  },
  async (input): Promise<LeadFollowUpOutput> => {
    console.log(`[coccinelleOnLeadFollowUpFlow] Début du suivi pour le prospect ID: ${input.leadId}, Stratégie: ${input.followUpStrategy}`);

    // Étape 1: Récupérer les données du prospect et de l'entreprise/agent
    // const leadDoc = await firestore.collection('leads').doc(input.leadId).get();
    // if (!leadDoc.exists || leadDoc.data()?.companyId !== input.companyId) {
    //   console.error(`[coccinelleOnLeadFollowUpFlow] Prospect ${input.leadId} non trouvé ou n'appartient pas à l'entreprise ${input.companyId}.`);
    //   return { leadId: input.leadId, strategyApplied: input.followUpStrategy, status: 'failed', details: "Prospect non trouvé ou invalide." };
    // }
    // const leadData = leadDoc.data();
    // Simulation:
    const leadData = {
      fullName: "Jean ProspectSuivi",
      phoneNumber: "+33612345600", // Numéro pour test SMS
      email: "jean.prospect.suivi@example.com",
      // ... autres données du prospect
    };
    console.log('[coccinelleOnLeadFollowUpFlow] Données du prospect récupérées (simulation).');

    let messageContent = input.customMessage;
    if (input.messageTemplateId && !messageContent) {
      // Logique pour récupérer le contenu du modèle de message depuis Firestore ou une config
      // messageContent = await getMessageTemplate(input.messageTemplateId, leadData); // Placeholder
      messageContent = `Ceci est un message de suivi automatique de la part de coccinelle.ai pour ${leadData.fullName} concernant votre intérêt. (Template: ${input.messageTemplateId})`;
    }

    switch (input.followUpStrategy) {
      case 'sms_reminder':
        if (leadData.phoneNumber && messageContent) {
          try {
            // await sendSmsViaTwilio({ to: leadData.phoneNumber, from: process.env.TWILIO_PHONE_NUMBER!, body: messageContent });
            console.log(`[coccinelleOnLeadFollowUpFlow] SMS de suivi envoyé (simulation) à ${leadData.phoneNumber}: ${messageContent}`);
            return { leadId: input.leadId, strategyApplied: input.followUpStrategy, status: 'success', details: "SMS de suivi envoyé." };
          } catch (error) {
            console.error('[coccinelleOnLeadFollowUpFlow] Erreur envoi SMS de suivi (simulation):', error);
            return { leadId: input.leadId, strategyApplied: input.followUpStrategy, status: 'failed', details: "Échec envoi SMS." };
          }
        }
        return { leadId: input.leadId, strategyApplied: input.followUpStrategy, status: 'skipped', details: "Numéro de téléphone ou message manquant pour SMS." };

      case 'email_info':
        if (leadData.email && messageContent) {
          try {
            // await sendEmailViaSendGrid({ to: leadData.email, from: process.env.SENDGRID_FROM_EMAIL!, subject: "Suivi de votre demande - coccinelle.ai", html: `<p>${messageContent}</p>` });
            console.log(`[coccinelleOnLeadFollowUpFlow] Email de suivi envoyé (simulation) à ${leadData.email}.`);
            return { leadId: input.leadId, strategyApplied: input.followUpStrategy, status: 'success', details: "Email de suivi envoyé." };
          } catch (error) {
            console.error('[coccinelleOnLeadFollowUpFlow] Erreur envoi email de suivi (simulation):', error);
            return { leadId: input.leadId, strategyApplied: input.followUpStrategy, status: 'failed', details: "Échec envoi email." };
          }
        }
        return { leadId: input.leadId, strategyApplied: input.followUpStrategy, status: 'skipped', details: "Email ou message manquant pour l'email." };

      case 'schedule_ai_call':
        if (input.aiAgentIdToCall && leadData.phoneNumber) {
          try {
            // const callPayload = {
            //   to: leadData.phoneNumber,
            //   from: process.env.TWILIO_PHONE_NUMBER_AGENT_SPECIFIC || process.env.TWILIO_PHONE_NUMBER, // Numéro de l'agent IA
            //   agentId: input.aiAgentIdToCall,
            //   initialPromptContext: input.callReasonPrompt || `Appel de suivi pour ${leadData.fullName}.`,
            //   leadId: input.leadId,
            //   companyId: input.companyId,
            // };
            // await triggerAutomatedCall(callPayload); // Service pour initier l'appel sortant Twilio
            console.log(`[coccinelleOnLeadFollowUpFlow] Appel de suivi IA planifié (simulation) pour ${leadData.phoneNumber} avec agent ${input.aiAgentIdToCall}.`);
            return { leadId: input.leadId, strategyApplied: input.followUpStrategy, status: 'pending_call', details: "Appel IA de suivi initié." };
          } catch (error) {
            console.error('[coccinelleOnLeadFollowUpFlow] Erreur planification appel IA (simulation):', error);
            return { leadId: input.leadId, strategyApplied: input.followUpStrategy, status: 'failed', details: "Échec planification appel IA." };
          }
        }
        return { leadId: input.leadId, strategyApplied: input.followUpStrategy, status: 'skipped', details: "Agent IA ou numéro de téléphone manquant pour l'appel." };

      case 'webhook_crm':
        if (input.crmWebhookUrl) {
          try {
            // const payload = input.crmPayload || { leadId: input.leadId, companyId: input.companyId, status: leadData.status, followUpRequired: true };
            // await fetch(input.crmWebhookUrl, { method: 'POST', body: JSON.stringify(payload), headers: {'Content-Type': 'application/json'} });
            console.log(`[coccinelleOnLeadFollowUpFlow] Webhook CRM notifié (simulation) à ${input.crmWebhookUrl}.`);
            return { leadId: input.leadId, strategyApplied: input.followUpStrategy, status: 'success', details: "Webhook CRM notifié." };
          } catch (error) {
            console.error('[coccinelleOnLeadFollowUpFlow] Erreur notification webhook CRM (simulation):', error);
            return { leadId: input.leadId, strategyApplied: input.followUpStrategy, status: 'failed', details: "Échec notification webhook CRM." };
          }
        }
        return { leadId: input.leadId, strategyApplied: input.followUpStrategy, status: 'skipped', details: "URL du webhook CRM manquante." };

      default:
        console.warn(`[coccinelleOnLeadFollowUpFlow] Stratégie de suivi inconnue: ${input.followUpStrategy}`);
        return { leadId: input.leadId, strategyApplied: input.followUpStrategy, status: 'failed', details: "Stratégie de suivi inconnue." };
    }
  }
);

// Placeholder pour une fonction qui récupère un modèle de message
// async function getMessageTemplate(templateId: string, leadData: any): Promise<string> {
//   // Logique pour récupérer le template depuis Firestore/config et le personnaliser avec leadData
//   return `Message template ${templateId} pour ${leadData.fullName}.`;
// }
