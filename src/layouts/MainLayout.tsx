
import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { AppSidebar, SidebarToggle } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            {children}
          </main>
        </div>
        <SidebarToggle />
      </div>
    </SidebarProvider>
  );
}
