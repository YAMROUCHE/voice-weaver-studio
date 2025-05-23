
// This component is no longer used in the HeroSection directly for the main demo button.
// It was previously used for an in-image demo button.
// Keeping the file in case it's repurposed, but it's not active in HeroSection.

'use client';

import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

export function HeroDemoButton() {
  return (
    <Button
      variant="secondary"
      size="lg"
      className="opacity-80 hover:opacity-100"
      onClick={() => alert("Lien vers démo vidéo/interactive à implémenter")}
    >
      <PlayCircle className="mr-2 h-6 w-6" /> Voir la démo
    </Button>
  );
}
