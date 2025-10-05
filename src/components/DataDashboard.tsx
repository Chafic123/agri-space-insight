import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useFarmData } from "@/hooks/useFarmData";
import { Skeleton } from "@/components/ui/skeleton";

interface DataDashboardProps {
  location: { lat: number; lon: number };
}

const DataDashboard = ({ location }: DataDashboardProps) => {
  const { historicalData, isLoading } = useFarmData(location);

  const mockHistoricalData = [
    { month: "Jan", moisture: 45, vegetation: 0.65, temp: 12 },
    { month: "Feb", moisture: 42, vegetation: 0.68, temp: 14 },
    { month: "Mar", moisture: 48, vegetation: 0.72, temp: 18 },
    { month: "Apr", moisture: 55, vegetation: 0.78, temp: 22 },
    { month: "May", moisture: 52, vegetation: 0.82, temp: 25 },
    { month: "Jun", moisture: 38, vegetation: 0.75, temp: 28 },
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Soil Moisture Trend</CardTitle>
            <CardDescription>SMAP Mission Data</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px]" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={mockHistoricalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="moisture" stroke="hsl(var(--sky-blue))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vegetation Health</CardTitle>
            <CardDescription>MODIS NDVI Index</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px]" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={mockHistoricalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="vegetation" stroke="hsl(var(--earth-green))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Temperature</CardTitle>
            <CardDescription>Surface Temperature (°C)</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px]" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockHistoricalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="temp" fill="hsl(var(--harvest-amber))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

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
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockHistoricalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="moisture" stroke="hsl(var(--sky-blue))" name="Soil Moisture %" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="vegetation" stroke="hsl(var(--earth-green))" name="Vegetation Index" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="temp" stroke="hsl(var(--harvest-amber))" name="Temperature °C" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
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

        <Card>
          <CardHeader>
            <CardTitle>Agricultural Insights</CardTitle>
            <CardDescription>AI-powered recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border-l-4 border-primary bg-muted p-3">
              <p className="text-sm font-medium">Irrigation Recommendation</p>
              <p className="text-xs text-muted-foreground mt-1">
                Soil moisture levels are optimal. Consider delaying irrigation by 2-3 days.
              </p>
            </div>
            <div className="rounded-lg border-l-4 border-secondary bg-muted p-3">
              <p className="text-sm font-medium">Vegetation Health</p>
              <p className="text-xs text-muted-foreground mt-1">
                NDVI shows healthy growth. Maintain current fertilization schedule.
              </p>
            </div>
            <div className="rounded-lg border-l-4 border-accent bg-muted p-3">
              <p className="text-sm font-medium">Weather Alert</p>
              <p className="text-xs text-muted-foreground mt-1">
                Rising temperatures forecasted. Increase monitoring frequency.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataDashboard;
