'use server';
/**
 * @fileOverview Coccinelle.ai: Gère les actions post-qualification d'un prospect.
 * Ce flux envoie une confirmation SMS (Twilio), crée un RDV (Cal.com),
 * et enregistre les informations dans Firestore.
 *
 * - handleQualifiedLead - Fonction principale pour traiter un prospect qualifié.
 * - QualifiedLeadInput - Type d'entrée pour handleQualifiedLead.
 * - QualifiedLeadOutput - Type de retour pour handleQualifiedLead.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Placeholder for Twilio, Cal.com, Firestore service calls
// import { sendSms } from '@/services/twilio';
// import { createCalendarEvent } from '@/services/caldotcom';
// import { updateLeadData, getLeadData } from '@/services/firestore';

const QualifiedLeadInputSchema = z.object({
  leadId: z.string().describe("ID du prospect qualifié dans Firestore."),
  // Other necessary info might be fetched using leadId or passed directly
  // For example, if RDV time was confirmed by AI in a previous step:
  confirmedAppointmentISO: z.string().datetime().optional().describe("Date et heure ISO du RDV confirmé."),
  agentPhoneNumber: z.string().optional().describe("Numéro de téléphone de l'agent pour la notif Cal.com."),
  agentEmail: z.string().optional().describe("Email de l'agent pour la notif Cal.com."),
});
export type QualifiedLeadInput = z.infer<typeof QualifiedLeadInputSchema>;

const QualifiedLeadOutputSchema = z.object({
  smsSent: z.boolean().describe("Indique si le SMS de confirmation a été envoyé."),
  appointmentCreated: z.boolean().describe("Indique si le RDV a été créé dans Cal.com."),
  leadStatusUpdated: z.boolean().describe("Indique si le statut du prospect a été mis à jour dans Firestore.")
});
export type QualifiedLeadOutput = z.infer<typeof QualifiedLeadOutputSchema>;

export async function handleQualifiedLead(input: QualifiedLeadInput): Promise<QualifiedLeadOutput> {
  return onLeadQualifiedFlow(input);
}

// Example of a tool for Cal.com API call, if needed within a more complex decision process by the LLM.
// For direct calls, a service function is simpler.
const scheduleCalComAppointmentTool = ai.defineTool(
  {
    name: 'scheduleCalComAppointment',
    description: 'Planifie un rendez-vous dans Cal.com pour un prospect qualifié.',
    inputSchema: z.object({
      leadName: z.string(),
      leadEmail: z.string().optional(),
      leadPhoneNumber: z.string(),
      appointmentDateTimeISO: z.string().datetime().describe("Date et heure ISO du rendez-vous."),
      eventTypeId: z.string().describe("ID du type d'événement Cal.com à utiliser (ex: visite, appel découverte)."),
      agentEmail: z.string().describe("Email de l'agent/utilisateur Cal.com avec qui planifier."),
      durationMinutes: z.number().optional().default(30).describe("Durée du RDV en minutes."),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      calComEventId: z.string().optional(),
      errorMessage: z.string().optional(),
    }),
  },
  async (toolInput) => {
    console.log("Appel du tool scheduleCalComAppointment (simulation):", toolInput);
    // const result = await createCalendarEvent(toolInput);
    // return result; // { success: true, calComEventId: 'evt_123' }
    if (toolInput.appointmentDateTimeISO) {
        return { success: true, calComEventId: 'evt_simulated_123' };
    }
    return { success: false, errorMessage: 'Date de RDV manquante (simulation tool).'};
  }
);


const onLeadQualifiedFlow = ai.defineFlow(
  {
    name: 'coccinelleOnLeadQualifiedFlow',
    inputSchema: QualifiedLeadInputSchema,
    outputSchema: QualifiedLeadOutputSchema,
    // tools: [scheduleCalComAppointmentTool] // If LLM needs to decide to use it.
  },
  async (input) => {
    console.log('Début du flux onLeadQualifiedFlow pour le prospect:', input.leadId);

    // 1. Fetch lead data from Firestore using input.leadId
    // const lead = await getLeadData(input.leadId);
    // if (!lead) {
    //   throw new Error(`Prospect non trouvé avec ID: ${input.leadId}`);
    // }
    // Simulate fetched lead data
    const lead = {
        fullName: "Jean Prospect Qualifié",
        phoneNumber: "+33612345678",
        email: "jean.prospect@example.com",
        preferredDateTime: input.confirmedAppointmentISO || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow if not set
        // Assume other relevant fields like userId, agentId for cal.com event type
    };
    console.log("Données du prospect récupérées (simulation):", lead);


    let smsSent = false;
    let appointmentCreated = false;
    let leadStatusUpdated = false;

    // 2. Send SMS confirmation via Twilio
    const smsMessage = `Bonjour ${lead.fullName}, votre RDV avec Coccinelle.ai est confirmé pour le ${new Date(lead.preferredDateTime).toLocaleString('fr-FR')}. À bientôt !`;
    try {
      // await sendSms(lead.phoneNumber, smsMessage);
      console.log(`SMS envoyé (simulation) à ${lead.phoneNumber}: ${smsMessage}`);
      smsSent = true;
    } catch (error) {
      console.error("Erreur lors de l'envoi du SMS (simulation):", error);
    }

    // 3. Create appointment via Cal.com API
    if (lead.preferredDateTime) {
      try {
        // const calComResult = await createCalendarEvent({
        //   leadName: lead.fullName,
        //   leadEmail: lead.email,
        //   leadPhoneNumber: lead.phoneNumber,
        //   appointmentDateTimeISO: lead.preferredDateTime,
        //   eventTypeId: "evt_type_visite_coccinelle", // Get from agent/global config
        //   agentEmail: input.agentEmail || "agent@coccinelle.ai", // Get from agent config
        // });
        // if (calComResult.success) {
        //   appointmentCreated = true;
        //   console.log("RDV Cal.com créé (simulation), ID:", calComResult.calComEventId);
        //   // Optionally save calComEventId to the lead document
        // } else {
        //   console.error("Erreur création RDV Cal.com (simulation):", calComResult.errorMessage);
        // }
        
        // Using the tool for demonstration if an LLM were involved in scheduling.
        // For direct scheduling, a service call is more straightforward.
        // For this flow, assuming the date is confirmed, direct service call is better.
        const toolInputSim = {
            leadName: lead.fullName,
            leadEmail: lead.email,
            leadPhoneNumber: lead.phoneNumber,
            appointmentDateTimeISO: lead.preferredDateTime,
            eventTypeId: "evt_type_visite_coccinelle", 
            agentEmail: input.agentEmail || "agent@coccinelle.ai",
        };
        const calToolResult = await scheduleCalComAppointmentTool(toolInputSim);
         if (calToolResult.success) {
          appointmentCreated = true;
          console.log("RDV Cal.com créé (simulation via tool), ID:", calToolResult.calComEventId);
        } else {
          console.error("Erreur création RDV Cal.com (simulation via tool):", calToolResult.errorMessage);
        }

      } catch (error) {
        console.error("Erreur lors de la création du RDV Cal.com (simulation):", error);
      }
    } else {
        console.log("Aucune date de RDV préférée, création de RDV Cal.com ignorée.");
    }

    // 4. Update lead status in Firestore
    try {
      // await updateLeadData(input.leadId, { status: 'rdv_confirmed', calComEventId: ... });
      console.log(`Statut du prospect ${input.leadId} mis à jour à 'rdv_confirmed' (simulation).`);
      leadStatusUpdated = true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du prospect (simulation):", error);
    }

    return {
      smsSent,
      appointmentCreated,
      leadStatusUpdated,
    };
  }
);
