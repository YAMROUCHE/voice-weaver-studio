
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PhoneCallIcon, HomeIcon, CalendarCheckIcon, UserIcon, MailIcon, BuildingIcon, PhoneIcon, ArrowRightIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const agentChoiceSchema = z.object({
  agentType: z.enum(['achat', 'location', 'rdv']).optional(),
  firstName: z.string().min(2, { message: "Le prénom doit comporter au moins 2 caractères." }),
  lastName: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères." }),
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  agencyName: z.string().min(2, { message: "Le nom de l'agence doit comporter au moins 2 caractères." }).optional(),
  phoneNumber: z.string().regex(/^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/, { message: "Numéro de téléphone français invalide." }),
});

type AgentChoiceFormValues = z.infer<typeof agentChoiceSchema>;

interface AgentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  agentName: string;
  agentRole: string;
  isSelected: boolean;
  onSelect: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ icon, title, description, agentName, agentRole, isSelected, onSelect }) => (
  <Card
    className={`cursor-pointer transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'border-border'}`}
    onClick={onSelect}
  >
    <CardHeader className="p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
          {icon}
        </div>
        <CardTitle className="text-md font-semibold">{title}</CardTitle>
      </div>
      <CardDescription className="text-xs text-muted-foreground mb-2">{description}</CardDescription>
      <div className="flex items-center text-xs">
        <UserIcon className="h-3 w-3 mr-1.5 text-muted-foreground" />
        <span className="text-foreground font-medium">{agentName},</span>&nbsp;<span className="text-muted-foreground">{agentRole}</span>
      </div>
    </CardHeader>
  </Card>
);

interface AgentSelectionFormProps {
  ctaText: string;
  formTitle?: string;
  formDescription?: string;
  onSubmitForm: (data: AgentChoiceFormValues) => Promise<void> | void;
  showAgencyName?: boolean;
}

export const AgentSelectionForm: React.FC<AgentSelectionFormProps> = ({
  ctaText,
  formTitle = "Recevez un appel de démonstration",
  formDescription = "Complétez ce formulaire pour recevoir un appel de notre Agent d'achat immobilier et découvrir comment il peut vous aider à qualifier vos prospects.",
  onSubmitForm,
  showAgencyName = true,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<'achat' | 'location' | 'rdv' | undefined>('achat');
  const { toast } = useToast();

  const form = useForm<AgentChoiceFormValues>({
    resolver: zodResolver(agentChoiceSchema),
    defaultValues: {
      agentType: 'achat',
      firstName: '',
      lastName: '',
      email: '',
      agencyName: '',
      phoneNumber: '',
    },
  });

  const handleSelectAgent = (agentType: 'achat' | 'location' | 'rdv') => {
    setSelectedAgent(agentType);
    form.setValue('agentType', agentType);
  };

  const onSubmit = async (data: AgentChoiceFormValues) => {
    await onSubmitForm(data);
    toast({
      title: "🎉 Demande envoyée !",
      description: `Nous avons bien reçu vos informations. L'agent ${selectedAgent || 'sélectionné'} vous contactera bientôt.`,
    });
    form.reset({ agentType: selectedAgent, firstName: '', lastName: '', email: '', agencyName: '', phoneNumber: ''});
  };

  const agentOptions = [
    { type: 'achat' as const, icon: <PhoneCallIcon className="h-5 w-5" />, title: "Achat immobilier", description: "Rappel automatique des prospects intéressés par un achat", agentName: "Pierre", agentRole: "Agent d'achat" },
    { type: 'location' as const, icon: <HomeIcon className="h-5 w-5" />, title: "Location immobilière", description: "Rappel automatique des prospects intéressés par une location", agentName: "Marie", agentRole: "Agent de location" },
    { type: 'rdv' as const, icon: <CalendarCheckIcon className="h-5 w-5" />, title: "Prise de RDV", description: "Qualification des leads et organisation des visites", agentName: "Thomas", agentRole: "Agent de visite" },
  ];

  return (
    <div className="space-y-6 p-2 sm:p-0">
      <div>
        <h3 className="text-xl font-semibold text-center text-foreground mb-1">Choisissez votre agent vocal</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">Sélectionnez l'agent le plus adapté à votre besoin</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agentOptions.map(agent => (
            <AgentCard
              key={agent.type}
              icon={agent.icon}
              title={agent.title}
              description={agent.description}
              agentName={agent.agentName}
              agentRole={agent.agentRole}
              isSelected={selectedAgent === agent.type}
              onSelect={() => handleSelectAgent(agent.type)}
            />
          ))}
        </div>
      </div>

      <div className="bg-muted/40 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-center text-foreground mb-1">{formTitle}</h3>
        <p className="text-sm text-muted-foreground text-center mb-6">{formDescription}</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Votre prénom</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Votre prénom" {...field} className="pl-10 bg-background" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Votre nom</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Votre nom" {...field} className="pl-10 bg-background" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Votre e-mail</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="email" placeholder="votre.email@exemple.fr" {...field} className="pl-10 bg-background" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showAgencyName && (
              <FormField
                control={form.control}
                name="agencyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Nom de votre agence</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Nom de votre agence" {...field} className="pl-10 bg-background" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Votre numéro de téléphone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="tel" placeholder="06 12 34 56 78" {...field} className="pl-10 bg-background" />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-center mt-1">Numéro français uniquement. L'appel est gratuit.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-3">
              {form.formState.isSubmitting ? "Envoi en cours..." : ctaText}
              {!form.formState.isSubmitting && <ArrowRightIcon className="ml-2 h-5 w-5" />}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              En validant ce formulaire, vous acceptez de recevoir un appel de notre agent vocal à des fins de démonstration.
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};
