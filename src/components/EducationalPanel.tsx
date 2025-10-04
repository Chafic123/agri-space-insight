import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Satellite, Droplets, Leaf, TrendingUp, BookOpen } from "lucide-react";

const EducationalPanel = () => {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>How NASA Data Powers Sustainable Agriculture</CardTitle>
          <CardDescription>
            Learn how satellite observations help farmers make informed decisions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Satellite className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Remote Sensing</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Satellites orbit Earth, capturing data about crops, soil, and climate conditions 24/7 without touching the ground.
              </p>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-secondary" />
                <h3 className="font-semibold">Soil Moisture</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                SMAP mission measures moisture in the top 5cm of soil, helping farmers optimize irrigation and prevent water waste.
              </p>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Vegetation Health</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                NDVI (Normalized Difference Vegetation Index) shows plant health by analyzing reflected light wavelengths.
              </p>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">Predictive Analytics</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Historical data patterns help predict optimal planting times, irrigation needs, and harvest windows.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            NASA Missions & Data Sources
          </CardTitle>
          <CardDescription>Explore the satellites and instruments that make this possible</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="smap">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  SMAP - Soil Moisture Active Passive
                  <Badge variant="secondary">Active</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Launched in 2015, SMAP measures soil moisture from space using radar and radiometer instruments.
                </p>
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <strong>Why it matters:</strong> Soil moisture is critical for irrigation planning. SMAP data helps farmers
                  know exactly when to water, reducing waste and improving yields by up to 20%.
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>Resolution:</strong> 9km | <strong>Revisit time:</strong> 2-3 days
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="modis">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  MODIS - Moderate Resolution Imaging Spectroradiometer
                  <Badge variant="secondary">Active</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Two MODIS instruments (on Terra and Aqua satellites) capture Earth imagery in 36 spectral bands.
                </p>
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <strong>Why it matters:</strong> MODIS NDVI data reveals crop stress before it's visible to the human eye.
                  Early detection allows targeted intervention, preventing crop loss.
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>Resolution:</strong> 250m-1km | <strong>Coverage:</strong> Global daily
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="appears">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  AppEEARS - Analysis Ready Samples
                  <Badge variant="secondary">Tool</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  A web-based tool that extracts geospatial data from various NASA archives for specific areas and times.
                </p>
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <strong>Why it matters:</strong> Instead of downloading massive satellite files, farmers can get just the data
                  they need for their specific fields, making NASA data accessible to everyone.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="harvest">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  NASA Harvest - Food Security & Agriculture
                  <Badge variant="secondary">Program</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  NASA's applied sciences program focused on enhancing food security through satellite Earth observations.
                </p>
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <strong>Why it matters:</strong> NASA Harvest bridges the gap between satellite data and practical farming
                  applications, helping farmers worldwide adopt sustainable practices.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="glam">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  GLAM - Global Agriculture Monitoring
                  <Badge variant="secondary">System</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Web platform for near-real-time monitoring of global croplands using MODIS data.
                </p>
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <strong>Why it matters:</strong> GLAM provides free access to crop condition monitoring, helping farmers and
                  policymakers respond quickly to agricultural challenges.
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Game Mechanics & Learning Objectives</CardTitle>
          <CardDescription>How this simulation teaches sustainable farming</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="rounded-lg border-l-4 border-primary bg-muted p-4">
              <h4 className="font-semibold mb-2">Data-Driven Decision Making</h4>
              <p className="text-sm text-muted-foreground">
                Players learn to base farming decisions on real satellite data rather than guesswork. Irrigation and
                fertilization choices are rewarded when they align with actual environmental conditions.
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-secondary bg-muted p-4">
              <h4 className="font-semibold mb-2">Resource Conservation</h4>
              <p className="text-sm text-muted-foreground">
                Over-irrigating when soil moisture is adequate results in penalties, teaching the importance of water
                conservation and preventing waste.
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-accent bg-muted p-4">
              <h4 className="font-semibold mb-2">Understanding Satellite Technology</h4>
              <p className="text-sm text-muted-foreground">
                Players see how NASA missions like SMAP and MODIS provide actionable agricultural intelligence, demystifying
                space technology's role in everyday farming.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationalPanel;
