
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'lucide-react';
import { DemoRequestPopup } from './demo-request-popup';
import { Logo } from '@/components/common/logo';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-muted text-foreground border-b">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Logo isTextVisible={true} size="md" />
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/app/my-agent" className="hover:text-primary transition-colors">Agents IA</Link>
          <Link href="/features" className="hover:text-primary transition-colors">Fonctionnalités</Link>
          <Link href="/documentation" className="hover:text-primary transition-colors">Documentation</Link>
          {/* Démo Live est géré par DemoRequestPopup plus bas */}
        </nav>
        <div className="flex items-center space-x-3">
          <DemoRequestPopup />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-foreground hover:text-primary hover:border-primary">
                <User className="mr-2 h-4 w-4" />
                Compte
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted">
                <Link href="/login">Se connecter</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted">
                <Link href="/register">S'inscrire</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
