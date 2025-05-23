import { UserNav } from '@/components/layout/user-nav';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { AppSidebar } from './app-sidebar'; // For mobile drawer

interface AppHeaderProps {
  isSidebarCollapsed: boolean;
  className?: string;
}

export function AppHeader({ isSidebarCollapsed, className }: AppHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-68' // Adjust based on sidebar width
      } ${className}`}
    >
      <div className="flex items-center gap-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Ouvrir le menu de navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
            <AppSidebar className="fixed !w-full !border-none" />
          </SheetContent>
        </Sheet>
      </div>

      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher..."
          className="w-full rounded-lg bg-muted pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <UserNav />
    </header>
  );
}
