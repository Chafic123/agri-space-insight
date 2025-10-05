import { useState, useEffect } from "react";

const NASA_API_KEY = "uTFJAPUTUgFpjae5isgW1g0TMkLA1GiYe30ucmrf";

interface FarmData {
  soilMoisture: number;
  vegetation: number;
  temperature: number;
  timestamp: Date;
}

interface HistoricalDataPoint extends FarmData {
  date: Date;
}

interface FarmDataHook {
  soilMoisture: number | null;
  vegetation: number | null;
  temperature: number | null;
  historicalData: HistoricalDataPoint[] | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface Location {
  lat: number;
  lon: number;
}

export const useFarmData = (location: Location): FarmDataHook => {
  const [soilMoisture, setSoilMoisture] = useState<number | null>(null);
  const [vegetation, setVegetation] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchNASAData = async () => {
      // Don't fetch if no location provided
      if (!location.lat || !location.lon) {
        setError("Invalid location provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Try to fetch real data first, fall back to simulation if it fails
        let realData: FarmData | null = null;
        
        try {
          realData = await fetchRealNASAData(location.lat, location.lon);
        } catch (apiError) {
          console.warn("NASA API failed, using simulated data:", apiError);
          realData = null;
        }

        if (realData) {
          // Use real NASA data
          setSoilMoisture(realData.soilMoisture);
          setVegetation(realData.vegetation);
          setTemperature(realData.temperature);
        } else {
          // Use simulated data with location-based variations
          const simulatedData = generateSimulatedData(location);
          setSoilMoisture(simulatedData.soilMoisture);
          setVegetation(simulatedData.vegetation);
          setTemperature(simulatedData.temperature);
        }

        // Generate historical trends
        const historical = generateHistoricalData(location);
        setHistoricalData(historical);
        
        setLastUpdated(new Date());

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch farm data";
        setError(errorMessage);
        console.error("Error in fetchNASAData:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNASAData();

    // Set up refresh interval (e.g., every 30 minutes)
    const interval = setInterval(fetchNASAData, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [location.lat, location.lon]);

  return {
    soilMoisture,
    vegetation,
    temperature,
    historicalData,
    isLoading,
    error,
    lastUpdated,
  };
};

// Generate more realistic simulated data based on location
const generateSimulatedData = (location: Location): FarmData => {
  const { lat, lon } = location;
  
  // Base values with geographic variations
  const baseTemp = 20 + (lat / 90) * 15; // Warmer near equator
  const tempVariation = (Math.sin(Date.now() / 86400000) * 5); // Daily variation
  
  // More realistic data generation
  const simulatedData = {
    soilMoisture: Math.max(10, Math.min(95, 40 + (Math.random() * 40) + (lat / 90) * 10)),
    vegetation: Math.max(0.1, Math.min(0.9, 0.3 + (Math.random() * 0.5) + (Math.abs(lat) / 90) * 0.2)),
    temperature: Math.max(-10, Math.min(45, baseTemp + tempVariation + (Math.random() * 6 - 3))),
    timestamp: new Date(),
  };

  return simulatedData;
};

// Generate realistic historical data
const generateHistoricalData = (location: Location): HistoricalDataPoint[] => {
  const now = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
    const dayProgress = i / 29; // 0 to 1 over the 30 days
    
    // Simulate seasonal trends
    const seasonalTemp = 15 + Math.sin(dayProgress * Math.PI * 2) * 10;
    const seasonalMoisture = 50 + Math.cos(dayProgress * Math.PI * 2) * 20;
    const seasonalVegetation = 0.3 + Math.sin(dayProgress * Math.PI) * 0.4;
    
    return {
      date,
      soilMoisture: Math.max(15, Math.min(85, seasonalMoisture + (Math.random() * 10 - 5))),
      vegetation: Math.max(0.1, Math.min(0.9, seasonalVegetation + (Math.random() * 0.1 - 0.05))),
      temperature: Math.max(-5, Math.min(35, seasonalTemp + (Math.random() * 4 - 2))),
      timestamp: date,
    };
  });
};

// Attempt to fetch real NASA data
const fetchRealNASAData = async (lat: number, lon: number): Promise<FarmData> => {
  // Try multiple NASA APIs in parallel
  const [powerData, modisData] = await Promise.allSettled([
    fetchPOWERData(lat, lon),
    fetchMODISData(lat, lon, NASA_API_KEY),
  ]);

  const farmData: FarmData = {
    soilMoisture: 50, // Default fallback
    vegetation: 0.5,  // Default fallback
    temperature: 20,  // Default fallback
    timestamp: new Date(),
  };

  // Use POWER API data for temperature
  if (powerData.status === 'fulfilled' && powerData.value) {
    farmData.temperature = powerData.value.temperature;
  }

  // Use MODIS data for vegetation
  if (modisData.status === 'fulfilled' && modisData.value) {
    farmData.vegetation = modisData.value;
  }

  // Try to get soil moisture separately
  try {
    const smapData = await fetchSMAPData(lat, lon, NASA_API_KEY);
    if (smapData) {
      farmData.soilMoisture = smapData;
    }
  } catch (error) {
    console.warn("SMAP data unavailable, using simulated soil moisture");
    farmData.soilMoisture = generateSimulatedData({ lat, lon }).soilMoisture;
  }

  return farmData;
};

// Enhanced NASA API integration functions
export const fetchSMAPData = async (lat: number, lon: number, apiKey: string): Promise<number> => {
  try {
    // Example SMAP API call structure
    const response = await fetch(
      `https://appeears.earthdatacloud.nasa.gov/api/task?lat=${lat}&lon=${lon}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`SMAP API error: ${response.statusText}`);
    }

    const data = await response.json();
    // Extract soil moisture value from response
    // This would need to be adapted based on actual API response format
    return data?.soil_moisture?.[0]?.value || generateSimulatedData({ lat, lon }).soilMoisture;
    
  } catch (error) {
    console.error('Error fetching SMAP data:', error);
    throw error;
  }
};

export const fetchMODISData = async (lat: number, lon: number, apiKey: string): Promise<number> => {
  try {
    // MODIS NDVI endpoint example
    const response = await fetch(
      `https://modis.earthdata.nasa.gov/api/v2/ndvi?lat=${lat}&lon=${lon}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`MODIS API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data?.ndvi?.[0]?.value || generateSimulatedData({ lat, lon }).vegetation;
    
  } catch (error) {
    console.error('Error fetching MODIS data:', error);
    throw error;
  }
};

export const fetchPOWERData = async (lat: number, lon: number): Promise<{ temperature: number }> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M&community=AG&longitude=${lon}&latitude=${lat}&start=2024&end=2024&format=JSON`
    );

    if (!response.ok) {
      throw new Error(`POWER API error: ${response.statusText}`);
    }

    const data = await response.json();
    // Extract latest temperature
    const tempData = data?.properties?.parameter?.T2M;
    const latestTemp = tempData ? Object.values(tempData)[0] as number : null;
    
    return {
      temperature: latestTemp || generateSimulatedData({ lat, lon }).temperature,
    };
    
  } catch (error) {
    console.error('Error fetching POWER data:', error);
    throw error;
  }
};

// Utility function to validate NASA API key
export const validateNASAKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch('https://appeears.earthdatacloud.nasa.gov/api/status', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
};