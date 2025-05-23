
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const pricingPlans = [
  {
    name: 'Essai Gratuit',
    price: '0€',
    period: '',
    description: "Découvrez coccinelle.ai pendant 14 jours.",
    features: ['1 Assistant vocal', '50 Appels inclus', "Fonctionnalités Pro incluses durant l'essai"],
    cta: "Démarrer l'essai (14 jours)",
    href: '/register?trial=true',
    isPopular: false, // Adjusted as "Starter" is popular
  },
  {
    name: 'Starter',
    price: '49€',
    period: '/mois',
    description: "Idéal pour démarrer et automatiser",
    features: ['1 Assistant vocal', '100 Appels inclus/mois', 'Prise de RDV incluse', 'Support Email'],
    cta: 'Choisir Starter',
    href: '/register?plan=starter',
    isPopular: true,
  },
  {
    name: 'Pro',
    price: '99€',
    period: '/mois',
    description: "Pour les agences en croissance",
    features: ['3 Assistants vocaux', '250 Appels inclus/mois', 'IA personnalisée (prompt)', 'Support prioritaire'],
    cta: 'Passer Pro',
    href: '/register?plan=pro',
    isPopular: false,
  },
  {
    name: 'Entreprise',
    price: 'Sur Devis',
    period: '',
    description: "Solutions sur-mesure et intégrations",
    features: ['Assistants illimités', "Volume d'appels flexible", 'API et intégration CRM', 'Gestionnaire de compte dédié'],
    cta: 'Nous Contacter',
    href: '/contact',
    isPopular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Nos Offres coccinelle.ai
        </h2>
        <p className="text-lg text-muted-foreground text-center max-w-xl mx-auto mb-12">
          Choisissez le plan adapté à la taille et aux ambitions de votre agence immobilière.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className={`shadow-lg flex flex-col ${plan.isPopular ? 'border-primary border-2 ring-4 ring-primary/20' : ''}`}>
              {plan.isPopular && plan.name !== 'Essai Gratuit' && (
                <div className="bg-primary text-primary-foreground text-sm font-semibold py-1 px-3 rounded-t-md text-center -mb-px">
                  Le Plus Populaire
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-foreground">{plan.name}</CardTitle>
                <CardDescription className="h-10">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                  <br />
                  <span className="text-sm text-muted-foreground">{plan.description}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-accent mr-2 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={cn(
                    "w-full",
                    plan.name === 'Essai Gratuit' && "text-accent-foreground hover:bg-accent/90"
                  )}
                  variant={plan.isPopular ? 'default' : (plan.name === 'Essai Gratuit' ? 'default' : 'outline')}
                  asChild
                  style={plan.name === 'Essai Gratuit' ? { backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' } : {}}
                >
                  <Link href={plan.href}>
                    {plan.cta} {plan.name === 'Essai Gratuit' && <Sparkles className="ml-2 h-5 w-5" />}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
