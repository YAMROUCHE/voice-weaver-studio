
import Link from 'next/link';
import { Logo } from '@/components/common/logo';
import { Github, Twitter, Linkedin, Mail, Phone } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="py-12 bg-muted border-t"> {/* Updated background */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Logo className="mb-4" />
            <p className="text-sm text-muted-foreground">
              Assistants vocaux intelligents pour les agences immobilières modernes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Produit</h4>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-sm text-muted-foreground hover:text-primary">Fonctionnalités</Link></li>
              <li><Link href="#pricing" className="text-sm text-muted-foreground hover:text-primary">Tarifs</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-primary">Comment ça marche</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Entreprise</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">À propos</Link></li>
              <li>
                <a href="mailto:youssef.amrouche@coccinelle.ai" className="text-sm text-muted-foreground hover:text-primary flex items-center">
                  <Mail className="h-4 w-4 mr-2" /> youssef.amrouche@coccinelle.ai
                </a>
              </li>
              <li>
                <a href="tel:0760762153" className="text-sm text-muted-foreground hover:text-primary flex items-center">
                  <Phone className="h-4 w-4 mr-2" /> 07 60 76 21 53
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Légal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Politique de confidentialité</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">Conditions d'utilisation</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} coccinelle.ai. Tous droits réservés.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" aria-label="Github" className="text-muted-foreground hover:text-primary"><Github className="h-5 w-5" /></Link>
            <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
            <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
