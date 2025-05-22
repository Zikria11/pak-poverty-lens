
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../theme/ModeToggle";
import { LumenMapLogo } from "../icons/LumenMapLogo";

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <LumenMapLogo className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight">
            LumenMap<span className="text-primary">.</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a className="transition-colors hover:text-primary" href="#dashboard">Dashboard</a>
          <a className="transition-colors hover:text-primary" href="#data-sources">Data Sources</a>
          <a className="transition-colors hover:text-primary" href="#about">About</a>
        </nav>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button size="sm" variant="default">
            Download Report
          </Button>
        </div>
      </div>
    </header>
  );
}
