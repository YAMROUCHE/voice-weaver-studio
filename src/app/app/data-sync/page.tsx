// src/app/app/data-sync/page.tsx
'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadCloud, FileText, FileSpreadsheet, SheetIcon, MoreHorizontal, Trash2, Eye, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { handleDocumentUpload, type DocumentUploadInput } from '@/ai/flows/coccinelle/on-upload-document-flow';

// Données statiques pour l'affichage initial
const initialDatasets = [
  { id: 'ds_001', name: 'Catalogue Produits T3.pdf', type: 'PDF', size: '2.5 Mo', lastUpdated: '2024-07-20', status: 'Actif' },
  { id: 'ds_002', name: 'Liste Clients.csv', type: 'CSV', size: '512 Ko', lastUpdated: '2024-07-25', status: 'Actif' },
  { id: 'ds_003', name: 'FAQ Services.xlsx', type: 'Excel', size: '1.2 Mo', lastUpdated: '2024-07-15', status: 'En traitement' },
  { id: 'ds_004', name: 'Ancienne Grille Tarifaire.pdf', type: 'PDF', size: '800 Ko', lastUpdated: '2023-12-10', status: 'Archivé' },
];

const getFileIcon = (type: string) => {
  if (type === 'PDF') return <FileText className="h-5 w-5 text-red-500" />;
  if (type === 'CSV') return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
  if (type === 'Excel') return <SheetIcon className="h-5 w-5 text-green-700" />;
  return <FileText className="h-5 w-5 text-gray-500" />;
};

export default function DataSyncPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUri, setFileDataUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Ajout d'un état pour gérer la liste des jeux de données affichés
  // Initialisé avec les données statiques, mais pourrait être mis à jour après un upload réussi
  const [datasets, setDatasets] = useState(initialDatasets);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setFileName(null);
      setFileDataUri(null);
    }
  };

  const getSourceType = (file: File | null): DocumentUploadInput['sourceType'] | null => {
    if (!file) return null;
    const mimeType = file.type;
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (mimeType === 'application/pdf' || extension === 'pdf') return 'pdf';
    if (mimeType === 'text/csv' || extension === 'csv') return 'csv';
    if (mimeType === 'application/vnd.ms-excel' && (extension === 'xls' || extension === 'csv')) {
        // application/vnd.ms-excel can be ambiguous for .csv on some systems
        return extension === 'csv' ? 'csv' : 'excel'; 
    }
    if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || extension === 'xlsx') return 'excel';
    // Pour Notion et Airtable, le flux est différent et ne se base pas sur un upload de fichier direct de la même manière.
    // On pourrait ajouter des boutons/modales spécifiques pour ces sources plus tard.
    
    // Fallback, ou retourner null pour indiquer un type non supporté via cet upload direct
    toast({ title: "Type de fichier non supporté", description: `Le type ${mimeType} ou l'extension ${extension} n'est pas géré pour le moment.`, variant: "destructive" });
    return null; 
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileDataUri || !fileName) {
      toast({ title: "Aucun fichier sélectionné", description: "Veuillez choisir un fichier à téléverser.", variant: "destructive" });
      return;
    }

    const sourceType = getSourceType(selectedFile);
    if (!sourceType) {
      // getSourceType affichera déjà un toast en cas de type non supporté
      return;
    }

    setIsUploading(true);
    try {
      const input: DocumentUploadInput = {
        userId: "user_coccinelle_test_01", // Remplacer par l'ID utilisateur réel
        fileName: fileName,
        fileDataUri: fileDataUri,
        sourceType: sourceType,
      };
      
      const result = await handleDocumentUpload(input);
      toast({
        title: "Téléversement Réussi",
        description: `Le fichier ${result.datasetId} (statut: ${result.status}) a été traité. Aperçu: ${result.contentPreview?.substring(0, 50)}...`,
      });
      // Optionnel: Mettre à jour la liste des datasets affichés ici
      // Par exemple, en rechargeant les données depuis Firestore ou en ajoutant le résultat localement
      // Pour l'instant, on reset le formulaire
      setSelectedFile(null);
      setFileName(null);
      setFileDataUri(null);

    } catch (error: any) {
      console.error("Erreur lors du téléversement:", error);
      toast({
        title: "Erreur de Téléversement",
        description: error.message || "Une erreur est survenue lors du traitement du fichier.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Synchronisation des Données"
        description="Téléversez et gérez les documents pour fournir du contexte à votre agent IA."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Téléverser un Nouveau Jeu de Données</CardTitle>
          <CardDescription>
            Téléversez des fichiers PDF, CSV ou Excel. Votre agent utilisera ces données pour répondre aux questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 p-6 border-2 border-dashed border-muted rounded-lg hover:border-primary transition-colors">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2">
                <Input 
                  id="fileUpload" 
                  type="file" 
                  onChange={handleFileChange}
                  accept=".pdf,.csv,.xls,.xlsx"
                  className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                />
                {fileName && <span className="text-sm text-muted-foreground truncate max-w-[200px]">{fileName}</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Formats supportés : PDF, CSV, Excel. Taille max. : 10Mo.</p>
            </div>
            <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full sm:w-auto">
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              {isUploading ? "Téléversement..." : "Téléverser le Fichier"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jeux de Données Téléversés</CardTitle>
          <CardDescription>
            Gérez vos sources de données existantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Dernière MàJ</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasets.map((dataset) => (
                <TableRow key={dataset.id}>
                  <TableCell>{getFileIcon(dataset.type)}</TableCell>
                  <TableCell className="font-medium">{dataset.name}</TableCell>
                  <TableCell>{dataset.size}</TableCell>
                  <TableCell>{dataset.lastUpdated}</TableCell>
                  <TableCell>{dataset.status}</TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <UploadCloud className="mr-2 h-4 w-4" /> Re-synchroniser
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> Voir le contenu
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {datasets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucun jeu de données téléversé pour le moment.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
