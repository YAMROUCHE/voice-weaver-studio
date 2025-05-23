'use client';

import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, CalendarCheck, Percent, PhoneCall, Users } from "lucide-react";
import Link from "next/link";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartData = [
  { month: "Janvier", appels: 186, rdv: 80 },
  { month: "Février", appels: 305, rdv: 120 },
  { month: "Mars", appels: 237, rdv: 90 },
  { month: "Avril", appels: 273, rdv: 150 },
  { month: "Mai", appels: 209, rdv: 100 },
  { month: "Juin", appels: 214, rdv: 110 },
];

const chartConfig = {
  appels: {
    label: "Appels",
    color: "hsl(var(--primary))",
  },
  rdv: {
    label: "RDV Pris",
    color: "hsl(var(--accent))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;


const recentActivitiesData = [
  { id: '1', type: 'Appel', from: '+33612345678', duration: '2m 30s', summary: 'Demande de renseignements sur un bien...', status: 'Terminé' },
  { id: '2', type: 'RDV', from: 'Mme. Dupont', duration: 'N/A', summary: 'RDV programmé pour une visite.', status: 'Programmé' },
  { id: '3', type: 'Appel', from: '+33798765432', duration: '5m 02s', summary: 'Question sur le processus d\'achat.', status: 'Terminé' },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description="Aperçu des performances de votre assistant vocal immobilier."
        actions={
          <Button asChild>
            <Link href="/app/my-agent">Configurer l'Agent</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Appels Traités" value="1 234" icon={PhoneCall} description="+20.1% ce mois-ci" />
        <StatCard title="RDV Pris" value="234" icon={CalendarCheck} description="+18.3% ce mois-ci" />
        <StatCard title="Prospects Générés" value="450" icon={Users} description="+15 depuis la semaine dernière" />
        <StatCard title="Taux de Conversion" value="19%" icon={Percent} description="+2% par rapport au mois dernier" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Tendances Appels & RDV</CardTitle>
            <CardDescription>Janvier - Juin 2024</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Line
                  dataKey="appels"
                  type="natural"
                  stroke="var(--color-appels)"
                  strokeWidth={2}
                  dot={false}
                  name="Appels"
                />
                <Line
                  dataKey="rdv"
                  type="natural"
                  stroke="var(--color-rdv)"
                  strokeWidth={2}
                  dot={false}
                  name="RDV Pris"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dernières Activités</CardTitle>
              <CardDescription>
                Résumé des interactions récentes.
              </CardDescription>
            </div>
            <Button asChild size="sm" variant="outline" className="ml-auto gap-1">
              <Link href="/app/calls">
                Voir Tout
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivitiesData.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.type}</TableCell>
                    <TableCell>
                      <div className="font-medium">{activity.from}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {activity.summary.substring(0,30)}...
                      </div>
                    </TableCell>
                    <TableCell>{activity.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
