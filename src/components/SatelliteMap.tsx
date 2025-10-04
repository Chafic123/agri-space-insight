import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SatelliteMapProps {
  location: { lat: number; lon: number };
  onLocationChange: (location: { lat: number; lon: number }) => void;
}

const SatelliteMap = ({ location, onLocationChange }: SatelliteMapProps) => {
  const { toast } = useToast();
  const [lat, setLat] = useState(location.lat.toString());
  const [lon, setLon] = useState(location.lon.toString());

  const handleLocationUpdate = () => {
    const newLat = parseFloat(lat);
    const newLon = parseFloat(lon);

    if (isNaN(newLat) || isNaN(newLon)) {
      toast({
        title: "Invalid Coordinates",
        description: "Please enter valid latitude and longitude values.",
        variant: "destructive",
      });
      return;
    }

    onLocationChange({ lat: newLat, lon: newLon });
    toast({
      title: "Location Updated",
      description: `Now viewing ${newLat.toFixed(2)}°, ${newLon.toFixed(2)}°`,
    });
  };

  // NASA Worldview URL (for external view)
  const worldviewUrl = `https://worldview.earthdata.nasa.gov/?v=${location.lon - 2
    },${location.lat - 2},${location.lon + 2},${location.lat + 2
    }&l=VIIRS_NOAA20_CorrectedReflectance_TrueColor,MODIS_Aqua_CorrectedReflectance_TrueColor,MODIS_Terra_CorrectedReflectance_TrueColor&lg=true`;

  const presetLocations = [
    { name: "Iowa Corn Belt", lat: 42.0308, lon: -93.6319 },
    { name: "California Central Valley", lat: 36.7783, lon: -119.4179 },
    { name: "Kansas Wheat Fields", lat: 38.5266, lon: -96.7265 },
    { name: "Nebraska Farmland", lat: 41.4925, lon: -99.9018 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>NASA Worldview Satellite Imagery</CardTitle>
            <CardDescription>
              Real-time Earth observations from multiple satellites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video overflow-hidden rounded-lg border bg-muted flex items-center justify-center text-muted-foreground">
              <p>
                🚫 NASA Worldview cannot be embedded.
                <br />
                Use the button below to view live imagery.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  Current Location: {location.lat.toFixed(4)}°N,{" "}
                  {Math.abs(location.lon).toFixed(4)}°W
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => window.open(worldviewUrl, "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in NASA Worldview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Location Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Location Controls</CardTitle>
            <CardDescription>Set custom coordinates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="e.g., 40.7128"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.0001"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                placeholder="e.g., -74.0060"
              />
            </div>
            <Button onClick={handleLocationUpdate} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Update Location
            </Button>
          </CardContent>
        </Card>

        {/* Presets */}
        <Card>
          <CardHeader>
            <CardTitle>Preset Locations</CardTitle>
            <CardDescription>Major U.S. agricultural regions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {presetLocations.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setLat(preset.lat.toString());
                  setLon(preset.lon.toString());
                  onLocationChange({ lat: preset.lat, lon: preset.lon });
                  toast({
                    title: preset.name,
                    description: "Location updated",
                  });
                }}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {preset.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Layers */}
        <Card>
          <CardHeader>
            <CardTitle>Satellite Layers</CardTitle>
            <CardDescription>Available data layers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
              <iframe
                src={worldviewUrl}
                title="NASA Worldview"
                width="100%"
                height="100%"
                style={{
                  border: "none",
                  minHeight: "480px",
                }}
                allowFullScreen
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  Current Location: {location.lat.toFixed(4)}°N,{" "}
                  {Math.abs(location.lon).toFixed(4)}°W
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => window.open(worldviewUrl, "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in NASA Worldview
              </Button>
            </div>
          </CardContent>

        </Card>
      </div>
    </div>
  );
};

export default SatelliteMap;
