
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Default mapbox token
const DEFAULT_MAPBOX_TOKEN = "pk.eyJ1IjoibHVtZW5tYXAiLCJhIjoiY2pqcjJodmN5YXozMDN2bnZoNDRoaTJrMiJ9.2R8CSUqL8b5HI7SiZBVgPQ";

export interface MapLocation {
  lat: number;
  lng: number;
}

interface InteractiveMapProps {
  center?: MapLocation;
  zoom?: number;
  povertyData?: Array<{
    lat: number;
    lng: number;
    povertyIndex: number;
  }>;
  height?: string;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

export const InteractiveMap = ({
  center = { lat: 30.3753, lng: 69.3451 }, // Pakistan center
  zoom = 5,
  povertyData = [],
  height = "600px",
  onMapLoad
}: InteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState(() => {
    return localStorage.getItem("mapbox_token") || DEFAULT_MAPBOX_TOKEN;
  });
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tempToken, setTempToken] = useState(mapboxToken);
  const [mapError, setMapError] = useState<string | null>(null);

  const initializeMap = () => {
    if (!mapContainer.current) return;
    
    // Clear any existing map
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    
    setLoading(true);
    setMapError(null);
    
    try {
      // Initialize Mapbox with the token
      mapboxgl.accessToken = mapboxToken;

      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [center.lng, center.lat],
        zoom: zoom,
        pitch: 40,
        bearing: 0,
        projection: { name: 'mercator' }
      });

