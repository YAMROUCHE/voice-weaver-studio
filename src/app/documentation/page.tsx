
'use client';
import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DemoRequestPopup } from '@/components/landing/demo-request-popup';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const faqItems = [
  {
    id: "faq-1",
    question: "Est-ce que nos clients vont percevoir qu'ils parlent à une IA ?",
    answer: "Par souci de transparence, l'agent se présente comme un assistant virtuel, mais sa voix est si naturelle et ses réponses si pertinentes que la conversation reste fluide et professionnelle. Les retours de nos clients montrent que 92% des appelants sont satisfaits de l'échange et apprécient la réactivité du service."
  },
  {
    id: "faq-2",
    question: "Comment l'agent gère-t-il les situations complexes ou les questions techniques ?",
    answer: "L'agent est formé pour gérer la majorité des demandes immobilières courantes. Pour les situations complexes ou très spécifiques, il peut soit proposer de transférer l'appel à un conseiller disponible, soit prendre les coordonnées du client pour qu'un expert le rappelle rapidement. Vous gardez ainsi le contrôle sur les cas qui nécessitent vraiment votre expertise."
  },
  {
    id: "faq-3",
    question: "Qu'en est-il de la protection des données de nos clients ?",
    answer: "Notre solution est 100% conforme au RGPD. Les données recueillies sont stockées de manière sécurisée et ne sont utilisées que dans le cadre de votre relation commerciale avec vos clients. Vous restez propriétaire de toutes les données. Nous proposons également des options de suppression automatique après une période définie."
  },
  {
    id: "faq-4",
    question: "Comment intégrer l'agent à notre système téléphonique actuel ?",
    answer: "Notre solution s'adapte à votre infrastructure existante, quelle qu'elle soit. Nous pouvons soit rediriger vos appels vers notre système, soit intégrer notre agent directement dans votre standard téléphonique. L'installation est transparente et ne nécessite aucune modification de vos numéros de téléphone actuels."
  },
  {
    id: "faq-5",
    question: "Quel est le retour sur investissement pour une agence immobilière ?",
    answer: "Nos clients constatent un ROI positif dès le premier mois d'utilisation. En moyenne, une agence de taille moyenne :\n\nÉconomise 60 à 80 heures de travail par mois sur la gestion des appels\nAugmente de 25 à 30% le nombre de rendez-vous qualifiés\nRéduit de 15% le taux d'annulation des visites grâce aux rappels automatiques\nAméliore la satisfaction client grâce à une disponibilité 24/7"
  }
];

const CircledNumber = ({ number }: { number: string | number }) => (
  <div className="flex items-center justify-center h-10 w-10 bg-primary text-primary-foreground rounded-full font-bold text-lg mb-2 mr-4 shrink-0 shadow">
    {number}
  </div>
);

