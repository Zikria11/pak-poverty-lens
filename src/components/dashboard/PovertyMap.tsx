
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { provinces } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import { Grid, MapPin } from "lucide-react";

type GridCell = {
  id: string;
  lat: number;
  lng: number;
  povertyIndex: number;
  size: number; // 1km² represented in pixel size
};

// Generate a grid of 1km² cells for the map visualization
const generateGridCells = (provinceId: string, baseIndex: number): GridCell[] => {
  // This would normally come from an API with real geospatial data
  // Here we're generating mock data for visualization purposes
  const cells: GridCell[] = [];
  const cellSize = 16; // Visual size of each cell in pixels
  
  // Base positions for each province on our mock map
  const basePositions: Record<string, {x: number, y: number, width: number, height: number}> = {
    "punjab": {x: 60, y: 20, width: 8, height: 8},
    "sindh": {x: 50, y: 55, width: 7, height: 6},
    "balochistan": {x: 20, y: 45, width: 10, height: 10},
    "kpk": {x: 40, y: 15, width: 6, height: 7}
  };
  
  const base = basePositions[provinceId];
  if (!base) return cells;
  
  // Generate a grid of cells for this province
  for (let x = 0; x < base.width; x++) {
    for (let y = 0; y < base.height; y++) {
      // Create random but clustered poverty indices
      // Areas close to each other tend to have similar poverty levels
      const noiseX = Math.sin(x * 0.5) * 0.2;
      const noiseY = Math.cos(y * 0.5) * 0.2;
      let povertyIndex = baseIndex + noiseX + noiseY + Math.random() * 0.15;
      
      // Ensure povertyIndex is between 0 and 1
      povertyIndex = Math.max(0, Math.min(1, povertyIndex));
      
      cells.push({
        id: `${provinceId}-${x}-${y}`,
        lat: base.y + y,
        lng: base.x + x,
        povertyIndex,
        size: cellSize,
      });
    }
  }
  
  return cells;
};

export function PovertyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [activeProvince, setActiveProvince] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const isMobile = useIsMobile();
  
  // Generate grid cells for all provinces
  const allCells: GridCell[] = [
    ...generateGridCells("punjab", 0.7), // Punjab has higher average prosperity
    ...generateGridCells("sindh", 0.5),  // Mixed prosperity
    ...generateGridCells("kpk", 0.4),    // Lower prosperity
    ...generateGridCells("balochistan", 0.3)  // Lowest average prosperity
  ];
  
  const [gridCells, setGridCells] = useState<GridCell[]>(allCells);
  
  useEffect(() => {
    // Simulate map loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Filter grid cells by active province
    if (activeProvince) {
      setGridCells(allCells.filter(cell => cell.id.startsWith(activeProvince)));
    } else {
      setGridCells(allCells);
    }
  }, [activeProvince]);
  
  const getPovertyColor = (index: number): string => {
    // Color scale from red (high poverty) to green (low poverty)
    if (index <= 0.35) return 'rgba(229, 57, 53, 0.85)'; // High poverty - Red
    if (index <= 0.5) return 'rgba(255, 179, 0, 0.85)';  // Medium poverty - Amber
    return 'rgba(67, 160, 71, 0.85)';                     // Low poverty - Green
  };
  
  return (
    <Card className="h-[500px] md:h-[700px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pakistan Poverty Index</CardTitle>
            <CardDescription>
              Interactive heatmap showing poverty indices across Pakistan (1km² grid)
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
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
            <button
              onClick={() => setShowGrid(!showGrid)}
              className="flex items-center text-xs gap-1 bg-muted/50 px-2 py-1 rounded-md hover:bg-muted"
            >
              <Grid className="h-3 w-3" />
              {showGrid ? "Hide Grid" : "Show Grid"}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            onClick={() => setActiveProvince(null)}
            className={cn(
              "text-xs px-3 py-1 rounded-full border",
              activeProvince === null 
                ? "bg-primary text-white" 
                : "bg-muted/50 hover:bg-muted"
            )}
          >
            All Provinces
          </button>
          {provinces.map((province) => (
            <button
              key={province.id}
              onClick={() => setActiveProvince(province.id)}
              className={cn(
                "text-xs px-3 py-1 rounded-full border",
                activeProvince === province.id 
                  ? "bg-primary text-white" 
                  : "bg-muted/50 hover:bg-muted"
              )}
            >
              {province.name}
            </button>
          ))}
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
            
            {/* Grid cells for heatmap */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[90%] h-[90%]">
                {gridCells.map((cell) => (
                  <div
                    key={cell.id}
                    className={cn(
                      "absolute rounded-sm transition-all duration-300",
                      showGrid ? "border border-white/20" : ""
                    )}
                    style={{
                      left: `${cell.lng}%`,
                      top: `${cell.lat}%`,
                      width: `${cell.size}px`,
                      height: `${cell.size}px`,
                      backgroundColor: getPovertyColor(cell.povertyIndex),
                    }}
                    title={`Poverty Index: ${Math.round(cell.povertyIndex * 100)}%`}
                  />
                ))}
                
                {/* Province Labels */}
                {provinces.map((province) => (
                  <ProvinceMarker 
                    key={province.id} 
                    province={province} 
                    isMobile={isMobile}
                    isActive={activeProvince === province.id}
                  />
                ))}
              </div>
            </div>
            
            {/* Map info */}
            <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md text-xs">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Each cell represents approximately 1km² area</span>
              </div>
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
  isActive: boolean;
}

function ProvinceMarker({ province, isMobile, isActive }: ProvinceMarkerProps) {
  // Calculate position based on province
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
  
  return (
    <div
      className={cn(
        "absolute flex flex-col items-center transition-all duration-300",
        isActive ? "scale-110" : ""
      )}
      style={getPositionStyle()}
    >
      <div className="mt-1 text-xs font-medium bg-background/80 px-2 py-0.5 rounded-md shadow-sm">
        {province.name}
      </div>
    </div>
  );
}
