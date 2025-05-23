
// src/app/app/my-agent/page.tsx
'use client';

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Bot, Phone, CalendarDays, Mail } from "lucide-react"; // Added icons
import { useForm } from "react-hook-form";
import { z } from "zod";

const agentFormSchema = z.object({
  agentName: z.string().min(3, "Le nom de l'agent doit comporter au moins 3 caractères."),
  systemPrompt: z.string().min(10, "Le prompt système est trop court.").max(2000, "Le prompt système est trop long."),
  
  transcriptionProvider: z.enum(["whisper"]), // Fixed for now
  languageModel: z.enum(["gpt-4", "gpt-3.5-turbo"]), // Matches user spec for GPT model choice

  voiceProvider: z.enum(["xtts", "elevenlabs"]),
  elevenLabsApiKey: z.string().optional().describe("Nécessaire si ElevenLabs est sélectionné."),
  elevenLabsVoiceId: z.string().optional().describe("Nécessaire si ElevenLabs est sélectionné."),
  // XTTS options could be added here if more granular control is needed

  twilioPhoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, "Format de numéro de téléphone Twilio invalide (ex: +33123456789)."),
  
  calComApiKey: z.string().optional().describe("Optionnel, pour l'intégration Cal.com."),
  calComEventTypeId: z.string().optional().describe("ID du type d'événement Cal.com à utiliser pour les RDV."),

  enableSmsConfirmation: z.boolean().default(false),
  twilioSmsFromNumber: z.string().optional().describe("Numéro Twilio pour envoyer les SMS (si différent)."),
  
  enableEmailConfirmation: z.boolean().default(false),
  sendgridApiKey: z.string().optional().describe("Nécessaire pour les confirmations email via SendGrid."),
  sendgridFromEmail: z.string().email("Format d'email invalide.").optional().describe("Adresse email d'expédition pour SendGrid."),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

export default function MyAgentPage() {
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      agentName: "Mon assistant coccinelle",
      systemPrompt: "Vous êtes un assistant IA de coccinelle.ai, spécialisé dans l'immobilier. Votre mission est d'appeler les prospects, de qualifier leurs besoins et de fixer des rendez-vous. Soyez courtois, efficace et professionnel.",
      transcriptionProvider: "whisper",
      languageModel: "gpt-4",
      voiceProvider: "xtts",
      twilioPhoneNumber: "+33000000000", // Placeholder
      enableSmsConfirmation: true,
      enableEmailConfirmation: false,
    },
  });

  const watchedVoiceProvider = form.watch("voiceProvider");
  const watchedSmsConfirmation = form.watch("enableSmsConfirmation");
  const watchedEmailConfirmation = form.watch("enableEmailConfirmation");

  function onSubmit(data: AgentFormValues) {
    console.log("Configuration de l'agent coccinelle.ai:", data);
    // TODO: Implement API call to save agent configuration to Firestore
    // This would likely involve a Cloud Function or a secure API endpoint.
    // For now, just logging to console and showing an alert.
    alert("Configuration de l'agent enregistrée (simulation, voir console). Implémentez la logique de sauvegarde réelle.");
  }

  return (
    <>
      <PageHeader
        title="Mon Agent IA coccinelle"
        description="Configurez et personnalisez le comportement de votre assistant vocal."
        actions={
            <Button type="submit" form="agent-form">
              <Save className="mr-2 h-4 w-4" /> Enregistrer la Configuration
            </Button>
        }
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="agent-form" className="space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Bot className="mr-2 h-5 w-5 text-primary" /> Identité & Comportement de l'Agent</CardTitle>
              <CardDescription>Définissez comment votre agent se présente et interagit.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="agentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'agent</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Assistant Immo Pro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="systemPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions Système (Prompt)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Décrivez la personnalité, le ton, les objectifs et les instructions spécifiques de votre agent IA..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ce prompt guide l'IA. Soyez précis pour de meilleurs résultats. Max 2000 car.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
                <CardTitle className="flex items-center"><Phone className="mr-2 h-5 w-5 text-primary" /> Technologies Vocales & IA</CardTitle>
                <CardDescription>Choisissez les services pour la transcription, la compréhension et la synthèse vocale.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                 <FormField
                  control={form.control}
                  name="transcriptionProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transcription (Parole vers Texte)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="whisper">Whisper (OpenAI)</SelectItem>
                          {/* Add other providers if available */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="languageModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modèle de Langage (IA)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un modèle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4 (OpenAI)</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5-Turbo (OpenAI)</SelectItem>
                           {/* Could add Gemini models here too */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="voiceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Synthèse Vocale (Texte vers Parole)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="xtts">XTTS (Open Source / Local)</SelectItem>
                          <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {watchedVoiceProvider === "elevenlabs" && (
                  <>
                    <FormField
                      control={form.control}
                      name="elevenLabsApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clé API ElevenLabs</FormLabel>
                          <FormControl><Input type="password" placeholder="Votre clé API ElevenLabs" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="elevenLabsVoiceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Voix ElevenLabs</FormLabel>
                          <FormControl><Input placeholder="ID de la voix ElevenLabs (ex: Adam)" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary" /> Intégrations & Notifications</CardTitle>
              <CardDescription>Connectez vos outils et configurez les alertes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                  control={form.control}
                  name="twilioPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de téléphone Twilio principal</FormLabel>
                      <FormControl>
                        <Input placeholder="+33123456789" {...field} />
                      </FormControl>
                      <FormDescription>Le numéro que votre agent coccinelle.ai utilisera pour appeler et être appelé.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="calComApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clé API Cal.com (Optionnel)</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Votre clé API Cal.com" {...field} />
                    </FormControl>
                    <FormDescription>Permet la planification de rendez-vous directement dans votre agenda Cal.com.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="calComEventTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Type d'Événement Cal.com (Optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: /coccinelle-agent/visite-30min" {...field} />
                    </FormControl>
                    <FormDescription>L'ID du type d'événement Cal.com à utiliser pour créer les RDV.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enableSmsConfirmation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Activer les confirmations RDV par SMS</FormLabel>
                      <FormDescription>
                        Envoyer un SMS de confirmation via Twilio lorsqu'un RDV est pris.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {watchedSmsConfirmation && (
                 <FormField
                  control={form.control}
                  name="twilioSmsFromNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro Twilio pour envoi SMS (Optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="+33123456780 (si différent du principal)" {...field} />
                      </FormControl>
                      <FormDescription>Si non spécifié, le numéro Twilio principal sera utilisé.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="enableEmailConfirmation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Activer les confirmations RDV par Email</FormLabel>
                      <FormDescription>
                        Envoyer un email de confirmation via SendGrid lorsqu'un RDV est pris.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {watchedEmailConfirmation && (
                <>
                  <FormField
                    control={form.control}
                    name="sendgridApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clé API SendGrid</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Votre clé API SendGrid" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sendgridFromEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email d'expédition SendGrid</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="notifications@votreagence.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4"> {/* Moved save button here to be outside page header */}
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Enregistrer la Configuration
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
