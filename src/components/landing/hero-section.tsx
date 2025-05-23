
'use client'; // Required because of DialogTrigger and state

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ArrowRight, CheckCircle, CirclePlay, Sparkles } from 'lucide-react';
import { DemoRequestPopup } from './demo-request-popup';
import { AgentSelectionForm } from './agent-selection-form';

export function HeroSection() {
  const [openCreateAgentDialog, setOpenCreateAgentDialog] = useState(false);

  const handleCreateAgentSubmit = async (data: any) => {
    console.log("Créer mon assistant vocal - Demande soumise:", data);
    // TODO: Implement logic, e.g., redirect to a registration page with prefilled info or directly start creation process
    setOpenCreateAgentDialog(false); // Close dialog on submit
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-x-12 gap-y-10 items-center">
          {/* Left Column */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-foreground leading-tight">
              L'Intelligence Artificielle<br />
              au service de l'immobilier<br />
              <span className="text-primary text-[1.2em] font-bold mt-1 inline-block">coccinelle.ai</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Transformez votre agence immobilière grâce à notre agent vocal IA qui gère vos appels, qualifie vos leads et planifie vos rendez-vous 24h/24 et 7j/7.
            </p>
             <p className="mt-4 text-md text-foreground font-medium max-w-xl mx-auto lg:mx-0">
              L'Intelligence Artificielle au service de votre métier.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4">
              <DemoRequestPopup
                triggerButton={
                  <Button size="lg" className="shadow-lg w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                    Demander une démo <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                }
              />
              
              <Dialog open={openCreateAgentDialog} onOpenChange={setOpenCreateAgentDialog}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="shadow-sm w-full sm:w-auto">
                    Créer mon assistant vocal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl bg-card text-card-foreground rounded-lg shadow-xl border-border p-0">
                  <AgentSelectionForm
                    ctaText="Créer mon agent et être rappelé"
                    onSubmitForm={handleCreateAgentSubmit}
                    formTitle="Créez votre agent et recevez un appel"
                    formDescription="Choisissez un type d'agent et laissez vos coordonnées. Nous vous rappellerons pour finaliser la création."
                    showAgencyName={true}
                  />
                </DialogContent>
              </Dialog>
               <Button size="lg" variant="default" asChild className="shadow-lg w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/register?trial=true">
                   Démarrer l'essai gratuit (14 jours) <Sparkles className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <ul className="mt-8 space-y-3 text-muted-foreground mx-auto lg:mx-0 sm:max-w-md lg:max-w-none">
              <li className="flex items-center justify-center lg:justify-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                Installation immédiate
              </li>
              <li className="flex items-center justify-center lg:justify-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                Sans engagement
              </li>
              <li className="flex items-center justify-center lg:justify-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                Support 7j/7
              </li>
            </ul>
          </div>

          {/* Right Column */}
          <div className="relative mt-10 lg:mt-0 mx-auto lg:mx-0 max-w-xl lg:max-w-none flex flex-col items-center">
            <Image
              src="https://placehold.co/500x450.png"
              alt="Interface de gestion d'appels et de RDV de l'agent coccinelle.ai"
              width={500}
              height={450}
              className="rounded-xl shadow-2xl"
              data-ai-hint="AI assistant dashboard real estate"
              priority
            />
            <Button size="lg" variant="outline" asChild className="shadow-sm mt-6 w-full sm:w-auto max-w-xs">
              <Link href="/how-it-works">
                <CirclePlay className="mr-2 h-5 w-5" /> Comment ça marche ?
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
