import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileText, PlayCircle, Download, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const callsData = [
  { id: 'call_001', customer: '+33612345678', agent: 'Réception Principale', date: '2024-07-28', duration: '00:02:35', summary: 'Demande sur les caractéristiques et prix d\'un bien.', recordingUrl: '#', transcript: 'Bonjour, j\'aimerais en savoir plus sur...', status: 'Terminé' },
  { id: 'call_002', customer: '+33798765432', agent: 'Agent Commercial IA', date: '2024-07-28', duration: '00:05:12', summary: 'A programmé une visite pour la semaine prochaine.', recordingUrl: '#', transcript: 'Oui, je suis intéressé pour programmer une visite...', status: 'Programmé' },
  { id: 'call_003', customer: '+33123456789', agent: 'Support Client IA', date: '2024-07-27', duration: '00:01:45', summary: 'Problème résolu concernant la connexion au compte.', recordingUrl: '#', transcript: 'Mon compte est bloqué, pouvez-vous m\'aider ?...', status: 'Résolu' },
  { id: 'call_004', customer: '+33698765432', agent: 'Réception Principale', date: '2024-07-27', duration: '00:03:02', summary: 'Appel manqué, message vocal laissé.', recordingUrl: '#', transcript: 'Messagerie vocale: Veuillez rappeler...', status: 'Manqué' },
  { id: 'call_005', customer: '+33712349876', agent: 'Agent Commercial IA', date: '2024-07-26', duration: '00:08:50', summary: 'Appel de suivi, client intéressé par une offre premium.', recordingUrl: '#', transcript: 'Merci pour le suivi...', status: 'Suivi' },
];

export default function CallsPage() {
  return (
    <>
      <PageHeader
        title="Journal des Appels"
        description="Consultez et gérez tous les appels enregistrés."
        actions={
          <div className="flex items-center gap-2">
            <Input placeholder="Rechercher des appels..." className="w-auto" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="termine">Terminé</SelectItem>
                <SelectItem value="programme">Programmé</SelectItem>
                <SelectItem value="resolu">Résolu</SelectItem>
                <SelectItem value="manque">Manqué</SelectItem>
                <SelectItem value="suivi">Suivi</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Exporter
            </Button>
          </div>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Tous les Appels</CardTitle>
          <CardDescription>
            Un journal détaillé de toutes les interactions gérées par vos assistants vocaux.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Résumé</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callsData.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">{call.customer}</TableCell>
                  <TableCell>{call.agent}</TableCell>
                  <TableCell>{call.date}</TableCell>
                  <TableCell>{call.duration}</TableCell>
                  <TableCell><Badge variant={
                    call.status === 'Terminé' || call.status === 'Résolu' ? 'default' 
                    : call.status === 'Programmé' ? 'secondary' 
                    : call.status === 'Suivi' ? 'outline'
                    : 'destructive' // Pour 'Manqué'
                  }>{call.status}</Badge></TableCell>
                  <TableCell className="max-w-xs truncate">{call.summary}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Écouter l'enregistrement
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Voir la transcription
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer l'appel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
