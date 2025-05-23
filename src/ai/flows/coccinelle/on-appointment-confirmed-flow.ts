
'use server';
/**
 * @fileOverview coccinelle.ai: Gère les actions post-confirmation d'un RDV.
 * Ce flux est déclenché lorsqu'un rendez-vous est confirmé (par l'IA ou manuellement).
 * Il est responsable de la création de l'événement dans Cal.com et de l'envoi
 * de notifications de confirmation (SMS via Twilio, Email via SendGrid).
 * Il met également à jour le statut du prospect dans Firestore.
 *
 * - handleAppointmentConfirmed - Fonction principale.
 * - AppointmentConfirmedInput - Type d'entrée.
 * - AppointmentConfirmedOutput - Type de retour.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
// import { firestore } from '@/lib/firebase-admin'; // Pour interagir avec Firestore
// import { sendSmsViaTwilio } from '@/services/twilioService'; // Service Twilio (à créer)
// import { sendEmailViaSendGrid } from '@/services/sendgridService'; // Service SendGrid (à créer)
// import { createCalComEvent } from '@/services/calcomService'; // Service Cal.com (à créer)

export const AppointmentConfirmedInputSchema = z.object({
  companyId: z.string().describe("ID de l'entreprise concernée."),
  leadId: z.string().describe("ID du prospect dans Firestore pour lequel le RDV est confirmé."),
  // Informations sur le RDV
  appointmentDateTimeISO: z.string().datetime().describe("Date et heure ISO du RDV confirmé (ex: '2024-08-15T14:30:00.000Z')."),
  appointmentDurationMinutes: z.number().optional().default(30).describe("Durée du RDV en minutes."),
  appointmentType: z.string().optional().default("Visite Immobilier").describe("Type de RDV (ex: Visite, Estimation, Discussion)."),
  appointmentLocation: z.string().optional().describe("Lieu du RDV (adresse physique ou lien de visio)."),
  // Informations de l'agent/utilisateur coccinelle.ai
  agentUserId: z.string().describe("ID de l'utilisateur (agent coccinelle.ai) qui participera au RDV."),
  // Les informations de l'agent (email, téléphone pour Cal.com) peuvent être récupérées via agentUserId
  // Informations du prospect (peuvent être récupérées via leadId ou passées pour redondance)
  prospectFullName: z.string().optional().describe("Nom complet du prospect."),
  prospectPhoneNumber: z.string().optional().describe("Numéro de téléphone du prospect pour la notification SMS."),
  prospectEmail: z.string().email().optional().describe("Adresse e-mail du prospect pour la notification email."),
  // Clés API et configurations spécifiques à l'entreprise (pourraient être récupérées via companyId)
  calComApiKey: z.string().optional().describe("Clé API Cal.com de l'entreprise (si non globale)."),
  calComEventTypeId: z.string().optional().describe("ID du type d'événement Cal.com spécifique à utiliser."),
  twilioAccountSid: z.string().optional().describe("SID du compte Twilio (si non global)."),
  twilioAuthToken: z.string().optional().describe("Token d'authentification Twilio (si non global)."),
  twilioFromPhoneNumberSms: z.string().optional().describe("Numéro Twilio pour envoyer les SMS de confirmation."),
  sendgridApiKey: z.string().optional().describe("Clé API SendGrid (si non globale)."),
  sendgridFromEmail: z.string().email().optional().describe("Email d'expédition pour SendGrid."),
});
export type AppointmentConfirmedInput = z.infer<typeof AppointmentConfirmedInputSchema>;

export const AppointmentConfirmedOutputSchema = z.object({
  leadId: z.string(),
  calComEventId: z.string().optional().describe("ID de l'événement créé dans Cal.com."),
  smsNotificationStatus: z.enum(['sent', 'failed', 'skipped']).describe("Statut de l'envoi de la notification SMS."),
  emailNotificationStatus: z.enum(['sent', 'failed', 'skipped']).describe("Statut de l'envoi de la notification email."),
  leadStatusUpdated: z.boolean().describe("Indique si le statut du prospect a été mis à jour dans Firestore."),
  overallStatus: z.string().describe("Statut global de l'opération (ex: 'success', 'partial_failure', 'failure').")
});
export type AppointmentConfirmedOutput = z.infer<typeof AppointmentConfirmedOutputSchema>;

export async function handleAppointmentConfirmed(input: AppointmentConfirmedInput): Promise<AppointmentConfirmedOutput> {
  return onAppointmentConfirmedFlow(input);
}

// Ce flux ne nécessite pas d'IA pour prendre des décisions, il exécute des actions.
// Un "tool" Genkit serait plus pertinent si l'IA devait *décider* de planifier.
// Ici, nous supposons que la décision est prise et nous exécutons.

const onAppointmentConfirmedFlow = ai.defineFlow(
  {
    name: 'coccinelleOnAppointmentConfirmedFlow',
    inputSchema: AppointmentConfirmedInputSchema,
    outputSchema: AppointmentConfirmedOutputSchema,
  },
  async (input) => {
    console.log('[coccinelleOnAppointmentConfirmedFlow] Début du flux pour le prospect ID:', input.leadId);

    let calComEventId: string | undefined = undefined;
    let smsStatus: AppointmentConfirmedOutput['smsNotificationStatus'] = 'skipped';
    let emailStatus: AppointmentConfirmedOutput['emailNotificationStatus'] = 'skipped';
    let leadUpdated = false;

    // Étape 1: Récupérer les informations complètes du prospect et de l'agent si nécessaire
    // const leadDoc = await firestore.collection('leads').doc(input.leadId).get();
    // const agentDoc = await firestore.collection('users').doc(input.agentUserId).get();
    // if (!leadDoc.exists || !agentDoc.exists) {
    //   console.error(`[coccinelleOnAppointmentConfirmedFlow] Prospect ${input.leadId} ou Agent ${input.agentUserId} non trouvé.`);
    //   return { leadId: input.leadId, overallStatus: 'failure_missing_data', leadStatusUpdated: false, smsNotificationStatus: 'skipped', emailNotificationStatus: 'skipped' };
    // }
    // const leadData = leadDoc.data();
    // const agentData = agentDoc.data();
    // Simulation:
    const leadData = { fullName: input.prospectFullName || "Prospect", phoneNumber: input.prospectPhoneNumber, email: input.prospectEmail };
    const agentData = { email: "agent.coccinelle@example.com", /* autres infos de l'agent */ };
    console.log('[coccinelleOnAppointmentConfirmedFlow] Données du prospect et de l\'agent récupérées (simulation).');


    // Étape 2: Créer l'événement dans Cal.com
    if (input.calComApiKey || process.env.CALCOM_API_KEY) { // Vérifier si la clé API est dispo
      try {
        // const calInput = {
        //   apiKey: input.calComApiKey || process.env.CALCOM_API_KEY!,
        //   eventTypeId: input.calComEventTypeId || 'default-event-type-id', // Ou récupérer depuis la config de l'agent/entreprise
        //   startDateTime: input.appointmentDateTimeISO,
        //   durationMinutes: input.appointmentDurationMinutes,
        //   title: `RDV avec ${leadData.fullName} (${input.appointmentType})`,
        //   attendees: [
        //     { email: agentData.email, name: agentData.displayName || 'Agent coccinelle.ai' },
        //     { email: leadData.email, name: leadData.fullName, timeZone: 'Europe/Paris' /* À rendre dynamique */ },
        //   ],
        //   // Autres champs Cal.com...
        // };
        // calComEventId = await createCalComEvent(calInput); // Appel au service Cal.com
        calComEventId = `sim_cal_evt_${Date.now()}`; // Placeholder
        console.log(`[coccinelleOnAppointmentConfirmedFlow] Événement Cal.com créé (simulation), ID: ${calComEventId}`);
      } catch (error) {
        console.error('[coccinelleOnAppointmentConfirmedFlow] Erreur lors de la création de l\'événement Cal.com (simulation):', error);
      }
    } else {
      console.warn('[coccinelleOnAppointmentConfirmedFlow] Clé API Cal.com manquante, création de RDV Cal.com ignorée.');
    }

    const formattedDateTime = new Date(input.appointmentDateTimeISO).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' });

    // Étape 3: Envoyer la notification SMS via Twilio
    if (leadData.phoneNumber && (input.twilioAccountSid || process.env.TWILIO_ACCOUNT_SID)) {
      const smsMessage = `Bonjour ${leadData.fullName}, votre RDV (${input.appointmentType}) avec coccinelle.ai est confirmé pour le ${formattedDateTime}. Lieu: ${input.appointmentLocation || 'À préciser'}.`;
      try {
        // await sendSmsViaTwilio({
        //   to: leadData.phoneNumber,
        //   from: input.twilioFromPhoneNumberSms || process.env.TWILIO_PHONE_NUMBER!,
        //   body: smsMessage,
        //   accountSid: input.twilioAccountSid || process.env.TWILIO_ACCOUNT_SID!,
        //   authToken: input.twilioAuthToken || process.env.TWILIO_AUTH_TOKEN!,
        // });
        console.log(`[coccinelleOnAppointmentConfirmedFlow] SMS envoyé (simulation) à ${leadData.phoneNumber}: ${smsMessage}`);
        smsStatus = 'sent';
      } catch (error) {
        console.error('[coccinelleOnAppointmentConfirmedFlow] Erreur lors de l\'envoi du SMS (simulation):', error);
        smsStatus = 'failed';
      }
    } else {
      console.warn('[coccinelleOnAppointmentConfirmedFlow] Numéro de téléphone du prospect ou configuration Twilio manquante, SMS ignoré.');
    }

    // Étape 4: Envoyer la notification Email via SendGrid
    if (leadData.email && (input.sendgridApiKey || process.env.SENDGRID_API_KEY)) {
      const emailSubject = `Confirmation de votre RDV: ${input.appointmentType} le ${formattedDateTime}`;
      const emailBody = `
        <p>Bonjour ${leadData.fullName},</p>
        <p>Votre rendez-vous (${input.appointmentType}) avec un conseiller de coccinelle.ai est bien confirmé pour le <strong>${formattedDateTime}</strong>.</p>
        <p><strong>Lieu/Détails :</strong> ${input.appointmentLocation || 'Les détails vous seront communiqués prochainement.'}</p>
        ${calComEventId ? `<p>Vous pouvez gérer ce RDV ici : lien_vers_cal_com_event/${calComEventId}</p>` : ''}
        <p>Cordialement,<br/>L'équipe coccinelle.ai</p>
      `;
      try {
        // await sendEmailViaSendGrid({
        //   to: leadData.email,
        //   from: input.sendgridFromEmail || process.env.SENDGRID_FROM_EMAIL!,
        //   subject: emailSubject,
        //   html: emailBody,
        //   apiKey: input.sendgridApiKey || process.env.SENDGRID_API_KEY!,
        // });
        console.log(`[coccinelleOnAppointmentConfirmedFlow] Email envoyé (simulation) à ${leadData.email}. Sujet: ${emailSubject}`);
        emailStatus = 'sent';
      } catch (error) {
        console.error('[coccinelleOnAppointmentConfirmedFlow] Erreur lors de l\'envoi de l\'email (simulation):', error);
        emailStatus = 'failed';
      }
    } else {
      console.warn('[coccinelleOnAppointmentConfirmedFlow] Email du prospect ou configuration SendGrid manquante, email ignoré.');
    }

    // Étape 5: Mettre à jour le statut du prospect dans Firestore
    // try {
    //   await firestore.collection('leads').doc(input.leadId).update({
    //     status: 'rdv_confirmé', // Ou un statut plus spécifique
    //     preferredDateTime: input.appointmentDateTimeISO, // Assurer que c'est bien la date confirmée
    //     calComEventId: calComEventId || null,
    //     // updatedAt: Timestamp.now(),
    //   });
    //   leadUpdated = true;
    //   console.log(`[coccinelleOnAppointmentConfirmedFlow] Statut du prospect ${input.leadId} mis à jour à 'rdv_confirmé' (simulation).`);
    // } catch (error) {
    //   console.error(`[coccinelleOnAppointmentConfirmedFlow] Erreur lors de la mise à jour du statut du prospect ${input.leadId}:`, error);
    //   leadUpdated = false;
    // }

    const overallStatus = (smsStatus === 'sent' || emailStatus === 'sent') && calComEventId ? 'success' : (smsStatus === 'failed' || emailStatus === 'failed' ? 'partial_failure' : 'failure');

    return {
      leadId: input.leadId,
      calComEventId,
      smsNotificationStatus: smsStatus,
      emailNotificationStatus: emailStatus,
      leadStatusUpdated: leadUpdated, // Simulé
      overallStatus,
    };
  }
);
