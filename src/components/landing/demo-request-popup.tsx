
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, Phone, Mail, CalendarDays } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const demoRequestFormSchema = z.object({
  fullName: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères." }),
  phoneNumber: z.string().regex(/^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/, { message: "Numéro de téléphone français invalide." }),
  email: z.string().email({ message: "Adresse e-mail invalide." }),
});

type DemoRequestFormValues = z.infer<typeof demoRequestFormSchema>;

interface DemoRequestPopupProps {
  triggerButton?: React.ReactNode;
}

export function DemoRequestPopup({ triggerButton }: DemoRequestPopupProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<DemoRequestFormValues>({
    resolver: zodResolver(demoRequestFormSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
    },
  });

  async function onSubmit(data: DemoRequestFormValues) {
    console.log("Demande de démo soumise:", data);
    // TODO: Implement actual server action / API call to schedule demo or notify team
    toast({
      title: "🗓️ Demande de démo reçue !",
      description: `Nous vous contacterons bientôt aux coordonnées : ${data.email} / ${data.phoneNumber}.`,
    });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton ? triggerButton : (
          <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Démo Live
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground rounded-lg shadow-xl border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">Demander une Démo Live</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Remplissez ce formulaire pour être contacté pour une démo personnalisée, ou planifiez directement un créneau.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Jean Dupont" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de téléphone</FormLabel>
                  <FormControl>
                     <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="tel" placeholder="06 12 34 56 78" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse e-mail</FormLabel>
                  <FormControl>
                     <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="email" placeholder="jean.dupont@example.com" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between items-center pt-3">
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {form.formState.isSubmitting ? "Envoi en cours..." : "Être contacté"}
              </Button>
               <Link href="https://cal.com/placeholder-coccinelle-demo" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                 <Button type="button" variant="outline" className="w-full">
                    <CalendarDays className="mr-2 h-4 w-4" /> Planifier soi-même
                 </Button>
               </Link>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
