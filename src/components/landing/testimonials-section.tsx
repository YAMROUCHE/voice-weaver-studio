
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Star, Sparkles } from 'lucide-react';

const testimonials = [
  {
    name: 'Sophie D.',
    role: "Directrice d'Agence",
    image: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman portrait',
    quote: "coccinelle.ai a révolutionné la gestion de nos prospects. Notre agent IA est incroyablement efficace et nous fait gagner un temps précieux !",
    rating: 5,
  },
  {
    name: 'Marc L.',
    role: 'Agent Immobilier',
    image: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait',
    quote: "La configuration a été simple et la possibilité d'entraîner l'IA sur nos propres listes de biens est un vrai plus. Je recommande vivement.",
    rating: 5,
  },
  {
    name: 'Isabelle R.',
    role: 'Responsable Commerciale',
    image: 'https://placehold.co/100x100.png',
    dataAiHint: 'person office',
    quote: "Nous avons constaté une nette amélioration de notre taux de qualification de prospects et une meilleure organisation des visites depuis que nous utilisons coccinelle.ai.",
    rating: 4,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Apprécié par des Agences Immobilières Comme la Vôtre
        </h2>
        <p className="text-lg text-muted-foreground text-center max-w-xl mx-auto mb-12">
          Découvrez comment coccinelle.ai aide les agences à améliorer leurs interactions clients et leur efficacité.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="shadow-lg">
              <CardContent className="pt-6">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/register?trial=true">
              Rejoindre avec 14 jours gratuits <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
