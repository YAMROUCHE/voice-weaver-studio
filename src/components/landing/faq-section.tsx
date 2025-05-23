
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const faqs = [
  {
    question: "Avec quelles API coccinelle.ai s'intègre-t-il ?",
    answer: "coccinelle.ai s'intègre avec Twilio pour la téléphonie, des modèles avancés pour la transcription (STT), la génération de réponses (LLM) et la synthèse vocale (TTS). Nous supportons également Cal.com pour la prise de rendez-vous et SendGrid pour les notifications.",
  },
  {
    question: "Puis-je utiliser mes propres documents pour entraîner l'IA ?",
    answer: "Oui, vous pouvez téléverser des fichiers PDF, CSV, etc. coccinelle.ai traitera ces données pour fournir des réponses plus contextuelles et pertinentes pour votre assistant vocal immobilier.",
  },
  {
    question: "Y a-t-il un essai gratuit disponible ?",
    answer: "Oui, nous offrons un essai gratuit de 14 jours qui vous donne accès à la plupart de nos fonctionnalités pour que vous puissiez expérimenter la puissance de coccinelle.ai. Vous pourrez ensuite choisir un plan ou continuer avec des fonctionnalités limitées si disponibles.",
  },
  {
    question: "Comment mes données sont-elles stockées et sécurisées ?",
    answer: "Vos données sont stockées de manière sécurisée. Nous mettons en œuvre des mesures de sécurité strictes pour garantir que seuls les utilisateurs autorisés peuvent accéder à leurs données respectives.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Questions Fréquemment Posées
        </h2>
        <p className="text-lg text-muted-foreground text-center max-w-xl mx-auto mb-12">
          Vous avez des questions ? Nous avons les réponses. Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter.
        </p>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg text-left hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/register?trial=true">
              Commencer mon essai de 14 jours <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
