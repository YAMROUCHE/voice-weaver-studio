'use client';
import React from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
// import { GenkitProvider } from '@genkit-ai/next/client'; // Removed as per previous instruction

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarActuallyCollapsed, setIsSidebarActuallyCollapsed] = React.useState(false);
  
  // Callback function to update sidebar state from AppSidebar
  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarActuallyCollapsed(collapsed);
  };

  return (
    // <GenkitProvider> // GenkitProvider removed
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AppSidebar onToggle={handleSidebarToggle} /> {/* Pass callback */}
        <div className={`flex flex-col sm:gap-4 sm:py-4 transition-all duration-300 ease-in-out ${isSidebarActuallyCollapsed ? 'sm:pl-16' : 'sm:pl-64'}`}>
          <AppHeader isSidebarCollapsed={isSidebarActuallyCollapsed} />
          <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </div>
      </div>
    // </GenkitProvider>
  );
}
