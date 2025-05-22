
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { indicators, indicatorsData } from "@/data/mockData";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";

export function IndicatorsRadarChart() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("punjab");

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

  // Transform data for the radar chart
  const prepareRadarData = () => {
    const provinceData = indicatorsData[selectedProvince as keyof typeof indicatorsData];
    return indicators.map((indicator) => ({
      subject: indicator.name,
      value: provinceData[indicator.id as keyof typeof provinceData] * 100,
      fullMark: 100,
    }));
  };

  // Province display names
  const provinceNames: Record<string, string> = {
    punjab: "Punjab",
    sindh: "Sindh",
    kpk: "Khyber Pakhtunkhwa",
    balochistan: "Balochistan",
  };

  return (
    <Card className="h-[400px] md:h-[500px] flex flex-col">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <CardTitle>Poverty Indicators</CardTitle>
            <CardDescription>Breakdown of poverty factors by province</CardDescription>
          </div>
          <Select 
            value={selectedProvince}
            onValueChange={setSelectedProvince}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select province" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(provinceNames).map((key) => (
                <SelectItem key={key} value={key}>{provinceNames[key]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={prepareRadarData()}>
            <PolarGrid stroke={gridColor} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: textColor }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: textColor }} />
            <Radar
              name={provinceNames[selectedProvince]}
              dataKey="value"
              stroke="#0069c0"
              fill="#0069c0"
              fillOpacity={0.6}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