      mapInstance.addControl(new mapboxgl.NavigationControl(), "top-right");
      mapInstance.addControl(new mapboxgl.FullscreenControl());
      mapInstance.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }));

      map.current = mapInstance;
      
      mapInstance.on("load", () => {
        setLoading(false);
        
        // Add custom data layer for poverty heatmap
        if (povertyData.length > 0) {
          addPovertyHeatmap(mapInstance, povertyData);
        }
        
        if (onMapLoad) {
          onMapLoad(mapInstance);
        }
        
        // Save working token to localStorage
        localStorage.setItem("mapbox_token", mapboxToken);
      });
      
      // Add the satellite toggle control
      class SatelliteToggleControl {
        private map: mapboxgl.Map;
        private container: HTMLDivElement;
        private satelliteMode: boolean;
        
        constructor() {
          this.satelliteMode = false;
        }
        
        onAdd(map: mapboxgl.Map) {
          this.map = map;
          this.container = document.createElement('div');
          this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
          
          const button = document.createElement('button');
          button.className = 'satellite-toggle';
          button.textContent = 'Satellite';
          button.style.padding = '6px 10px';
          
          button.addEventListener('click', () => {
            this.satelliteMode = !this.satelliteMode;
            if (this.satelliteMode) {
              map.setStyle('mapbox://styles/mapbox/satellite-streets-v12');
              button.textContent = 'Streets';
            } else {
              map.setStyle('mapbox://styles/mapbox/streets-v12');
              button.textContent = 'Satellite';
            }
          });
          
          this.container.appendChild(button);
          return this.container;
        }
        
        onRemove() {
          this.container.parentNode?.removeChild(this.container);
        }
      }
      
      mapInstance.addControl(new SatelliteToggleControl(), 'top-right');
      
      // Error handling - fixed the error.status access
      mapInstance.on('error', (e) => {
        console.error('Mapbox error:', e);
        // Check for authentication errors without assuming status property exists
        if (e.error && typeof e.error === 'object') {
          // Handle authentication errors generically
          setMapError("Map authentication error. Please update your Mapbox token.");
          setShowTokenInput(true);
        }
      });
    } catch (error) {
      console.error("Failed to initialize map:", error);
      setMapError("Failed to initialize map. Please try updating your Mapbox token.");
      setShowTokenInput(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeMap();
    
    return () => {
      // Properly cleanup the map to avoid "indoor" property error
      if (map.current) {
        try {
          // First remove any sources that might cause issues on cleanup
          if (map.current.getSource("poverty-data")) {
            if (map.current.getLayer("poverty-heat")) {
              map.current.removeLayer("poverty-heat");
            }
            if (map.current.getLayer("poverty-point")) {
              map.current.removeLayer("poverty-point");
            }
            map.current.removeSource("poverty-data");
          }
          
          // Then safely remove the map
          map.current.remove();
        } catch (error) {
          console.error("Error cleaning up map:", error);
        }
        map.current = null;
      }
    };
  }, [mapboxToken, center, zoom]);

  // Add poverty data as a heatmap layer
  const addPovertyHeatmap = (mapInstance: mapboxgl.Map, povertyData: any[]) => {
    // Convert data to GeoJSON format
    const geojsonData = {
      type: "FeatureCollection",
      features: povertyData.map((point) => ({
        type: "Feature",
        properties: {
          povertyIndex: point.povertyIndex
        },
        geometry: {
          type: "Point",
          coordinates: [point.lng, point.lat]
        }
      }))
    };

    // Check if source already exists and remove it
    if (mapInstance.getSource("poverty-data")) {
      if (mapInstance.getLayer("poverty-heat")) {
        mapInstance.removeLayer("poverty-heat");
      }
      if (mapInstance.getLayer("poverty-point")) {
        mapInstance.removeLayer("poverty-point");
      }
      mapInstance.removeSource("poverty-data");
    }

    // Add source
    mapInstance.addSource("poverty-data", {
      type: "geojson",
      data: geojsonData as any
    });

    // Add heatmap layer
    mapInstance.addLayer({
      id: "poverty-heat",
      type: "heatmap",
      source: "poverty-data",
      maxzoom: 15,
      paint: {
        // Increase weight as poverty index increases
        "heatmap-weight": [
          "interpolate",
          ["linear"],
          ["get", "povertyIndex"],
          0, 0,
          1, 1
        ],
        // Increase intensity as zoom level increases
        "heatmap-intensity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8, 1,
          15, 3
        ],
        // Color ramp for heatmap - adjust for poverty data:
        // green (low poverty) to red (high poverty)
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, "rgba(0, 255, 0, 0)",
          0.2, "rgba(150, 255, 0, 0.5)",
          0.4, "rgba(255, 255, 0, 0.7)",
          0.6, "rgba(255, 150, 0, 0.8)",
          0.8, "rgba(255, 70, 0, 0.9)",
          1, "rgba(255, 0, 0, 1)"
        ],
        // Radius increases with zoom level
        "heatmap-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8, 8,
          15, 25
        ],
        // Opacity decreases with zoom level
        "heatmap-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8, 0.9,
          15, 0.5
        ]
      }
    });

    // Add circle layer to visualize points at high zoom levels
    mapInstance.addLayer({
      id: "poverty-point",
      type: "circle",
      source: "poverty-data",
      minzoom: 12,
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          12, 3,
          15, 8
        ],
        "circle-color": [
          "interpolate",
          ["linear"],
          ["get", "povertyIndex"],
          0, "#67a9cf",
          0.5, "#f2ad1c",
          1, "#e31a1c"
        ],
        "circle-stroke-color": "white",
        "circle-stroke-width": 1,
        "circle-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          12, 0.5,
          15, 0.8
        ]
      }
    });
  };

  const handleUpdateToken = () => {
    if (tempToken && tempToken !== mapboxToken) {
      setMapboxToken(tempToken);
      localStorage.setItem("mapbox_token", tempToken);
      toast.success("Mapbox token updated");
    }
    setShowTokenInput(false);
  };

  return (
    <div className="w-full h-full relative" style={{ minHeight: height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Skeleton className="h-full w-full" />
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/80 backdrop-blur-sm">
          <div className="bg-card p-4 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-2">Map Error</h3>
            <p className="text-destructive mb-4">{mapError}</p>
            <Button 
              onClick={() => setShowTokenInput(true)}
              className="w-full"
            >
              Update Mapbox Token
            </Button>
          </div>
        </div>
      )}
      
      {showTokenInput && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-background/80 backdrop-blur-sm">
          <div className="bg-card p-4 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-2">Enter Mapbox Token</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get your token from <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
            </p>
            <Input 
              value={tempToken} 
              onChange={(e) => setTempToken(e.target.value)}
              placeholder="Enter your Mapbox token"
              className="mb-4"
            />
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowTokenInput(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateToken}
                className="flex-1"
              >
                Update Token
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div ref={mapContainer} className="w-full h-full rounded-lg"></div>
    </div>
  );
};

