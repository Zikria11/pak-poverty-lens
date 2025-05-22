
import { MainLayout } from "@/layouts/MainLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { PovertyMap } from "@/components/dashboard/PovertyMap";
import { IndicatorsRadarChart } from "@/components/dashboard/IndicatorsRadarChart";
import { PovertyComparisonChart } from "@/components/dashboard/PovertyComparisonChart";
import { DataSourcesTable } from "@/components/dashboard/DataSourcesTable";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">LumenMap Dashboard</h1>
            <p className="text-muted-foreground">
              Pakistan-Specific Poverty Mapping Solution
            </p>
          </div>
          <Button className="mt-4 md:mt-0" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <section id="summary">
          <StatsCards />
        </section>

        <section id="poverty-map" className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Poverty Heatmap (1km² Grid Resolution)</h2>
          <PovertyMap />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section id="indicators">
            <IndicatorsRadarChart />
          </section>
          <section id="comparison">
            <PovertyComparisonChart />
          </section>
        </div>

        <section id="data-sources" className="pt-4">
          <DataSourcesTable />
        </section>

        <section id="about" className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">About LumenMap</h2>
          <div className="space-y-4">
            <p>
              LumenMap is a Pakistan-specific poverty mapping platform that integrates local and global data to detect and visualize economic hardship. It generates high-resolution heatmaps and an interactive dashboard, empowering stakeholders to prioritize interventions in urban slums (e.g., Orangi, Karachi) and rural villages (e.g., Tharparkar, Sindh).
            </p>
            <p>
              LumenMap uses real-time data from Pakistani sources like Zameen.com, Golootlo, and PHIMC, combined with satellite imagery, to create a dynamic poverty index tailored to Pakistan's unique context.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">For NGOs</h3>
                <p className="text-sm">Target aid to high-poverty zones, reducing waste by 20% based on precise data-driven insights.</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">For Government</h3>
                <p className="text-sm">Inform Ehsaas or provincial budgets with granular poverty data for effective resource allocation.</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">For Communities</h3>
                <p className="text-sm">Benefit from better targeted aid and infrastructure development, improving quality of life.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
