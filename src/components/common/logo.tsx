
import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  isTextVisible?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

// New geometric ladybug icon
const LadybugIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64" // Adjusted viewBox
    className={cn("h-7 w-7", className)} // Default size, can be overridden
  >
    {/* Head: Black circle */}
    <circle cx="32" cy="22" r="12" fill="black" />

    {/* Body: Red circle, partially overlapped by head */}
    <circle cx="32" cy="40" r="20" fill="#EF4444" /> {/* Using a common Tailwind red-500 hex */}

    {/* Spots on the red body */}
    <circle cx="25" cy="38" r="4.5" fill="black" />
    <circle cx="39" cy="38" r="4.5" fill="black" />
    <circle cx="32" cy="50" r="4.5" fill="black" />
  </svg>
);


export function Logo({ className, isTextVisible = true, size = 'md' }: LogoProps) {
  const iconSizeClass = size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-8 w-8' : 'h-7 w-7';
  const textSizeClass = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <Link href="/" className={cn('flex items-center gap-2 group', className)}>
      <LadybugIcon className={cn(iconSizeClass)} />
      {isTextVisible && (
        <span className={cn(textSizeClass, "font-bold text-foreground")}>
          coccinelle.ai
        </span>
      )}
    </Link>
  );
}
