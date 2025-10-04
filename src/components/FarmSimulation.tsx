import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Droplets, Leaf, Sun, Thermometer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFarmData } from "@/hooks/useFarmData";

interface FarmSimulationProps {
  location: { lat: number; lon: number };
}

const FarmSimulation = ({ location }: FarmSimulationProps) => {
  const { toast } = useToast();
  const { soilMoisture, vegetation, temperature, isLoading } = useFarmData(location);
  
  const [cropHealth, setCropHealth] = useState(50);
  const [waterLevel, setWaterLevel] = useState(60);
  const [nutrients, setNutrients] = useState(70);
  const [daysElapsed, setDaysElapsed] = useState(0);

  const handleIrrigate = () => {
    if (soilMoisture && soilMoisture < 30) {
      setWaterLevel(Math.min(100, waterLevel + 25));
      setCropHealth(Math.min(100, cropHealth + 15));
      toast({
        title: "Irrigation Applied",
        description: "NASA data shows low soil moisture - good decision!",
      });
    } else {
      setWaterLevel(Math.min(100, waterLevel + 10));
      toast({
        title: "Irrigation Applied",
        description: "Soil moisture was adequate. Consider waiting next time.",
        variant: "destructive",
      });
    }
  };

  const handleFertilize = () => {
    if (vegetation && vegetation < 0.5) {
      setNutrients(Math.min(100, nutrients + 30));
      setCropHealth(Math.min(100, cropHealth + 20));
      toast({
        title: "Fertilizer Applied",
        description: "Vegetation index is low - nutrients will help!",
      });
    } else {
      setNutrients(Math.min(100, nutrients + 15));
      toast({
        title: "Fertilizer Applied",
        description: "Vegetation health was good. This may be wasteful.",
        variant: "destructive",
      });
    }
  };

  const advanceDay = () => {
    setDaysElapsed(daysElapsed + 1);
    // Simulate natural degradation
    setCropHealth(Math.max(0, cropHealth - 5));
    setWaterLevel(Math.max(0, waterLevel - 10));
    setNutrients(Math.max(0, nutrients - 8));
  };

  const getHealthStatus = () => {
    if (cropHealth > 70) return { label: "Excellent", color: "bg-primary" };
    if (cropHealth > 40) return { label: "Good", color: "bg-secondary" };
    return { label: "Poor", color: "bg-destructive" };
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Farm Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Farm Status
            <Badge className={healthStatus.color}>{healthStatus.label}</Badge>
          </CardTitle>
          <CardDescription>Day {daysElapsed} of growing season</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-primary" />
                Crop Health
              </span>
              <span className="font-medium">{cropHealth}%</span>
            </div>
            <Progress value={cropHealth} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-secondary" />
                Water Level
              </span>
              <span className="font-medium">{waterLevel}%</span>
            </div>
            <Progress value={waterLevel} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-accent" />
                Nutrient Level
              </span>
              <span className="font-medium">{nutrients}%</span>
            </div>
            <Progress value={nutrients} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* NASA Data Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Live NASA Data</CardTitle>
          <CardDescription>Real-time satellite observations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading data...</p>
          ) : (
            <>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-secondary" />
                  <div>
                    <p className="text-sm font-medium">Soil Moisture</p>
                    <p className="text-xs text-muted-foreground">SMAP Data</p>
                  </div>
                </div>
                <span className="text-lg font-bold">{soilMoisture?.toFixed(1) || "--"}%</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Vegetation Index</p>
                    <p className="text-xs text-muted-foreground">MODIS NDVI</p>
                  </div>
                </div>
                <span className="text-lg font-bold">{vegetation?.toFixed(2) || "--"}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium">Temperature</p>
                    <p className="text-xs text-muted-foreground">Surface Temp</p>
                  </div>
                </div>
                <span className="text-lg font-bold">{temperature?.toFixed(1) || "--"}°C</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Farm Actions</CardTitle>
          <CardDescription>
            Make decisions based on NASA satellite data to optimize crop yield
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleIrrigate} className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Irrigate Field
            </Button>
            <Button onClick={handleFertilize} variant="secondary" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Apply Fertilizer
            </Button>
            <Button onClick={advanceDay} variant="outline" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Advance Day
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmSimulation;
