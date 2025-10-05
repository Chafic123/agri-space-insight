import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useFarmData } from "@/hooks/useFarmData";
import { Skeleton } from "@/components/ui/skeleton";

interface DataDashboardProps {
  location: { lat: number; lon: number };
}

const DataDashboard = ({ location }: DataDashboardProps) => {
  const { historicalData, soilMoisture, vegetation, temperature, isLoading } = useFarmData(location);

  // Format historical data for charts
  const chartData = historicalData?.map((dataPoint, index) => ({
    // Use short month names for display
    month: new Date(dataPoint.date).toLocaleDateString('en-US', { month: 'short' }),
    // Full date for sorting if needed
    fullDate: new Date(dataPoint.date),
    moisture: Math.round(dataPoint.soilMoisture),
    vegetation: Number(dataPoint.vegetation.toFixed(2)),
    temp: Math.round(dataPoint.temperature),
  })) || [];

  // Generate AI-powered recommendations based on current data
  const getRecommendations = () => {
    const recommendations = [];

    // Irrigation recommendation
    if (soilMoisture && soilMoisture < 30) {
      recommendations.push({
        type: "irrigation",
        title: "Irrigation Recommendation",
        message: "Soil moisture is critically low. Immediate irrigation recommended.",
        borderColor: "border-red-500"
      });
    } else if (soilMoisture && soilMoisture < 50) {
      recommendations.push({
        type: "irrigation",
        title: "Irrigation Recommendation",
        message: "Soil moisture levels are moderate. Consider irrigation in the next 1-2 days.",
        borderColor: "border-orange-500"
      });
    } else {
      recommendations.push({
        type: "irrigation",
        title: "Irrigation Recommendation",
        message: "Soil moisture levels are optimal. Consider delaying irrigation by 2-3 days.",
        borderColor: "border-primary"
      });
    }

    // Vegetation health recommendation
    if (vegetation && vegetation < 0.3) {
      recommendations.push({
        type: "vegetation",
        title: "Vegetation Health",
        message: "NDVI shows poor vegetation health. Consider soil testing and fertilization.",
        borderColor: "border-red-500"
      });
    } else if (vegetation && vegetation < 0.6) {
      recommendations.push({
        type: "vegetation",
        title: "Vegetation Health",
        message: "NDVI shows moderate growth. Monitor nutrient levels closely.",
        borderColor: "border-orange-500"
      });
    } else {
      recommendations.push({
        type: "vegetation",
        title: "Vegetation Health",
        message: "NDVI shows healthy growth. Maintain current fertilization schedule.",
        borderColor: "border-secondary"
      });
    }

    // Temperature recommendation
    if (temperature && temperature > 35) {
      recommendations.push({
        type: "temperature",
        title: "Weather Alert",
        message: "High temperatures detected. Increase irrigation frequency and monitor for heat stress.",
        borderColor: "border-red-500"
      });
    } else if (temperature && temperature < 5) {
      recommendations.push({
        type: "temperature",
        title: "Weather Alert",
        message: "Low temperatures detected. Protect crops from potential frost damage.",
        borderColor: "border-blue-500"
      });
    } else {
      recommendations.push({
        type: "temperature",
        title: "Weather Forecast",
        message: "Temperatures are within optimal range. Continue current monitoring schedule.",
        borderColor: "border-accent"
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  // Get current values for display
  const currentValues = {
    moisture: soilMoisture ? Math.round(soilMoisture) : null,
    vegetation: vegetation ? Number(vegetation.toFixed(2)) : null,
    temp: temperature ? Math.round(temperature) : null,
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Soil Moisture Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Soil Moisture Trend</CardTitle>
            <CardDescription>
              SMAP Mission Data
              {currentValues.moisture !== null && (
                <span className="ml-2 font-semibold text-foreground">
                  {currentValues.moisture}%
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px]" />
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, "Soil Moisture"]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="moisture" 
                    stroke="hsl(var(--sky-blue))" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No historical data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vegetation Health Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vegetation Health</CardTitle>
            <CardDescription>
              MODIS NDVI Index
              {currentValues.vegetation !== null && (
                <span className="ml-2 font-semibold text-foreground">
                  {currentValues.vegetation}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px]" />
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip 
                    formatter={(value) => [value, "NDVI"]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="vegetation" 
                    stroke="hsl(var(--earth-green))" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No historical data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Temperature Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Temperature</CardTitle>
            <CardDescription>
              Surface Temperature (°C)
              {currentValues.temp !== null && (
                <span className="ml-2 font-semibold text-foreground">
                  {currentValues.temp}°C
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px]" />
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}°C`, "Temperature"]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar 
                    dataKey="temp" 
                    fill="hsl(var(--harvest-amber))" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No historical data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Combined Environmental Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Combined Environmental Factors</CardTitle>
          <CardDescription>
            Multi-parameter analysis for {location.lat.toFixed(2)}°N, {location.lon.toFixed(2)}°W
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px]" />
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 40]} />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === "Soil Moisture %") return [`${value}%`, name];
                    if (name === "Vegetation Index") return [value, name];
                    if (name === "Temperature °C") return [`${value}°C`, name];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="moisture" 
                  stroke="hsl(var(--sky-blue))" 
                  name="Soil Moisture %" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="vegetation" 
                  stroke="hsl(var(--earth-green))" 
                  name="Vegetation Index" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="hsl(var(--harvest-amber))" 
                  name="Temperature °C" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No historical data available for combined analysis
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <CardDescription>NASA Earth Observation Systems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">SMAP</p>
                <p className="text-xs text-muted-foreground">Soil Moisture Active Passive</p>
              </div>
              <span className="text-xs text-primary">Active</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">MODIS</p>
                <p className="text-xs text-muted-foreground">Moderate Resolution Imaging Spectroradiometer</p>
              </div>
              <span className="text-xs text-primary">Active</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">AppEEARS</p>
                <p className="text-xs text-muted-foreground">Application for Extracting and Exploring Analysis Ready Samples</p>
              </div>
              <span className="text-xs text-primary">Active</span>
            </div>
          </CardContent>
        </Card>

        {/* Agricultural Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Agricultural Insights</CardTitle>
            <CardDescription>AI-powered recommendations based on current data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, index) => (
              <div 
                key={index}
                className={`rounded-lg border-l-4 ${rec.borderColor} bg-muted p-3`}
              >
                <p className="text-sm font-medium">{rec.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {rec.message}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataDashboard;