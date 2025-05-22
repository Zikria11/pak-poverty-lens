
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { povertyComparisonData } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";

export function PovertyComparisonChart() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  // Wait until component is mounted to access theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Define colors based on theme
  const isDark = resolvedTheme === "dark";
  const textColor = isDark ? "#E5E7EB" : "#374151";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  // Transform data for the chart
  const transformedData = povertyComparisonData.categories.map((category, index) => {
    const dataPoint: any = { name: category };
    povertyComparisonData.series.forEach((series) => {
      dataPoint[series.name] = series.data[index];
    });
    return dataPoint;
  });

  // Color scheme for provinces
  const provinceColors = {
    Punjab: "#0369a1",
    Sindh: "#047857",
    KPK: "#7c3aed",
    Balochistan: "#b45309",
    National: "#ef4444",
  };

  return (
    <Card className="h-[400px] md:h-[500px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle>Urban vs Rural Poverty</CardTitle>
        <CardDescription>Comparison of poverty rates in urban and rural areas by province</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transformedData}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fill: textColor }} />
            <YAxis
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: textColor }}
              domain={[0, 50]}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)}%`, ""]}
              contentStyle={{
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                color: textColor,
                border: `1px solid ${gridColor}`,
                borderRadius: "0.375rem",
              }}
            />
            <Legend />
            {povertyComparisonData.series.map((series) => (
              <Bar
                key={series.name}
                dataKey={series.name}
                fill={provinceColors[series.name as keyof typeof provinceColors]}
                name={series.name}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
