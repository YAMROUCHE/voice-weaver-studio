
import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Brain, Users, Zap } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              À Propos de coccinelle.ai
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Notre mission : Révolutionner la productivité des professionnels de l'immobilier grâce à une synergie intelligente entre l'humain et l'IA.
            </p>
          </div>
        </section>

        {/* Our Vision Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Notre Vision : L'IA au Service de l'Humain
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Chez coccinelle.ai, nous croyons que l'intelligence artificielle n'est pas là pour remplacer l'expertise humaine, mais pour l'augmenter. Notre objectif est de libérer les agents immobiliers des tâches répétitives et chronophages pour qu'ils puissent se concentrer sur ce qu'ils font de mieux : construire des relations, négocier et conclure des affaires.
                </p>
                <p className="text-lg text-muted-foreground">
                  Nous développons des solutions qui s'intègrent naturellement dans votre quotidien, améliorant votre efficacité et la satisfaction de vos clients. coccinelle.ai est conçu pour être un véritable copilote, proactif et intelligent.
                </p>
              </div>
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://placehold.co/600x600.png"
                  alt="Vision IA et Humain"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                  data-ai-hint="futuristic abstract human AI"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Commitment Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Notre Engagement pour Votre Productivité
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center p-6">
                <Brain className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">IA Intelligente</h3>
                <p className="text-muted-foreground">
                  Des algorithmes de pointe pour des conversations naturelles et une qualification précise des leads.
                </p>
              </div>
              <div className="flex flex-col items-center p-6">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Efficacité Maximale</h3>
                <p className="text-muted-foreground">
                  Automatisation des appels et de la prise de RDV pour un gain de temps significatif.
                </p>
              </div>
              <div className="flex flex-col items-center p-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Centré sur l'Utilisateur</h3>
                <p className="text-muted-foreground">
                  Une interface intuitive et une configuration simple pour une adoption rapide par vos équipes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section (Optional - Placeholder) */}
        {/*
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
              Rencontrez l'Équipe (Optionnel)
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="person photo" />
                    <AvatarFallback>P{i}</AvatarFallback>
                  </Avatar>
                  <h4 className="font-semibold text-foreground">Nom Prénom</h4>
                  <p className="text-sm text-muted-foreground">Rôle</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        */}
      </main>
      <LandingFooter />
    </div>
  );
}
