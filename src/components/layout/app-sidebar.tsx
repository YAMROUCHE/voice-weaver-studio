'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/common/logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Phone,
  Users,
  Bot,
  DatabaseZap, 
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCircle, // For Profile
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

const navItems = [
  { href: '/app/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/app/calls', label: 'Appels', icon: Phone },
  { href: '/app/leads', label: 'Prospects', icon: Users },
  { href: '/app/my-agent', label: 'Mon agent IA', icon: Bot }, // Changed label slightly
  { href: '/app/data-sync', label: 'Synchronisation Données', icon: DatabaseZap }, // Changed label slightly
];

const bottomNavItems = [
  { href: '/app/profile', label: 'Profil', icon: UserCircle },
  { href: '/app/settings', label: 'Paramètres', icon: Settings },
];

interface AppSidebarProps {
  className?: string;
  onToggle?: (isCollapsed: boolean) => void; // Added onToggle prop
}

export function AppSidebar({ className, onToggle }: AppSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState); // Notify parent about collapse state change
    }
  };
  
  React.useEffect(() => {
    // Initialize parent with the default state
    if (onToggle) {
      onToggle(isCollapsed);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount


  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out', // z-index increased
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div
        className={cn(
          'flex h-16 items-center border-b px-4 shrink-0 border-sidebar-border',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}
      >
        <Logo isTextVisible={!isCollapsed} className={isCollapsed ? 'justify-center w-full' : ''} />
        <Button variant="ghost" size="icon" className="hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={toggleCollapse}>
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} legacyBehavior passHref>
              <a
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  pathname === item.href
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/80',
                  isCollapsed && 'justify-center'
                )}
                title={item.label}
              >
                <item.icon className={cn('h-5 w-5 shrink-0', isCollapsed ? 'mx-auto' : '')} />
                {!isCollapsed && <span>{item.label}</span>}
              </a>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-2 border-sidebar-border">
        <nav className="flex flex-col gap-1">
          {bottomNavItems.map((item) => (
            <Link key={item.href} href={item.href} legacyBehavior passHref>
              <a
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  pathname === item.href
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/80',
                  isCollapsed && 'justify-center'
                )}
                title={item.label}
              >
                <item.icon className={cn('h-5 w-5 shrink-0', isCollapsed ? 'mx-auto' : '')} />
                {!isCollapsed && <span>{item.label}</span>}
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