export default function DocumentationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <article className="prose prose-neutral dark:prose-invert prose-lg max-w-4xl mx-auto text-foreground">
          <header className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">Guide Immobilier</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">L'Assistant Vocal IA pour les professionnels de l'immobilier</h1>
            <p className="text-xl text-muted-foreground">Découvrez comment notre technologie révolutionne la gestion des appels et des rendez-vous dans les agences immobilières, pour un gain de temps et d'efficacité significatif.</p>
          </header>

          <section id="pourquoi-ia" className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-foreground">Pourquoi un Assistant Vocal IA ?</h2>
            <p className="text-lg text-muted-foreground mb-6">Les bénéfices concrets pour votre agence immobilière</p>
            <p>En tant que responsable d'agence immobilière, vous savez combien le temps est précieux. Notre assistant vocal IA a été conçu spécifiquement pour répondre aux défis quotidiens que vous rencontrez :</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Répondre aux appels même lorsque toute votre équipe est occupée</li>
              <li>Filtrer et qualifier les demandes pour vous concentrer sur les prospects les plus sérieux</li>
              <li>Gérer les questions répétitives sur les biens disponibles</li>
              <li>Organiser efficacement les visites sans multiples appels et messages</li>
            </ul>
            <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Les avantages concrets pour votre agence :</h3>
            <ul className="list-disc pl-6 space-y-2 my-4">
                <li><strong>Gain de temps considérable :</strong> Économisez jusqu'à 15-20 heures par semaine sur la gestion des appels et la planification des rendez-vous.</li>
                <li><strong>Aucun appel manqué :</strong> Ne perdez plus jamais d'opportunités commerciales, même en dehors des heures d'ouverture.</li>
            </ul>
            <blockquote className="border-l-4 border-primary pl-6 py-4 my-6 bg-primary/5 rounded-r-md">
              <p className="text-lg font-medium text-foreground">Notre promesse :</p>
              <p className="text-foreground">"Notre agent vocal IA vous permet de vous concentrer sur ce que vous faites le mieux : conseiller vos clients et conclure des ventes, pendant que nous gérons les appels entrants et la qualification des leads."</p>
            </blockquote>
          </section>

          <section id="comment-ca-marche" className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-foreground">Comment ça fonctionne concrètement ?</h2>
            <p className="text-lg text-muted-foreground mb-6">Un parcours client simplifié et efficace</p>
            <p>Notre technologie s'intègre de manière transparente à votre processus existant, sans perturber votre façon de travailler. Voici le déroulement typique d'un appel avec notre agent vocal :</p>
            <div className="space-y-8 my-6">
              {[
                { num: 1, title: "Réception et accueil", desc: "Un client appelle votre agence. L'agent vocal répond instantanément en se présentant au nom de votre agence avec une voix naturelle et professionnelle." },
                { num: 2, title: "Compréhension des besoins", desc: "L'agent engage une conversation naturelle pour comprendre précisément ce que recherche le client : type de bien, localisation, budget, délai du projet immobilier..." },
                { num: 3, title: "Qualification et information", desc: "Selon les réponses, l'agent qualifie le prospect et lui donne des informations pertinentes sur les biens disponibles correspondant à ses critères." },
                { num: 4, title: "Proposition de rendez-vous", desc: "Pour les prospects qualifiés, l'agent consulte automatiquement les disponibilités de votre équipe et propose des créneaux de visite disponibles en temps réel." },
                { num: 5, title: "Communication instantanée", desc: "Après l'appel, vous et votre équipe recevez immédiatement un résumé détaillé par email et SMS, avec toutes les informations du prospect et l'enregistrement de l'échange." }
              ].map(step => (
                <div key={step.num} className="flex items-start">
                  <CircledNumber number={step.num} />
                  <div>
                    <h4 className="text-xl font-semibold text-foreground mb-1">{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-muted/40 rounded-lg shadow-md my-8">
                <h4 className="text-xl font-semibold text-foreground mb-2">Impact sur votre quotidien :</h4>
                <p>Imaginez que pendant que vous êtes en visite avec un client, l'agent vocal qualifie 3 nouveaux prospects et planifie 2 visites dans votre agenda. À votre retour, vous avez toutes les informations à disposition pour préparer vos prochains rendez-vous, sans avoir manqué aucune opportunité.</p>
            </div>
          </section>

          <section id="integration" className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-foreground">Intégration dans votre agence</h2>
            <p className="text-lg text-muted-foreground mb-6">Simple, rapide et sans perturbation</p>
            <p>L'intégration de notre agent vocal dans votre agence est un processus simple qui ne perturbe pas votre activité quotidienne. Nous nous adaptons à votre organisation actuelle, pas l'inverse.</p>
            <ul className="list-disc list-inside pl-0 space-y-3 my-6 marker:text-primary">
              <li><strong>Mise en place en 24h :</strong> Aucune installation de matériel physique n'est nécessaire. Notre solution est entièrement basée sur le cloud et peut être opérationnelle dès le lendemain de votre souscription.</li>
              <li><strong>Personnalisation complète :</strong> L'agent vocal s'adapte à l'identité de votre agence : nom, style de communication, types de biens à mettre en avant, procédures de qualification... tout est paramétrable.</li>
              <li><strong>Formation de l'équipe :</strong> Nous formons votre équipe en 1 heure seulement pour qu'elle puisse tirer le maximum de notre solution : consultation des résumés d'appels, suivi des rendez-vous planifiés, etc.</li>
              <li><strong>Synchronisation calendrier :</strong> Notre solution se connecte directement à vos outils existants : Google Calendar, Outlook, et les principaux logiciels immobiliers du marché (Pericles, Hektor, etc.).</li>
            </ul>
            <div className="p-6 border border-border rounded-lg shadow-md my-8 bg-background">
                <p className="italic text-foreground">"Nous avons intégré l'agent vocal en quelques jours. La transition a été imperceptible pour nos clients, mais l'impact sur notre productivité a été immédiat. Notre équipe gagne 2h par jour sur la gestion des appels et nos rendez-vous sont mieux qualifiés."</p>
                <p className="text-right font-semibold text-muted-foreground mt-2">– Jean D., Directeur d'agence à Lyon</p>
            </div>
          </section>

          <section id="planification-auto" className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-foreground">Planification automatisée des visites</h2>
            <p className="text-lg text-muted-foreground mb-6">Optimisation de votre agenda et de votre CRM</p>
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg shadow">
                    <h4 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center"><XCircle className="h-6 w-6 mr-2"/>Le problème actuel :</h4>
                    <ul className="list-disc pl-5 space-y-1 text-red-600 dark:text-red-300">
                        <li>Multiples appels et messages pour caler une visite</li>
                        <li>Informations clients éparpillées</li>
                        <li>Temps perdu à ressaisir les informations</li>
                        <li>Risque élevé d'erreurs et d'oublis</li>
                    </ul>
                </div>
                 <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg shadow">
                    <h4 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center"><CheckCircle className="h-6 w-6 mr-2"/>Notre solution intégrée :</h4>
                    <ul className="list-disc pl-5 space-y-1 text-green-600 dark:text-green-300">
                        <li>Planification instantanée pendant l'appel</li>
                        <li>Mise à jour automatique des agendas</li>
                        <li>Création de fiches prospects complètes</li>
                        <li>Rappels automatiques anti-annulation</li>
                    </ul>
                </div>
            </div>
            <h4 className="text-xl font-semibold text-foreground mt-8 mb-3">Le parcours de planification en pratique :</h4>
             <ol className="list-decimal list-inside space-y-2 marker:font-semibold marker:text-primary">
                <li>Le client appelle : L'agent vocal identifie son besoin de visiter un bien précis</li>
                <li>Consultation des disponibilités : L'agent accède en temps réel à l'agenda de vos conseillers</li>
                <li>Proposition de créneaux : Le client choisit parmi les horaires disponibles</li>
                <li>Confirmation automatique : Un email est envoyé au client et une alerte à votre équipe</li>
            </ol>
            <h4 className="text-xl font-semibold text-foreground mt-8 mb-3">Résultats observés chez nos clients :</h4>
            <div className="grid sm:grid-cols-3 gap-4 text-center my-6">
                <div className="p-4 border border-primary/30 rounded-lg bg-primary/5 shadow-md">
                    <div className="text-4xl font-bold text-primary">+40%</div>
                    <div className="text-muted-foreground">de visites planifiées</div>
                </div>
                <div className="p-4 border border-primary/30 rounded-lg bg-primary/5 shadow-md">
                    <div className="text-4xl font-bold text-primary">-60%</div>
                    <div className="text-muted-foreground">de tâches administratives</div>
                </div>
                <div className="p-4 border border-primary/30 rounded-lg bg-primary/5 shadow-md">
                    <div className="text-4xl font-bold text-primary">-30%</div>
                    <div className="text-muted-foreground">d'annulations de RDV</div>
                </div>
            </div>
          </section>

          <section id="faq-doc" className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-foreground">Questions fréquentes</h2>
            <p className="text-lg text-muted-foreground mb-6">Les réponses aux interrogations des agences immobilières</p>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem value={item.id} key={item.id}>
                  <AccordionTrigger className="text-lg text-left hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {item.answer.split('\n').map((paragraph, index) => (
                        <p key={index} className={paragraph.trim() === "" ? "mt-2" : ""}>{paragraph}</p>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section id="cta-doc" className="text-center py-12 border-t border-border">
            <h2 className="text-3xl font-semibold mb-4 text-foreground">Prêt à passer à l'action ?</h2>
            <div className="mt-6 flex justify-center">
                <DemoRequestPopup />
            </div>
          </section>
        </article>
      </main>
      <LandingFooter />
    </div>
  );
}
