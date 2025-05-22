
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { provinces } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";

export function PovertyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Simulate map loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Card className="h-[500px] md:h-[700px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pakistan Poverty Index</CardTitle>
            <CardDescription>
              Interactive heatmap showing poverty indices across Pakistan
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-xs">
              <span className="h-3 w-3 rounded-full bg-poverty-high mr-1"></span>
              <span>High</span>
            </div>
            <div className="flex items-center text-xs">
              <span className="h-3 w-3 rounded-full bg-poverty-medium mr-1"></span>
              <span>Medium</span>
            </div>
            <div className="flex items-center text-xs">
              <span className="h-3 w-3 rounded-full bg-poverty-low mr-1"></span>
              <span>Low</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative overflow-hidden rounded-b-lg">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div className="h-full w-full bg-slate-100 dark:bg-slate-900 relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566837497312-9c2c5a2cfc82?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
            {/* Map overlay with province labels */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[90%] h-[90%]">
                {provinces.map((province) => (
                  <ProvinceMarker 
                    key={province.id} 
                    province={province} 
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </div>
            
            {/* Placeholder for actual map visualization */}
            <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md text-xs">
              This is a demonstration visualization. In the actual application, this would be an interactive map using libraries like MapboxGL or Leaflet.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ProvinceMarkerProps {
  province: typeof provinces[0];
  isMobile: boolean | undefined;
}

function ProvinceMarker({ province, isMobile }: ProvinceMarkerProps) {
  // Calculate position based on latitude and longitude
  // These are approximate for demonstration purposes
  // In a real application, you would use proper geospatial mapping
  
  const getPositionStyle = () => {
    let positionStyle = {};
    
    switch (province.id) {
      case "punjab":
        positionStyle = { top: "40%", left: "60%" };
        break;
      case "sindh":
        positionStyle = { bottom: "30%", left: "50%" };
        break;
      case "kpk":
        positionStyle = { top: "20%", left: "40%" };
        break;
      case "balochistan":
        positionStyle = { bottom: "40%", left: "20%" };
        break;
      default:
        break;
    }
    
    return positionStyle;
  };
  
  const getMarkerColor = () => {
    if (province.povertyRate >= 0.35) return "poverty-high";
    if (province.povertyRate >= 0.25) return "poverty-medium";
    return "poverty-low";
  };
  
  return (
    <div
      className="absolute flex flex-col items-center"
      style={getPositionStyle()}
    >
      <div className={cn(
        "rounded-full flex items-center justify-center font-medium shadow-lg",
        getMarkerColor(),
        isMobile ? "w-12 h-12 text-xs" : "w-16 h-16 text-sm"
      )}>
        <span>{Math.round(province.povertyRate * 100)}%</span>
      </div>
      <span className="mt-1 text-xs font-medium bg-background/80 px-2 py-0.5 rounded-md">
        {province.name}
      </span>
    </div>
  );
}
