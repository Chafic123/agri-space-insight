import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FarmSimulation from "@/components/FarmSimulation";
import DataDashboard from "@/components/DataDashboard";
import SatelliteMap from "@/components/SatelliteMap";
import EducationalPanel from "@/components/EducationalPanel";
import { Sprout } from "lucide-react";

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState({ lat: 40.7128, lon: -74.0060 }); // Default: New York

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">NASA AgriSim</h1>
              <p className="text-sm text-muted-foreground">Sustainable Farming with Satellite Data</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="simulation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="simulation">Farm Simulation</TabsTrigger>
            <TabsTrigger value="data">Live Data</TabsTrigger>
            <TabsTrigger value="map">Satellite Map</TabsTrigger>
            <TabsTrigger value="learn">Learn</TabsTrigger>
          </TabsList>

          <TabsContent value="simulation" className="space-y-6">
            <FarmSimulation location={selectedLocation} />
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <DataDashboard location={selectedLocation} />
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <SatelliteMap 
              location={selectedLocation} 
              onLocationChange={setSelectedLocation}
            />
          </TabsContent>

          <TabsContent value="learn" className="space-y-6">
            <EducationalPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
