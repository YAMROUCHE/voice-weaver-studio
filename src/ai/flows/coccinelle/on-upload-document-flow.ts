
'use server';
/**
 * @fileOverview coccinelle.ai: Gère le téléversement et l'indexation de documents.
 * Ce flux parse les documents (PDF, CSV, Excel, Notion, Airtable), les segmente,
 * génère des embeddings (via OpenAI ou autre) et les indexe dans une base
 * de données vectorielle (ex: Pinecone, ou Firestore avec une extension vectorielle).
 * Les métadonnées sont sauvegardées dans la collection `datasets` de Firestore,
 * associées à un `companyId`.
 *
 * - handleDocumentUpload - Fonction principale pour traiter un document téléversé.
 * - DocumentUploadInput - Type d'entrée.
 * - DocumentUploadOutput - Type de retour.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
// import { firestore } from '@/lib/firebase-admin'; // Admin SDK pour Firestore
// import { parsePdf, parseCsv, parseExcel, chunkText } from '@/services/documentParserService'; // Services de parsing et chunking
// import { generateEmbeddings, indexVectorsInPinecone } from '@/services/vectorDbService'; // Services pour embeddings et DB vectorielle

export const DocumentUploadInputSchema = z.object({
  userId: z.string().describe("ID de l'utilisateur qui téléverse le document."),
  companyId: z.string().describe("ID de l'entreprise à laquelle ce jeu de données sera associé."),
  fileName: z.string().describe("Nom original du fichier."),
  fileDataUri: z.string().describe("Contenu du fichier sous forme d'URI de données. Format attendu : 'data:<mimetype>;base64,<encoded_data>'."),
  sourceType: z.enum(['pdf', 'csv', 'excel', 'notion', 'airtable', 'text']).describe("Type de source du document."),
  // Pour les sources externes comme Notion/Airtable, des champs supplémentaires pourraient être nécessaires
  externalSourceId: z.string().optional().describe("ID de la page Notion, base Airtable, etc., si sourceType est externe."),
  // Configurations pour le chunking et l'embedding
  chunkSize: z.number().optional().default(1000).describe("Taille des morceaux de texte pour l'indexation."),
  chunkOverlap: z.number().optional().default(100).describe("Chevauchement entre les morceaux de texte."),
});
export type DocumentUploadInput = z.infer<typeof DocumentUploadInputSchema>;

export const DocumentUploadOutputSchema = z.object({
  datasetId: z.string().describe("ID du jeu de données créé ou mis à jour dans Firestore."),
  status: z.enum(['pending', 'parsing', 'chunking', 'embedding', 'indexing', 'completed', 'failed']).describe("Statut du processus de téléversement et d'indexation."),
  vectorCount: z.number().optional().describe("Nombre de vecteurs générés et indexés."),
  contentPreview: z.string().optional().describe("Aperçu du contenu parsé (premiers caractères)."),
  errorMessage: z.string().optional().describe("Message d'erreur si le processus a échoué."),
});
export type DocumentUploadOutput = z.infer<typeof DocumentUploadOutputSchema>;

export async function handleDocumentUpload(input: DocumentUploadInput): Promise<DocumentUploadOutput> {
  return onUploadDocumentFlow(input);
}

const onUploadDocumentFlow = ai.defineFlow(
  {
    name: 'coccinelleOnUploadDocumentFlow',
    inputSchema: DocumentUploadInputSchema,
    outputSchema: DocumentUploadOutputSchema,
  },
  async (input) => {
    console.log(`[coccinelleOnUploadDocumentFlow] Début pour: ${input.fileName} (type: ${input.sourceType}) pour entreprise ${input.companyId}`);
    
    // Créer un enregistrement initial dans Firestore pour le dataset
    const datasetInitialData = {
      userId: input.userId,
      companyId: input.companyId,
      fileName: input.fileName,
      sourceType: input.sourceType,
      status: 'pending' as const,
      uploadedAt: new Date(), // Ou Timestamp.now()
      // ... autres métadonnées
    };
    // const datasetRef = await firestore.collection('datasets').add(datasetInitialData);
    // const datasetId = datasetRef.id;
    const datasetId = `sim_ds_${Date.now()}`; // Placeholder
    console.log(`[coccinelleOnUploadDocumentFlow] Dataset ${datasetId} créé en attente (simulation).`);

    try {
      // await firestore.collection('datasets').doc(datasetId).update({ status: 'parsing' });
      console.log(`[coccinelleOnUploadDocumentFlow] Statut du dataset ${datasetId} mis à 'parsing'.`);

      let parsedTextContent = "";
      const base64Data = input.fileDataUri.split(',')[1];
      const fileBuffer = Buffer.from(base64Data, 'base64');

      switch (input.sourceType) {
        case 'pdf':
          // parsedTextContent = await parsePdf(fileBuffer); // Service réel
          parsedTextContent = `Contenu PDF simulé pour ${input.fileName}. Ceci est un long texte pour simuler le contenu d'un document PDF. Il contient plusieurs phrases et paragraphes.`;
          break;
        case 'csv':
          // parsedTextContent = await parseCsv(fileBuffer.toString('utf-8')); // Service réel
          parsedTextContent = `Contenu CSV simulé pour ${input.fileName}.\nHeader1,Header2\nVal1,Val2\nVal3,Val4`;
          break;
        case 'excel':
          // parsedTextContent = await parseExcel(fileBuffer); // Service réel
          parsedTextContent = `Contenu Excel simulé pour ${input.fileName}. Feuille1: CellA1, CellB1.`;
          break;
        case 'text':
            parsedTextContent = fileBuffer.toString('utf-8');
            break;
        // Cas Notion/Airtable nécessiteraient des services d'extraction spécifiques
        case 'notion':
        case 'airtable':
          // parsedTextContent = await fetchAndParseExternalSource(input.sourceType, input.externalSourceId, process.env.NOTION_API_KEY ou AIRTABLE_API_KEY);
          parsedTextContent = `Contenu simulé pour ${input.sourceType} ID: ${input.externalSourceId || 'N/A'}`;
          break;
        default:
          throw new Error(`Type de source non supporté: ${input.sourceType}`);
      }
      const contentPreview = parsedTextContent.substring(0, 250) + (parsedTextContent.length > 250 ? "..." : "");
      // await firestore.collection('datasets').doc(datasetId).update({ status: 'chunking', contentPreview });
      console.log(`[coccinelleOnUploadDocumentFlow] Document parsé. Aperçu: ${contentPreview}. Statut: chunking.`);

      // Étape 2: Segmenter le texte (Chunking)
      // const chunks = chunkText(parsedTextContent, input.chunkSize, input.chunkOverlap); // Service réel
      const chunks = [parsedTextContent.substring(0, input.chunkSize), parsedTextContent.substring(input.chunkSize)]; // Simulation simple
      console.log(`[coccinelleOnUploadDocumentFlow] Texte segmenté en ${chunks.length} morceaux. Statut: embedding.`);
      // await firestore.collection('datasets').doc(datasetId).update({ status: 'embedding' });

      // Étape 3: Générer les embeddings pour chaque morceau
      // const embeddings = await generateEmbeddings(chunks, process.env.OPENAI_API_KEY); // Service réel
      // Simulation d'embeddings (juste pour la structure)
      const embeddings = chunks.map((_, i) => Array(1536).fill(Math.random() * i)); // OpenAI ada-002 a 1536 dimensions
      console.log(`[coccinelleOnUploadDocumentFlow] Embeddings générés pour ${embeddings.length} morceaux. Statut: indexing.`);
      // await firestore.collection('datasets').doc(datasetId).update({ status: 'indexing' });

      // Étape 4: Indexer les vecteurs dans la base de données vectorielle (ex: Pinecone)
      // await indexVectorsInPinecone(datasetId, input.companyId, embeddings, chunks, process.env.PINECONE_API_KEY, process.env.PINECONE_ENVIRONMENT, process.env.PINECONE_INDEX_NAME); // Service réel
      const vectorCount = embeddings.length;
      console.log(`[coccinelleOnUploadDocumentFlow] ${vectorCount} vecteurs indexés (simulation) dans Pinecone pour dataset ${datasetId}.`);

      // Étape 5: Mettre à jour le statut final dans Firestore
      // await firestore.collection('datasets').doc(datasetId).update({
      //   status: 'completed',
      //   vectorCount: vectorCount,
      //   indexedAt: new Date(), // Ou Timestamp.now()
      // });
      console.log(`[coccinelleOnUploadDocumentFlow] Dataset ${datasetId} marqué comme 'completed'.`);

      return {
        datasetId: datasetId,
        status: 'completed',
        vectorCount: vectorCount,
        contentPreview: contentPreview,
      };

    } catch (error: any) {
      console.error(`[coccinelleOnUploadDocumentFlow] Erreur durant le traitement du document ${input.fileName}:`, error);
      // try {
      //   await firestore.collection('datasets').doc(datasetId).update({
      //     status: 'failed',
      //     errorMessage: error.message,
      //   });
      // } catch (fsError) {
      //   console.error(`[coccinelleOnUploadDocumentFlow] Erreur additionnelle lors de la mise à jour du statut d'échec pour ${datasetId}:`, fsError);
      // }
      return {
        datasetId: datasetId,
        status: 'failed',
        errorMessage: error.message,
        contentPreview: parsedTextContent ? parsedTextContent.substring(0, 250) + "..." : undefined,
      };
    }
  }
);
