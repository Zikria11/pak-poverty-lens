
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { provinces } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { MapPin } from "lucide-react";

// Generate 1km² grid cells for different provinces with realistic coordinates
const generatePovertyData = (provinceId: string | null) => {
  // Base coordinates for Pakistan provinces
  const baseCoordinates: Record<string, { lat: number; lng: number; radius: number; povertyBase: number }> = {
    "punjab": { lat: 31.1704, lng: 72.7097, radius: 1.5, povertyBase: 0.3 }, 
    "sindh": { lat: 25.8943, lng: 68.5247, radius: 1.3, povertyBase: 0.5 },
    "kpk": { lat: 34.9526, lng: 72.3311, radius: 1.1, povertyBase: 0.4 },
    "balochistan": { lat: 28.4907, lng: 65.0959, radius: 2.5, povertyBase: 0.6 }
  };

  // Generate points across all provinces if no specific province is selected
  const provincesToProcess = provinceId ? [provinceId] : Object.keys(baseCoordinates);
  
  let allPoints: Array<{ lat: number; lng: number; povertyIndex: number }> = [];
  
  provincesToProcess.forEach(province => {
    const { lat, lng, radius, povertyBase } = baseCoordinates[province];
    
    // Create a grid of points around the base coordinates
    // Each point represents approximately a 1km² area
    const pointCount = 100; // Number of points to generate per province
    const points = [];
    
    for (let i = 0; i < pointCount; i++) {
      // Create a random point within the province radius
      // Using a simple approach to distribute points in a circle
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const pointLat = lat + distance * Math.cos(angle) * 0.01;
      const pointLng = lng + distance * Math.sin(angle) * 0.015;
      
      // Create clusters of poverty
      const distanceFromCenter = Math.sqrt(
        Math.pow(pointLat - lat, 2) + Math.pow(pointLng - lng, 2)
      );
      
      // Generate poverty index based on distance from center and some randomness
      // Further from center generally means higher poverty in this model
      const distanceFactor = distanceFromCenter / radius;
      const randomFactor = Math.random() * 0.3;
      let povertyIndex = povertyBase + (distanceFactor * 0.5) + randomFactor;
      
      // Ensure poverty index is between 0 and 1
      povertyIndex = Math.min(1, Math.max(0, povertyIndex));
      
      points.push({
        lat: pointLat,
        lng: pointLng,
        povertyIndex
      });
    }
    
    allPoints = [...allPoints, ...points];
  });
  
  return allPoints;
};

export function PovertyMap() {
  const [loading, setLoading] = useState(true);
  const [activeProvince, setActiveProvince] = useState<string | null>(null);
  const [povertyData, setPovertyData] = useState<Array<{ lat: number; lng: number; povertyIndex: number }>>([]);
  
  useEffect(() => {
    // Generate province-specific data when active province changes
    const data = generatePovertyData(activeProvince);
    setPovertyData(data);
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [activeProvince]);
  
  // Get center coordinates based on selected province
  const getMapCenter = () => {
    if (!activeProvince) {
      return { lat: 30.3753, lng: 69.3451 }; // Center of Pakistan
    }
    
    const provinceCenters: Record<string, { lat: number; lng: number; zoom: number }> = {
      "punjab": { lat: 31.1704, lng: 72.7097, zoom: 7 },
      "sindh": { lat: 25.8943, lng: 68.5247, zoom: 7 },
      "kpk": { lat: 34.9526, lng: 72.3311, zoom: 7 },
      "balochistan": { lat: 28.4907, lng: 65.0959, zoom: 6 }
    };
    
    return provinceCenters[activeProvince] || { lat: 30.3753, lng: 69.3451 };
  };
  
  const center = getMapCenter();
  const zoom = activeProvince ? (getMapCenter() as any).zoom || 7 : 5;
  
  return (
    <Card className="h-[600px] md:h-[700px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pakistan Poverty Index</CardTitle>
            <CardDescription>
              Interactive map showing poverty indices across Pakistan (1km² resolution)
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-1"></span>
                <span>Low</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></span>
                <span>Medium</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-red-500 mr-1"></span>
                <span>High</span>
              </div>
            </div>
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
        <InteractiveMap
          center={center}
          zoom={zoom}
          povertyData={povertyData}
          height="100%"
        />

        {/* Map info */}
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md text-xs z-10">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>Each data point represents approximately 1km² area</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
