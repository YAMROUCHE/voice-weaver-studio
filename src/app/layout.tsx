
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { TestAgentPopup } from '@/components/landing/test-agent-popup';

export const metadata: Metadata = {
  title: 'coccinelle.ai | Assistant vocal IA pour l\'immobilier',
  description: 'Automatisez vos appels et prises de RDV avec l\'IA. Assistant vocal intelligent pour les professionnels de l\'immobilier.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <Toaster />
        <TestAgentPopup /> {/* Added global popup */}
      </body>
    </html>
  );
}
