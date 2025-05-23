import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, UserPlus, Filter, Download, TrendingUp, TrendingDown, CircleSlash, Edit3, CheckSquare, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const leadsData = [
  { id: 'lead_001', name: 'Jean Dupont', phone: '+33612345678', status: 'Chaud', score: 92, lastContact: '2024-07-28', source: 'Appel Site Web' },
  { id: 'lead_002', name: 'Sophie Martin', phone: '+33798765432', status: 'Tiède', score: 75, lastContact: '2024-07-28', source: 'Campagne XYZ' },
  { id: 'lead_003', name: 'Robert Dubois', phone: '+33123456789', status: 'Froid', score: 30, lastContact: '2024-07-27', source: 'Référence' },
  { id: 'lead_004', name: 'Émilie Blanc', phone: '+33698765432', status: 'À Nourrir', score: 55, lastContact: '2024-07-27', source: 'Appel Site Web' },
  { id: 'lead_005', name: 'Michel Vert', phone: '+33712349876', status: 'Gagné', score: 100, lastContact: '2024-07-26', source: 'Campagne ABC' },
];

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'chaud': return <TrendingUp className="h-4 w-4 text-red-500" />;
    case 'tiède': return <TrendingUp className="h-4 w-4 text-orange-500" />;
    case 'froid': return <TrendingDown className="h-4 w-4 text-blue-500" />;
    default: return <CircleSlash className="h-4 w-4 text-gray-500" />; // Pour 'À Nourrir', 'Gagné' etc.
  }
}

export default function LeadsPage() {
  return (
    <>
      <PageHeader
        title="Gestion des Prospects"
        description="Suivez et gérez les clients potentiels identifiés par vos agents IA."
        actions={
          <div className="flex items-center gap-2">
            <Input placeholder="Rechercher des prospects..." className="w-auto" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filtrer
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrer par Statut</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Chaud</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Tiède</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Froid</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>À Nourrir</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Ajouter un Prospect
            </Button>
          </div>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Tous les Prospects</CardTitle>
          <CardDescription>
            Aperçu des prospects, leur statut et les scores générés par l'IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[150px]">Score IA</TableHead>
                <TableHead>Dernier Contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadsData.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>
                    <Badge variant={
                      lead.status === 'Chaud' ? 'destructive' 
                      : lead.status === 'Tiède' ? 'secondary' 
                      : lead.status === 'Froid' ? 'outline'
                      : 'default'
                    }>
                      <span className="mr-1">{getStatusIcon(lead.status)}</span>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={lead.score} aria-label={`Score de ${lead.score}%`} className="h-2" />
                      <span>{lead.score}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{lead.lastContact}</TableCell>
                  <TableCell>{lead.source}</TableCell>
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
                          <UserPlus className="mr-2 h-4 w-4" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Modifier prospect
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckSquare className="mr-2 h-4 w-4" />
                           Assigner tâche
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer prospect
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
