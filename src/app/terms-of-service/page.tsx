
import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';

export default function TermsOfServicePage() {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Conditions Générales d'Utilisation</h1>
        <div className="prose prose-neutral dark:prose-invert prose-lg max-w-4xl mx-auto text-foreground">
          <p className="text-sm text-muted-foreground">Dernière mise à jour : {currentDate}</p>

          <p>Veuillez lire attentivement ces Conditions Générales d'Utilisation ("CGU") avant d'utiliser le site web coccinelle.ai et les services associés (collectivement, les "Services") exploités par coccinelle.ai ("nous", "notre", "nos").</p>
          <p>Votre accès et votre utilisation des Services sont conditionnés par votre acceptation et votre respect de ces CGU. Ces CGU s'appliquent à tous les visiteurs, utilisateurs et autres personnes qui accèdent ou utilisent les Services.</p>
          <p>En accédant ou en utilisant les Services, vous acceptez d'être lié par ces CGU. Si vous n'êtes pas d'accord avec une partie des conditions, vous ne pouvez pas accéder aux Services.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">1. Description des Services</h2>
          <p>coccinelle.ai fournit un assistant vocal intelligent SaaS (Software as a Service) destiné aux professionnels de l'immobilier pour automatiser les appels téléphoniques, la qualification des prospects et la prise de rendez-vous via l'intelligence artificielle.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">2. Comptes Utilisateurs</h2>
          <p>Lorsque vous créez un compte chez nous, vous devez nous fournir des informations exactes, complètes et à jour en tout temps. Le non-respect de cette obligation constitue une violation des CGU, ce qui peut entraîner la résiliation immédiate de votre compte sur nos Services.</p>
          <p>Vous êtes responsable de la protection du mot de passe que vous utilisez pour accéder aux Services et de toutes les activités ou actions entreprises sous votre mot de passe, que votre mot de passe soit avec nos Services ou un service tiers.</p>
          <p>Vous acceptez de ne pas divulguer votre mot de passe à un tiers. Vous devez nous informer immédiatement dès que vous avez connaissance d'une violation de sécurité ou d'une utilisation non autorisée de votre compte.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">3. Utilisation des Services</h2>
          <p>Vous acceptez d'utiliser les Services uniquement à des fins légales et conformément aux présentes CGU et à toutes les lois et réglementations applicables.</p>
          <p>Vous êtes responsable de toutes les données, y compris les enregistrements d'appels, les transcriptions et les informations sur les prospects, que vous traitez via les Services. Vous devez vous assurer que vous avez le droit de traiter ces données et que leur traitement est conforme aux lois sur la protection des données applicables.</p>
          <p>Il est interdit d'utiliser les Services pour :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Toute activité illégale ou frauduleuse.</li>
            <li>Harceler, abuser ou nuire à une autre personne.</li>
            <li>Violer les droits de propriété intellectuelle de tiers.</li>
            <li>Transmettre des virus ou tout autre code de nature destructive.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">4. Frais et Paiement</h2>
          <p>Certains aspects des Services peuvent être fournis moyennant des frais. Tous les frais sont non remboursables, sauf indication contraire explicite. Vous êtes responsable du paiement de tous les frais et taxes applicables associés à votre utilisation des Services en temps voulu avec une méthode de paiement valide.</p>
          <p>Les tarifs et les plans d'abonnement sont décrits sur notre page Tarifs et peuvent être modifiés avec un préavis.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">5. Propriété Intellectuelle</h2>
          <p>Les Services et leur contenu original (à l'exclusion du contenu fourni par les utilisateurs), leurs caractéristiques et fonctionnalités sont et resteront la propriété exclusive de coccinelle.ai et de ses concédants de licence. Les Services sont protégés par le droit d'auteur, les marques commerciales et d'autres lois de France et des pays étrangers.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">6. Intégrations Tierces</h2>
          <p>Nos Services peuvent s'intégrer à des services tiers (par exemple, Twilio, OpenAI, Cal.com). Votre utilisation de ces services tiers est régie par leurs propres conditions d'utilisation et politiques de confidentialité. Nous ne sommes pas responsables des pratiques des services tiers.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">7. Limitation de Responsabilité</h2>
          <p>En aucun cas coccinelle.ai, ni ses directeurs, employés, partenaires, agents, fournisseurs ou affiliés, ne seront responsables de dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, y compris, sans limitation, la perte de profits, de données, d'utilisation, de clientèle ou d'autres pertes intangibles, résultant de (i) votre accès ou utilisation ou incapacité d'accéder ou d'utiliser les Services ; (ii) toute conduite ou contenu d'un tiers sur les Services ; (iii) tout contenu obtenu à partir des Services ; et (iv) l'accès, l'utilisation ou l'altération non autorisés de vos transmissions ou de votre contenu, que ce soit sur la base d'une garantie, d'un contrat, d'un délit (y compris la négligence) ou de toute autre théorie juridique, que nous ayons été informés ou non de la possibilité de tels dommages.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">8. Résiliation</h2>
          <p>Nous pouvons résilier ou suspendre votre compte et interdire l'accès aux Services immédiatement, sans préavis ni responsabilité, à notre seule discrétion, pour quelque raison que ce soit et sans limitation, y compris, mais sans s'y limiter, une violation des CGU.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">9. Droit Applicable</h2>
          <p>Ces CGU seront régies et interprétées conformément aux lois françaises, sans égard à ses dispositions en matière de conflit de lois.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">10. Modifications</h2>
          <p>Nous nous réservons le droit, à notre seule discrétion, de modifier ou de remplacer ces CGU à tout moment. Si une révision est importante, nous nous efforcerons de fournir un préavis d'au moins 30 jours avant l'entrée en vigueur des nouvelles conditions. Ce qui constitue un changement important sera déterminé à notre seule discrétion.</p>
          <p>En continuant à accéder ou à utiliser nos Services après l'entrée en vigueur de ces révisions, vous acceptez d'être lié par les conditions révisées.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">11. Contactez-Nous</h2>
          <p>Si vous avez des questions concernant ces CGU, veuillez nous contacter :</p>
          <p>Email : <a href="mailto:youssef.amrouche@coccinelle.ai" className="text-primary hover:underline">youssef.amrouche@coccinelle.ai</a></p>
          <p>Téléphone : 07 60 76 21 53</p>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
