import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Droplets, Leaf, Sun, Thermometer, AlertTriangle, CheckCircle } from "lucide-react";
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
  const [lastAction, setLastAction] = useState<'irrigate' | 'fertilize' | 'advance' | null>(null);

  // Dynamic crop health calculation based on NASA data and farm conditions
  useEffect(() => {
    if (isLoading) return;

    let healthChange = 0;

    // Base health degradation per day
    healthChange -= 2;

    // Soil moisture impact
    if (soilMoisture) {
      if (soilMoisture < 20) {
        healthChange -= 8; // Critical drought
      } else if (soilMoisture < 40) {
        healthChange -= 4; // Moderate drought
      } else if (soilMoisture > 85) {
        healthChange -= 3; // Overwatered
      } else if (soilMoisture >= 40 && soilMoisture <= 70) {
        healthChange += 2; // Optimal moisture
      }
    }

    // Temperature impact
    if (temperature) {
      if (temperature < 5 || temperature > 35) {
        healthChange -= 6; // Extreme temperatures
      } else if (temperature < 10 || temperature > 30) {
        healthChange -= 3; // Suboptimal temperatures
      } else if (temperature >= 18 && temperature <= 25) {
        healthChange += 1; // Optimal temperature range
      }
    }

    // Vegetation health correlation
    if (vegetation) {
      if (vegetation < 0.3) {
        healthChange -= 5; // Poor vegetation
      } else if (vegetation > 0.7) {
        healthChange += 3; // Excellent vegetation
      }
    }

    // Farm resource impacts
    if (waterLevel < 20) healthChange -= 4;
    if (waterLevel > 80) healthChange += 1;
    if (nutrients < 20) healthChange -= 3;
    if (nutrients > 60) healthChange += 1;

    // Apply gradual health change (smoother transitions)
    setCropHealth(prev => {
      const newHealth = prev + healthChange;
      return Math.max(0, Math.min(100, newHealth));
    });

  }, [daysElapsed, soilMoisture, temperature, vegetation, waterLevel, nutrients, isLoading]);

  // Auto-degrade resources each day
  useEffect(() => {
    if (daysElapsed > 0) {
      setWaterLevel(prev => Math.max(0, prev - (8 + Math.random() * 4)));
      setNutrients(prev => Math.max(0, prev - (6 + Math.random() * 3)));
    }
  }, [daysElapsed]);

  const handleIrrigate = () => {
    const waterBoost = 25 + Math.random() * 10;
    const newWaterLevel = Math.min(100, waterLevel + waterBoost);
    setWaterLevel(newWaterLevel);
    setLastAction('irrigate');

    // Smart irrigation feedback based on NASA data
    if (soilMoisture && soilMoisture < 30) {
      toast({
        title: "✅ Smart Irrigation!",
        description: "NASA data confirmed low soil moisture - perfect timing!",
      });
    } else if (soilMoisture && soilMoisture > 70) {
      toast({
        title: "⚠️ Over-Irrigation",
        description: "Soil moisture is already high. Water conservation needed.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Irrigation Applied",
        description: "Field watered. Monitor soil moisture levels.",
      });
    }
  };

  const handleFertilize = () => {
    const nutrientBoost = 20 + Math.random() * 15;
    const newNutrients = Math.min(100, nutrients + nutrientBoost);
    setNutrients(newNutrients);
    setLastAction('fertilize');

    // Smart fertilization feedback based on NASA data
    if (vegetation && vegetation < 0.4) {
      toast({
        title: "✅ Nutrient Boost!",
        description: "Vegetation index shows need for nutrients - excellent decision!",
      });
    } else if (vegetation && vegetation > 0.7) {
      toast({
        title: "⚠️ Excess Fertilizer",
        description: "Crops are already healthy. Consider soil testing.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Fertilizer Applied",
        description: "Nutrients added to soil.",
      });
    }
  };

  const advanceDay = () => {
    setDaysElapsed(prev => prev + 1);
    setLastAction('advance');

    // Daily weather impact simulation
    let weatherMessage = "Another day passes...";
    if (temperature && temperature > 32) {
      weatherMessage = "Hot day - increased water evaporation.";
    } else if (temperature && temperature < 8) {
      weatherMessage = "Cool day - slower growth rates.";
    }

    toast({
      title: `🌅 Day ${daysElapsed + 1} Begins`,
      description: weatherMessage,
    });
  };

  const getHealthStatus = () => {
    if (cropHealth > 80) return { label: "Excellent", color: "bg-green-500", icon: CheckCircle };
    if (cropHealth > 60) return { label: "Good", color: "bg-primary", icon: CheckCircle };
    if (cropHealth > 40) return { label: "Fair", color: "bg-yellow-500", icon: AlertTriangle };
    if (cropHealth > 20) return { label: "Poor", color: "bg-orange-500", icon: AlertTriangle };
    return { label: "Critical", color: "bg-destructive", icon: AlertTriangle };
  };

  const getHealthTrend = () => {
    // This would track previous health values in a real implementation
    // For now, we'll simulate based on recent conditions
    if (lastAction === 'irrigate' && soilMoisture && soilMoisture < 40) return "↗️ Improving";
    if (lastAction === 'fertilize' && vegetation && vegetation < 0.5) return "↗️ Improving";
    if (waterLevel < 20 || nutrients < 20) return "↘️ Declining";
    return "➡️ Stable";
  };

  const healthStatus = getHealthStatus();
  const HealthIcon = healthStatus.icon;
  const healthTrend = getHealthTrend();

  // Calculate action effectiveness
  const getIrrigationEffectiveness = () => {
    if (!soilMoisture) return "Unknown";
    if (soilMoisture < 30) return "High";
    if (soilMoisture < 50) return "Medium";
    return "Low";
  };

  const getFertilizationEffectiveness = () => {
    if (!vegetation) return "Unknown";
    if (vegetation < 0.4) return "High";
    if (vegetation < 0.6) return "Medium";
    return "Low";
  };

  const irrigationEffectiveness = getIrrigationEffectiveness();
  const fertilizationEffectiveness = getFertilizationEffectiveness();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Farm Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Farm Status
            <div className="flex items-center gap-2">
              <Badge className={healthStatus.color}>
                <HealthIcon className="h-3 w-3 mr-1" />
                {healthStatus.label}
              </Badge>
              <span className="text-xs text-muted-foreground">{healthTrend}</span>
            </div>
          </CardTitle>
          <CardDescription>
            Day {daysElapsed} of growing season
            {temperature && (
              <span className="ml-2">• {temperature.toFixed(1)}°C</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-primary" />
                Crop Health
              </span>
              <span className="font-medium">{Math.round(cropHealth)}%</span>
            </div>
            <Progress value={cropHealth} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                Water Level
                {waterLevel < 30 && <AlertTriangle className="h-3 w-3 text-red-500" />}
              </span>
              <span className="font-medium">{Math.round(waterLevel)}%</span>
            </div>
            <Progress value={waterLevel} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                Nutrient Level
                {nutrients < 25 && <AlertTriangle className="h-3 w-3 text-red-500" />}
              </span>
              <span className="font-medium">{Math.round(nutrients)}%</span>
            </div>
            <Progress value={nutrients} className="h-2" />
          </div>

          {/* Environmental Impact Summary */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Environmental Factors</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Soil Moisture: {soilMoisture ? `${soilMoisture.toFixed(1)}%` : '--'}</div>
              <div>Vegetation: {vegetation ? vegetation.toFixed(2) : '--'}</div>
              <div>Temperature: {temperature ? `${temperature.toFixed(1)}°C` : '--'}</div>
              <div>Season: Day {daysElapsed}</div>
            </div>
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
            <p className="text-sm text-muted-foreground">Loading NASA satellite data...</p>
          ) : (
            <>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Soil Moisture</p>
                    <p className="text-xs text-muted-foreground">SMAP Data • Irrigation: {irrigationEffectiveness}</p>
                  </div>
                </div>
                <span className="text-lg font-bold">{soilMoisture?.toFixed(1) || "--"}%</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Vegetation Index</p>
                    <p className="text-xs text-muted-foreground">MODIS NDVI • Fertilization: {fertilizationEffectiveness}</p>
                  </div>
                </div>
                <span className="text-lg font-bold">{vegetation?.toFixed(2) || "--"}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Temperature</p>
                    <p className="text-xs text-muted-foreground">Surface Temp • Impact: {
                      temperature ? (temperature > 30 ? 'High' : temperature < 10 ? 'High' : 'Normal') : '--'
                    }</p>
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
            <Button
              onClick={handleIrrigate}
              className="flex items-center gap-2"
              variant={irrigationEffectiveness === 'High' ? "default" : "secondary"}
            >
              <Droplets className="h-4 w-4" />
              Irrigate Field
              {irrigationEffectiveness === 'High' && <Badge variant="outline" className="ml-1 text-xs">Recommended</Badge>}
            </Button>
            <Button
              onClick={handleFertilize}
              variant={fertilizationEffectiveness === 'High' ? "default" : "secondary"}
              className="flex items-center gap-2"
            >
              <Leaf className="h-4 w-4" />
              Apply Fertilizer
              {fertilizationEffectiveness === 'High' && <Badge variant="outline" className="ml-1 text-xs">Recommended</Badge>}
            </Button>
            <Button onClick={advanceDay} variant="outline" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Advance Day
            </Button>
          </div>

          {/* Action Recommendations */}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">💡 Smart Farming Tips</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              {soilMoisture && soilMoisture < 30 && (
                <p>• Soil moisture is critically low - irrigation highly recommended</p>
              )}
              {vegetation && vegetation < 0.4 && (
                <p>• Vegetation health is poor - consider fertilization</p>
              )}
              {waterLevel < 30 && (
                <p>• Water reserves are low - plan irrigation soon</p>
              )}
              {nutrients < 25 && (
                <p>• Nutrient levels are critical - fertilization needed</p>
              )}
              {(!soilMoisture || soilMoisture > 70) && (!vegetation || vegetation > 0.7) && (
                <p>• Conditions are optimal - monitor and maintain current levels</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmSimulation;