
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Prêt à Transformer la Communication de Votre Agence ?
        </h2>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
          Rejoignez les agences qui utilisent l'IA pour améliorer les interactions clients et optimiser leurs opérations.
          Commencez à créer votre assistant vocal intelligent dès aujourd'hui.
        </p>
        <Button size="lg" variant="secondary" asChild className="shadow-lg text-primary hover:bg-secondary/90">
          <Link href="/register?trial=true">
            Démarrer l'essai gratuit (14 jours) <Sparkles className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
