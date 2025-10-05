import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, ExternalLink, Satellite, Layers, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SatelliteMapProps {
  location: { lat: number; lon: number };
  onLocationChange: (location: { lat: number; lon: number }) => void;
}

const SatelliteMap = ({ location, onLocationChange }: SatelliteMapProps) => {
  const { toast } = useToast();
  const [lat, setLat] = useState(location.lat.toString());
  const [lon, setLon] = useState(location.lon.toString());
  const [selectedLayer, setSelectedLayer] = useState("truecolor");

  // Sync local state with prop changes
  useEffect(() => {
    setLat(location.lat.toString());
    setLon(location.lon.toString());
  }, [location.lat, location.lon]);

  const handleLocationUpdate = () => {
    const newLat = parseFloat(lat);
    const newLon = parseFloat(lon);

    if (isNaN(newLat) || isNaN(newLon) || newLat < -90 || newLat > 90 || newLon < -180 || newLon > 180) {
      toast({
        title: "Invalid Coordinates",
        description: "Please enter valid latitude (-90 to 90) and longitude (-180 to 180) values.",
        variant: "destructive",
      });
      return;
    }

    onLocationChange({ lat: newLat, lon: newLon });
    toast({
      title: "Location Updated",
      description: `Now viewing ${newLat.toFixed(4)}°N, ${Math.abs(newLon).toFixed(4)}°W`,
    });
  };

  // Enhanced NASA Worldview URL with layer support
  const getWorldviewUrl = () => {
    const baseUrl = "https://worldview.earthdata.nasa.gov";
    const bounds = `${location.lon - 2},${location.lat - 2},${location.lon + 2},${location.lat + 2}`;
    
    const layers = {
      truecolor: "VIIRS_NOAA20_CorrectedReflectance_TrueColor,MODIS_Aqua_CorrectedReflectance_TrueColor,MODIS_Terra_CorrectedReflectance_TrueColor",
      vegetation: "MODIS_Terra_NDVI,MODIS_Aqua_NDVI",
      soilmoisture: "SMAP_L4_Uncertainty_Analysis_Soil_Moisture",
      temperature: "MODIS_Terra_Land_Surface_Temp_Day",
      fires: "VIIRS_NOAA20_Thermal_Anomalies_375m_All,VIIRS_SNPP_Thermal_Anomalies_375m_All"
    };

    return `${baseUrl}/?v=${bounds}&l=${layers[selectedLayer as keyof typeof layers]}&lg=true&t=${Date.now()}`;
  };

  const presetLocations = [
    { name: "Iowa Corn Belt", lat: 42.0308, lon: -93.6319, description: "Major corn production region" },
    { name: "California Central Valley", lat: 36.7783, lon: -119.4179, description: "Diverse crop production" },
    { name: "Kansas Wheat Fields", lat: 38.5266, lon: -96.7265, description: "Winter wheat heartland" },
    { name: "Nebraska Farmland", lat: 41.4925, lon: -99.9018, description: "Corn and soybean fields" },
    { name: "Lebanon Farmland", lat: 33.6213, lon: 35.4870, description: "Mediterranean agriculture" },
    { name: "Brazil Soybean Region", lat: -12.7958, lon: -55.4245, description: "Tropical agriculture" },
  ];

  const satelliteLayers = [
    { id: "truecolor", name: "True Color", description: "Natural color imagery", icon: "🛰️" },
    { id: "vegetation", name: "Vegetation Index", description: "NDVI plant health", icon: "🌿" },
    { id: "soilmoisture", name: "Soil Moisture", description: "SMAP soil water content", icon: "💧" },
    { id: "temperature", name: "Temperature", description: "Land surface temperature", icon: "🌡️" },
    { id: "fires", name: "Fire Detection", description: "Thermal anomalies", icon: "🔥" },
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLocationUpdate();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {/* Main Map Display */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="h-5 w-5" />
                  NASA Worldview Satellite Imagery
                </CardTitle>
                <CardDescription>
                  Real-time Earth observations from multiple satellites
                </CardDescription>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Layers className="h-3 w-3" />
                {satelliteLayers.find(layer => layer.id === selectedLayer)?.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video overflow-hidden rounded-lg border bg-muted relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                <div className="text-center text-muted-foreground">
                  <Satellite className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Live Satellite View</p>
                  <p className="text-sm">
                    Interactive NASA Worldview imagery
                  </p>
                </div>
              </div>
              
              {/* Embedded NASA Worldview with better styling */}
              <iframe
                src={getWorldviewUrl()}
                title="NASA Worldview Satellite Imagery"
                width="100%"
                height="100%"
                className="border-0"
                style={{ minHeight: '400px' }}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <div>
                  <span className="font-medium">Current Location:</span>
                  <span className="text-muted-foreground ml-2">
                    {location.lat.toFixed(4)}°N, {Math.abs(location.lon).toFixed(4)}°W
                  </span>
                </div>
              </div>
              <Button
                onClick={() => window.open(getWorldviewUrl(), "_blank")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open in NASA Worldview
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Satellite Layers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Satellite Data Layers
            </CardTitle>
            <CardDescription>
              Choose different NASA satellite data visualizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {satelliteLayers.map((layer) => (
                <Button
                  key={layer.id}
                  variant={selectedLayer === layer.id ? "default" : "outline"}
                  className="h-auto py-3 flex flex-col items-center gap-2"
                  onClick={() => setSelectedLayer(layer.id)}
                >
                  <span className="text-lg">{layer.icon}</span>
                  <div className="text-xs">
                    <div className="font-medium">{layer.name}</div>
                    <div className="text-muted-foreground">{layer.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Location Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Location Controls
            </CardTitle>
            <CardDescription>Set custom coordinates for your farm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="flex items-center gap-2">
                  <span>🌎</span>
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  min="-90"
                  max="90"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., 40.7128"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="flex items-center gap-2">
                  <span>📍</span>
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  min="-180"
                  max="180"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., -74.0060"
                  className="w-full"
                />
              </div>
            </div>
            <Button 
              onClick={handleLocationUpdate} 
              className="w-full flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Update Location
            </Button>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Latitude: -90° to 90° (N/S)</p>
              <p>• Longitude: -180° to 180° (E/W)</p>
              <p>• Use decimal degrees format</p>
            </div>
          </CardContent>
        </Card>

        {/* Preset Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Preset Locations</CardTitle>
            <CardDescription>Major agricultural regions worldwide</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {presetLocations.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                className="w-full justify-start h-auto py-3"
                onClick={() => {
                  setLat(preset.lat.toString());
                  setLon(preset.lon.toString());
                  onLocationChange({ lat: preset.lat, lon: preset.lon });
                  toast({
                    title: `Location set to ${preset.name}`,
                    description: preset.description,
                  });
                }}
              >
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{preset.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {preset.description}
                  </span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common satellite views</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                // Recenter on current location
                onLocationChange(location);
                toast({
                  title: "Map Recentered",
                  description: "Back to current farm location",
                });
              }}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Re-center Map
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                // Reset to default layer
                setSelectedLayer("truecolor");
                toast({
                  title: "Layer Reset",
                  description: "Switched to True Color imagery",
                });
              }}
            >
              <Layers className="mr-2 h-4 w-4" />
              Reset to True Color
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SatelliteMap;