
// src/services/twimlService.ts
'use server';
/**
 * @fileOverview Service pour générer des réponses TwiML pour Twilio.
 */

interface GenerateInitialResponseOptions {
  greeting: string;
  voice: string; // ex: 'alice', 'Polly.Mathieu'
  language: string; // ex: 'fr-FR'
  gatherActionUrl: string; // URL pour le flux onSpeechSegmentFlow
  speechHints?: string; // Mots-clés pour améliorer la reconnaissance vocale
}

/**
 * Génère la réponse TwiML initiale pour accueillir l'appelant et recueillir sa première intention.
 */
export function generateInitialResponseTwiml({
  greeting,
  voice,
  language,
  gatherActionUrl,
  speechHints
}: GenerateInitialResponseOptions): string {
  // Note: En TwiML, la sérialisation XML est sensible. Assurez-vous que la structure est valide.
  // Les bibliothèques Twilio Node.js peuvent aider à construire cela de manière programmatique et plus sûre.
  // Pour l'instant, nous construisons une chaîne XML.

  let twiml = '<Response>';
  twiml += `<Say voice="${voice}" language="${language}">${escapeXml(greeting)}</Say>`;
  twiml += `<Gather input="speech" action="${escapeXml(gatherActionUrl)}" method="POST" speechTimeout="auto" language="${language}" ${speechHints ? `hints="${escapeXml(speechHints)}"` : ''}>`;
  // Optionnel : Ajouter un <Say> dans le <Gather> si vous voulez que l'IA pose une question ouverte immédiatement
  // twiml += `<Say voice="${voice}" language="${language}">Que puis-je faire pour vous ?</Say>`;
  twiml += '</Gather>';
  // Si Gather ne reçoit rien (timeout), Twilio exécute les verbes suivants.
  twiml += `<Say voice="${voice}" language="${language}">Je n'ai pas reçu de réponse. Au revoir.</Say>`;
  twiml += '<Hangup/>';
  twiml += '</Response>';
  return twiml;
}

interface ContinueConversationOptions {
  aiResponse: string;
  voice: string;
  language: string;
  gatherActionUrl: string; // URL pour le flux onSpeechSegmentFlow (souvent la même)
  speechHints?: string;
  shouldHangUp?: boolean;
}

/**
 * Génère la réponse TwiML pour continuer la conversation ou la terminer.
 */
export function generateContinueConversationTwiml({
  aiResponse,
  voice,
  language,
  gatherActionUrl,
  speechHints,
  shouldHangUp = false,
}: ContinueConversationOptions): string {
  let twiml = '<Response>';
  twiml += `<Say voice="${voice}" language="${language}">${escapeXml(aiResponse)}</Say>`;

  if (shouldHangUp) {
    twiml += '<Hangup/>';
  } else {
    twiml += `<Gather input="speech" action="${escapeXml(gatherActionUrl)}" method="POST" speechTimeout="auto" language="${language}" ${speechHints ? `hints="${escapeXml(speechHints)}"` : ''}>`;
    // Optionnel : <Say> dans Gather si l'IA pose une question
    twiml += '</Gather>';
    twiml += `<Say voice="${voice}" language="${language}">Je n'ai pas compris. Veuillez réessayer. Au revoir.</Say>`;
    twiml += '<Hangup/>';
  }
  twiml += '</Response>';
  return twiml;
}


// Helper pour échapper les caractères XML
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
