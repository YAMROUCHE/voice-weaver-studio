
import { CalendarOff, Clock, MessageSquareQuote, Target, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
  { icon: <CalendarOff className="h-6 w-6 text-accent" />, text: 'Ne ratez plus jamais un rendez-vous potentiel' },
  { icon: <Clock className="h-6 w-6 text-accent" />, text: 'Gagnez un temps précieux et concentrez-vous sur la vente' },
  { icon: <MessageSquareQuote className="h-6 w-6 text-accent" />, text: 'Offrez une réponse instantanée à vos prospects, 24h/24 et 7j/7' },
  { icon: <Target className="h-6 w-6 text-accent" />, text: 'Qualifiez mieux vos leads pour augmenter le taux de transformation et conclure plus rapidement.' },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              En Quoi coccinelle.ai Change la Donne pour Votre Agence ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Coccinelle.ai n'est pas juste un outil, c'est votre partenaire stratégique pour une productivité décuplée et une expérience client améliorée.
            </p>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-foreground">
                  {feature.icon}
                  <span className="ml-3 text-md">{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://placehold.co/800x600.png"
              alt="Illustration des avantages coccinelle.ai"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
              data-ai-hint="business efficiency team"
            />
          </div>
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/register?trial=true">
              Découvrir avec 14 jours d'essai gratuit <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
