
import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';

export default function PrivacyPolicyPage() {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Politique de Confidentialité</h1>
        <div className="prose prose-neutral dark:prose-invert prose-lg max-w-4xl mx-auto text-foreground">
          <p className="text-sm text-muted-foreground">Dernière mise à jour : {currentDate}</p>
          
          <p>Bienvenue sur coccinelle.ai (ci-après dénommé "nous", "notre" ou "nos"). Nous nous engageons à protéger la vie privée de nos utilisateurs (ci-après dénommés "vous" ou "votre"). Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre site web et nos services (collectivement, les "Services").</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">1. Informations que nous collectons</h2>
          <p>Nous pouvons collecter des informations personnelles vous concernant de différentes manières :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Informations fournies directement :</strong> Lorsque vous créez un compte, vous nous fournissez des informations telles que votre nom, votre adresse e-mail, le nom de votre entreprise et vos informations de contact.</li>
            <li><strong>Informations collectées automatiquement :</strong> Lorsque vous utilisez nos Services, nous pouvons collecter automatiquement des informations sur votre appareil et votre utilisation de nos Services, y compris votre adresse IP, type de navigateur, pages visitées, et dates/heures d'accès.</li>
            <li><strong>Données liées aux appels :</strong> Si vous utilisez nos fonctionnalités d'assistant vocal, nous traitons les enregistrements audio des appels, leurs transcriptions et les résumés générés. Ces données sont associées à votre compte utilisateur.</li>
            <li><strong>Données des documents téléversés :</strong> Si vous utilisez la fonctionnalité de synchronisation des données, nous traitons le contenu des documents que vous téléversez (PDF, CSV, etc.) pour permettre à l'agent IA de fournir des réponses contextuelles.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">2. Utilisation de vos informations</h2>
          <p>Nous utilisons les informations que nous collectons aux fins suivantes :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Fournir, exploiter et améliorer nos Services.</li>
            <li>Personnaliser votre expérience utilisateur.</li>
            <li>Traiter les transactions et gérer votre compte.</li>
            <li>Communiquer avec vous, y compris pour répondre à vos demandes d'assistance.</li>
            <li>Analyser l'utilisation des Services pour améliorer nos offres.</li>
            <li>Assurer la sécurité de nos Services et prévenir la fraude.</li>
            <li>Respecter nos obligations légales.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">3. Partage de vos informations</h2>
          <p>Nous ne partageons pas vos informations personnelles avec des tiers, sauf dans les cas suivants :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Avec votre consentement :</strong> Nous pouvons partager vos informations si vous nous y autorisez.</li>
            <li><strong>Fournisseurs de services :</strong> Nous pouvons partager des informations avec des tiers fournisseurs de services qui nous aident à exploiter nos Services (par exemple, hébergement, traitement des paiements, services d'IA comme Twilio, OpenAI, Cal.com). Ces fournisseurs sont contractuellement tenus de protéger vos informations.</li>
            <li><strong>Obligations légales :</strong> Nous pouvons divulguer vos informations si la loi l'exige ou en réponse à des processus légaux valides.</li>
            <li><strong>Protection de nos droits :</strong> Nous pouvons divulguer des informations pour protéger nos droits, notre propriété ou notre sécurité, ou ceux de nos utilisateurs ou du public.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">4. Sécurité de vos informations</h2>
          <p>Nous prenons des mesures de sécurité raisonnables pour protéger vos informations personnelles contre l'accès non autorisé, l'utilisation, la divulgation, l'altération ou la destruction. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est totalement sécurisée.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">5. Conservation des données</h2>
          <p>Nous conservons vos informations personnelles aussi longtemps que nécessaire pour atteindre les objectifs décrits dans cette Politique de Confidentialité, sauf si une période de conservation plus longue est requise ou autorisée par la loi.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">6. Vos droits</h2>
          <p>Selon votre juridiction, vous pouvez disposer de certains droits concernant vos informations personnelles, tels que le droit d'accès, de rectification, de suppression, de limitation du traitement ou de portabilité des données. Pour exercer ces droits, veuillez nous contacter.</p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">7. Cookies et technologies similaires</h2>
          <p>Nous pouvons utiliser des cookies et des technologies similaires pour collecter des informations sur votre interaction avec nos Services. Vous pouvez contrôler l'utilisation des cookies au niveau de votre navigateur.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">8. Modifications de cette Politique de Confidentialité</h2>
          <p>Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre. Nous vous informerons de tout changement important en publiant la nouvelle politique sur notre site et en mettant à jour la date de "dernière mise à jour".</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">9. Nous contacter</h2>
          <p>Si vous avez des questions ou des préoccupations concernant cette Politique de Confidentialité ou nos pratiques en matière de données, veuillez nous contacter à :</p>
          <p>Email : <a href="mailto:youssef.amrouche@coccinelle.ai" className="text-primary hover:underline">youssef.amrouche@coccinelle.ai</a></p>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
