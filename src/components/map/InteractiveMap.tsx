
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Temporary mapbox token - in production this should be in environment variables
// This is a public token that can be safely included in the codebase
const MAPBOX_TOKEN = "pk.eyJ1IjoibHVtZW5tYXAiLCJhIjoiY2pqcjJodmN5YXozMDN2bnZoNDRoaTJrMiJ9.2R8CSUqL8b5HI7SiZBVgPQ";

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

  useEffect(() => {
    // Initialize Mapbox
    mapboxgl.accessToken = MAPBOX_TOKEN;

    if (!mapContainer.current) return;

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

    return () => {
      mapInstance.remove();
    };
  }, [center, zoom]);

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

  return (
    <div className="w-full h-full relative" style={{ minHeight: height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Skeleton className="h-full w-full" />
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full rounded-lg"></div>
    </div>
  );
};
