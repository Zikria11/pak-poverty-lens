
import { cn } from "@/lib/utils";

export function LumenMapLogo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-6 w-6", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" className="fill-primary/20 stroke-primary" />
      <path
        d="M12 2a10 10 0 1 0 10 10 4 4 0 0 0-4-4 4 4 0 0 0-8 0 4 4 0 0 0-4 4"
        className="stroke-primary"
      />
      <circle cx="12" cy="12" r="4" className="stroke-primary fill-primary/30" />
    </svg>
  );
}
