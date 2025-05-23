
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneOutgoing, MessageSquareText, CalendarPlus, Sparkles } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const steps = [
  {
    icon: <PhoneOutgoing className="h-8 w-8 text-primary" />,
    title: 'Appel Automatique des Leads',
    description: "L'IA de coccinelle.ai contacte automatiquement vos prospects.",
  },
  {
    icon: <MessageSquareText className="h-8 w-8 text-primary" />,
    title: 'Échange & Qualification',
    description: "Elle engage la conversation, comprend et qualifie le besoin du prospect.",
  },
  {
    icon: <CalendarPlus className="h-8 w-8 text-primary" />,
    title: 'Prise de RDV Intelligente',
    description: "L'IA fixe un rendez-vous directement dans votre agenda et celui du client.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Fonctionnement en 3 Étapes Simples
        </h2>
        <p className="text-lg text-muted-foreground text-center max-w-xl mx-auto mb-12">
          Mettre en place votre assistant vocal coccinelle.ai est rapide et intuitif.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  {step.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-foreground text-center">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/register?trial=true">
              Essayer coccinelle.ai 14 jours gratuitement <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
