
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AreaChart, BarChartBig, Filter, Home, Info, Layers, Map, Settings } from "lucide-react";

export function AppSidebar({ onSelectFilter }: { onSelectFilter?: (filter: string) => void }) {
  const handleFilterSelect = (filter: string) => {
    if (onSelectFilter) {
      onSelectFilter(filter);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <span className="text-lg font-semibold">LumenMap</span>
      </SidebarHeader>
      <SidebarContent className="pb-0">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <Map className="mr-2 h-4 w-4" />
                    <span>Map</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <AreaChart className="mr-2 h-4 w-4" />
                    <span>Analytics</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Filters</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleFilterSelect("province")}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Province</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleFilterSelect("urbanRural")}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Urban/Rural</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleFilterSelect("indicators")}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Indicators</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Layers</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <Layers className="mr-2 h-4 w-4" />
                    <span>Light Intensity</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <Layers className="mr-2 h-4 w-4" />
                    <span>Schools</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <Layers className="mr-2 h-4 w-4" />
                    <span>Healthcare</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <Layers className="mr-2 h-4 w-4" />
                    <span>Property Rates</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="flex justify-center py-4">
        <Button variant="outline" size="sm" className="w-full max-w-[180px] gap-1">
          <BarChartBig className="h-3.5 w-3.5" />
          <span>Generate Report</span>
        </Button>
      </div>
    </Sidebar>
  );
}

export function SidebarToggle() {
  return (
    <div className="fixed bottom-4 left-4 z-40 md:hidden">
      <SidebarTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full h-10 w-10 shadow-md">
          <Settings className="h-5 w-5" />
        </Button>
      </SidebarTrigger>
    </div>
  );
}
