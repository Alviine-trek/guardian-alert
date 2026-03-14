export type RiskLevel = 'green' | 'yellow' | 'orange' | 'red';

export interface Station {
  id: string;
  name: string;
  river: string;
  lat: number;
  lng: number;
  warningLevel: number;
  criticalLevel: number;
  status: 'online' | 'offline' | 'maintenance';
  latestReading?: SensorReading;
  riskLevel: RiskLevel;
}

export interface SensorReading {
  id: string;
  stationId: string;
  timestamp: string;
  waterLevel: number;
  rainfall: number;
  soilMoisture: number;
  battery: number;
  rateOfRise: number;
}

export interface FloodPrediction {
  stationId: string;
  timestamp: string;
  prob6h: number;
  prob12h: number;
  prob24h: number;
  peakLevel: number;
  riskLevel: RiskLevel;
  confidence: number;
}

export interface Alert {
  id: string;
  stationId: string;
  riskLevel: RiskLevel;
  message: string;
  affectedArea: string;
  sentAt: string;
  recipientCount: number;
}

export interface RegisteredUser {
  id: string;
  phone: string;
  location: { lat: number; lng: number };
  language: 'en' | 'sw';
  verified: boolean;
  subscribedStations: string[];
  createdAt: string;
}

export type Language = 'en' | 'sw';
