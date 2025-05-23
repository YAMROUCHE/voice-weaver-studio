
import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  PhoneForwarded,
  RefreshCw,
  UsersRound,
  Headset,
  CalendarCheck2,
  FileText,
  Search,
  BarChart3,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: FeatureCardProps[] = [
  {
    icon: PhoneForwarded,
    title: 'Gestion des appels entrants',
    description: "Réception automatisée des appels 24h/24, 7j/7. L'agent vocal répond à toutes les questions sur vos biens immobiliers.",
  },
  {
    icon: RefreshCw,
    title: 'Rappel prospects',
    description: 'Relance intelligente de vos prospects avec des propositions de biens adaptés à leurs critères, même élargis.',
  },
  {
    icon: UsersRound,
    title: 'Matching prospects dormants',
    description: 'Analyse et réactivation de votre base de prospects inactifs en identifiant les opportunités correspondant à votre portefeuille actuel.',
  },
  {
    icon: Headset,
    title: 'Assistance en temps réel',
    description: 'Support IA pour vos agents pendant leurs appels, avec mise à jour automatique du CRM et génération de résumés.',
  },
  {
    icon: CalendarCheck2,
    title: 'Intégration agenda',
    description: 'Synchronisation avec Google Calendar et Office 365 pour la planification automatique des rendez-vous.',
  },
  {
    icon: FileText,
    title: 'Résumés intelligents',
    description: 'Génération automatique de synthèses détaillées après chaque interaction, avec points clés et recommandations.',
  },
  {
    icon: Search,
    title: 'Analyse des besoins',
    description: 'Qualification précise des besoins des clients pour des propositions pertinentes et un taux de conversion optimisé.',
  },
  {
    icon: BarChart3,
    title: 'Tableaux de bord avancés',
    description: "Suivi détaillé de l'efficacité des solutions IA avec métriques personnalisables et rapports automatiques.",
  },
];

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
    <CardHeader className="items-start pt-5 pb-3">
      <div className="p-2 bg-primary/10 rounded-lg mb-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-grow py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="text-primary border-primary/50 bg-primary/5 py-1 px-3 mb-4 text-sm">
              Fonctionnalités
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Un assistant vocal complet pour votre agence immobilière
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Notre agent vocal IA s'occupe de toutes les interactions téléphoniques avec vos prospects et clients, vous permettant de vous concentrer sur ce qui compte vraiment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
