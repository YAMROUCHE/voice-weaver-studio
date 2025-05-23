
import { config } from 'dotenv';
config();

// Previous Voice Weaver flows (can be kept or removed if not relevant)
// import '@/ai/flows/summarize-call.ts'; // Original
// import '@/ai/flows/answer-call.ts'; // Original
// import '@/ai/flows/generate-lead-score.ts'; // Original

// coccinelle.ai flows
// Original onCallReceivedFlow is being split/replaced by onCallStartFlow and onSpeechSegmentFlow
// import '@/ai/flows/coccinelle/on-call-received-flow.ts'; // Original, to be deprecated or refactored

import '@/ai/flows/coccinelle/on-call-start-flow.ts'; // New
import '@/ai/flows/coccinelle/on-speech-segment-flow.ts'; // New
import '@/ai/flows/coccinelle/on-call-ended-flow.ts'; // Existing, reviewed
import '@/ai/flows/coccinelle/on-appointment-confirmed-flow.ts'; // Renamed/refactored from on-lead-qualified-flow.ts
import '@/ai/flows/coccinelle/on-lead-follow-up-flow.ts'; // New
import '@/ai/flows/coccinelle/on-upload-document-flow.ts'; // Existing, reviewed
