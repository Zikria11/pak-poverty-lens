
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { PovertyStatistic, stats } from "@/data/mockData";

export function StatsCards() {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} isMobile={isMobile} />
      ))}
    </div>
  );
}

interface StatCardProps {
  stat: PovertyStatistic;
  isMobile: boolean | undefined;
}

function StatCard({ stat, isMobile }: StatCardProps) {
  const isPositiveChange = stat.change <= 0; // For poverty metrics, negative change is good
  
  return (
    <Card>
      <CardHeader className={isMobile ? "p-4" : "pb-2"}>
        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "p-4 pt-0" : ""}>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className={cn(
            "flex items-center text-xs font-medium",
            isPositiveChange ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
          )}>
            {isPositiveChange ? (
              <ArrowDown className="mr-1 h-3 w-3" />
            ) : (
              <ArrowUp className="mr-1 h-3 w-3" />
            )}
            {Math.abs(stat.change)}%
          </div>
        </div>
      </CardContent>
      <CardFooter className={cn(
        "text-xs text-muted-foreground border-t",
        isMobile ? "p-4" : ""
      )}>
        <p>{stat.description}</p>
      </CardFooter>
    </Card>
  );
}

function cn(...inputs: (string | boolean | undefined)[]): string {
  return inputs.filter(Boolean).join(' ');
}
