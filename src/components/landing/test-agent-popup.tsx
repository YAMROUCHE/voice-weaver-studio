
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Smartphone } from 'lucide-react';
import { AgentSelectionForm } from './agent-selection-form'; // Import the new component

const FloatingButtonIcon = () => (
  <div className="bg-white/20 p-2 rounded-md ml-3 flex items-center justify-center">
    <Smartphone className="h-5 w-5 text-white" />
  </div>
);

export function TestAgentPopup() {
  const [open, setOpen] = useState(false);

  // This will be passed to AgentSelectionForm
  const handleFormSubmit = async (data: any) => {
    console.log("Test Agent IA - Demande de rappel soumise:", data);
    // TODO: Implement actual server action / API call to trigger agent callback
    // For example: await triggerAgentCallback(data);
    setOpen(false); // Close dialog on submit
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed top-20 right-8 h-auto px-6 py-3 text-base font-semibold
                     bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl
                     flex items-center justify-center transition-all duration-150 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 z-50"
          aria-label="Testez votre agent IA"
        >
          Testez votre agent IA
          <FloatingButtonIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl bg-card text-card-foreground rounded-lg shadow-xl border-border p-0">
        {/* DialogHeader can be part of AgentSelectionForm or kept here */}
        {/* For simplicity, let AgentSelectionForm handle its internal titles */}
        <AgentSelectionForm
          ctaText="Recevoir un appel de démonstration"
          onSubmitForm={handleFormSubmit}
          formTitle="Recevez un appel de démonstration"
          formDescription="Complétez ce formulaire pour recevoir un appel de l'agent de votre choix et découvrir comment il peut vous aider à qualifier vos prospects."
          showAgencyName={true}
        />
      </DialogContent>
    </Dialog>
  );
}
