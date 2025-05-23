
import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneCall, MessageCircle, CalendarCheck, BellRing, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const steps = [
  {
    title: "1. Connexion & Configuration Initiale",
    description: "Connectez votre numéro Twilio et configurez les bases de votre agent coccinelle.ai : nom, instructions principales (prompt), et choix de la voix (XTTS ou ElevenLabs). Liez votre compte Cal.com pour la gestion des agendas.",
    icon: <PhoneCall className="h-10 w-10 text-primary mb-4" />,
    imageSrc: "https://placehold.co/600x400.png",
    imageAlt: "Configuration de l'agent IA",
    aiHint: "settings interface"
  },
  {
    title: "2. L'IA Appelle et Qualifie le Prospect",
    description: "Lorsqu'un nouveau lead est identifié (ou sur déclenchement manuel), coccinelle.ai initie l'appel. Grâce à la transcription Whisper et à la puissance de GPT-4, l'IA mène une conversation naturelle pour comprendre les besoins du prospect (type de bien, budget, localisation, etc.).",
    icon: <MessageCircle className="h-10 w-10 text-primary mb-4" />,
    imageSrc: "https://placehold.co/600x400.png",
    imageAlt: "Conversation entre l'IA et le prospect",
    aiHint: "chat conversation"
  },
  {
    title: "3. Prise de Rendez-vous Automatisée",
    description: "Si le prospect est qualifié et intéressé, coccinelle.ai consulte les disponibilités via Cal.com et propose des créneaux pour une visite ou un appel de suivi. Le rendez-vous est confirmé et ajouté aux agendas.",
    icon: <CalendarCheck className="h-10 w-10 text-primary mb-4" />,
    imageSrc: "https://placehold.co/600x400.png",
    imageAlt: "Calendrier avec rendez-vous pris",
    aiHint: "calendar schedule"
  },
  {
    title: "4. Notification & Suivi",
    description: "Une fois le rendez-vous fixé, une confirmation est envoyée au prospect (SMS via Twilio ou email via SendGrid). Toutes les informations de l'appel (enregistrement, transcription, résumé, scoring du lead) sont sauvegardées dans votre tableau de bord coccinelle.ai.",
    icon: <BellRing className="h-10 w-10 text-primary mb-4" />,
    imageSrc: "https://placehold.co/600x400.png",
    imageAlt: "Notification de rendez-vous",
    aiHint: "notification bell"
  },
  {
    title: "5. Amélioration Continue avec Vos Données",
    description: "Synchronisez vos propres documents (PDF de biens, listes clients CSV, etc.). coccinelle.ai les indexe pour enrichir ses connaissances et fournir des réponses encore plus pertinentes et personnalisées lors des appels (RAG).",
    icon: <CheckCircle className="h-10 w-10 text-primary mb-4" />,
    imageSrc: "https://placehold.co/600x400.png",
    imageAlt: "Synchronisation de documents",
    aiHint: "data sync cloud"
  }
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-grow py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-8">
            Comment Fonctionne coccinelle.ai ?
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Découvrez étape par étape comment notre assistant vocal IA transforme la gestion de vos leads immobiliers et la prise de rendez-vous.
          </p>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <Card key={index} className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className={`grid md:grid-cols-2 items-center ${index % 2 === 1 ? 'md:grid-flow-row-dense md:[&>*:last-child]:col-start-1' : ''}`}>
                  <div className={`p-8 md:p-12 ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                    <div className="flex justify-center md:justify-start mb-4">{step.icon}</div>
                    <CardTitle className="text-2xl md:text-3xl font-semibold text-foreground mb-4 text-center md:text-left">{step.title}</CardTitle>
                    <CardContent className="p-0">
                      <p className="text-muted-foreground text-center md:text-left">{step.description}</p>
                    </CardContent>
                  </div>
                  <div className="relative h-64 md:h-full w-full">
                    <Image
                      src={step.imageSrc}
                      alt={step.imageAlt}
                      fill
                      style={{ objectFit: 'cover' }}
                      data-ai-hint={step.aiHint}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
