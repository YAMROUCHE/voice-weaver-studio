import { PageHeader } from "@/components/common/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  // Données utilisateur fictives
  const user = {
    name: 'Nom Utilisateur',
    email: 'utilisateur@example.com',
    role: 'Admin Client',
    company: 'Agence Immo XYZ',
    avatarUrl: 'https://placehold.co/100x100.png',
    initials: 'NU',
    joinedDate: '15 Janvier 2024',
  };

  return (
    <>
      <PageHeader
        title="Mon Profil"
        description="Consultez et gérez vos informations personnelles."
      />
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person avatar" />
              <AvatarFallback className="text-3xl">{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <CardDescription>Rôle : {user.role}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="profileName">Nom Complet</Label>
              <Input id="profileName" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileEmail">Adresse E-mail</Label>
              <Input id="profileEmail" type="email" defaultValue={user.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileCompany">Entreprise</Label>
              <Input id="profileCompany" defaultValue={user.company} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="profileJoined">Date d'inscription</Label>
              <Input id="profileJoined" defaultValue={user.joinedDate} disabled />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Changer de Mot de Passe (Optionnel)</Label>
            <Input id="currentPassword" type="password" placeholder="Mot de Passe Actuel" />
            <Input id="newPassword" type="password" placeholder="Nouveau Mot de Passe" />
            <Input id="confirmPassword" type="password" placeholder="Confirmer le Nouveau Mot de Passe" />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline">Annuler</Button>
            <Button>Enregistrer les Modifications</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
