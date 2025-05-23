import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Paramètres"
        description="Gérez les paramètres de votre compte et de l'application."
      />
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="account">Compte</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
          <TabsTrigger value="api_keys">Clés API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du Compte</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et vos préférences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" defaultValue="Nom Utilisateur Actuel" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" defaultValue="utilisateur@example.com" />
              </div>
              <Button>Enregistrer les Modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Informations de Facturation</CardTitle>
              <CardDescription>
                Gérez votre abonnement et vos méthodes de paiement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Plan Actuel : Pro</p>
              <Button variant="outline">Gérer l'Abonnement</Button>
              <p className="text-sm text-muted-foreground">Moyen de paiement enregistré : Visa **** 1234</p>
              <Button variant="outline">Mettre à Jour le Moyen de Paiement</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api_keys">
          <Card>
            <CardHeader>
              <CardTitle>Clés API</CardTitle>
              <CardDescription>
                Gérez les clés API pour les services externes (Twilio, SendGrid, Cal.com, etc.).
                Celles-ci sont généralement configurées dans votre fichier .env pour des raisons de sécurité.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="twilioSID">Twilio Account SID</Label>
                <Input id="twilioSID" placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" disabled value="Chargé depuis .env"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="twilioAuthToken">Twilio Auth Token</Label>
                <Input id="twilioAuthToken" type="password" placeholder="••••••••••••••••••••••••••••••" disabled value="•••••••••••••••••••••"/>
              </div>
               <div className="space-y-1">
                <Label htmlFor="sendgridKey">Clé API SendGrid</Label>
                <Input id="sendgridKey" type="password" placeholder="SG.xxxxxxxxxxxxxx.xxxxxxxxxxxx" disabled value="•••••••••••••••••••••"/>
              </div>
               <div className="space-y-1">
                <Label htmlFor="calcomKey">Clé API Cal.com</Label>
                <Input id="calcomKey" type="password" placeholder="cal_xxxxxxxxxxxxxxxxxxxxxxxxx" disabled value="•••••••••••••••••••••"/>
              </div>
              <p className="text-sm text-muted-foreground">
                Les clés API sont gérées via des variables d'environnement pour la sécurité. Mettez à jour votre fichier <code>.env</code> pour modifier ces valeurs.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
