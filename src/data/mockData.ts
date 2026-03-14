import { Station, SensorReading, FloodPrediction, Alert, RegisteredUser, RiskLevel } from '@/types';

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

export const stations: Station[] = [
  { id: 's1', name: 'Tana Bridge', river: 'Tana', lat: -0.45, lng: 39.65, warningLevel: 4.5, criticalLevel: 6.0, status: 'online', riskLevel: 'green' },
  { id: 's2', name: 'Athi Falls', river: 'Athi', lat: -1.45, lng: 37.05, warningLevel: 3.8, criticalLevel: 5.2, status: 'online', riskLevel: 'yellow' },
  { id: 's3', name: 'Nyando Gauge', river: 'Nyando', lat: -0.15, lng: 35.0, warningLevel: 3.2, criticalLevel: 4.8, status: 'online', riskLevel: 'orange' },
  { id: 's4', name: 'Nzoia Delta', river: 'Nzoia', lat: 0.1, lng: 34.05, warningLevel: 5.0, criticalLevel: 7.0, status: 'online', riskLevel: 'red' },
  { id: 's5', name: 'Ewaso Bridge', river: 'Ewaso Nyiro', lat: 0.5, lng: 37.45, warningLevel: 2.5, criticalLevel: 3.8, status: 'online', riskLevel: 'green' },
  { id: 's6', name: 'Sabaki Station', river: 'Sabaki', lat: -3.15, lng: 40.1, warningLevel: 4.0, criticalLevel: 5.5, status: 'maintenance', riskLevel: 'green' },
  { id: 's7', name: 'Mara Crossing', river: 'Mara', lat: -1.5, lng: 35.0, warningLevel: 3.5, criticalLevel: 5.0, status: 'online', riskLevel: 'yellow' },
  { id: 's8', name: 'Turkwel Dam', river: 'Turkwel', lat: 1.9, lng: 35.35, warningLevel: 6.0, criticalLevel: 8.5, status: 'online', riskLevel: 'green' },
  { id: 's9', name: 'Yala Wetland', river: 'Yala', lat: 0.05, lng: 34.15, warningLevel: 2.8, criticalLevel: 4.0, status: 'online', riskLevel: 'orange' },
  { id: 's10', name: 'Kerio Valley', river: 'Kerio', lat: 0.7, lng: 35.65, warningLevel: 3.0, criticalLevel: 4.5, status: 'offline', riskLevel: 'green' },
];

function generateReading(station: Station, hoursAgo: number = 0): SensorReading {
  const riskMultipliers: Record<RiskLevel, number> = { green: 0.4, yellow: 0.7, orange: 0.85, red: 1.05 };
  const m = riskMultipliers[station.riskLevel];
  const waterLevel = +(station.criticalLevel * m * randomBetween(0.85, 1.15)).toFixed(2);
  return {
    id: `r-${station.id}-${hoursAgo}`,
    stationId: station.id,
    timestamp: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
    waterLevel: Math.max(0, waterLevel),
    rainfall: +(randomBetween(0, 60) * m).toFixed(1),
    soilMoisture: +(randomBetween(30, 95) * Math.min(m + 0.2, 1)).toFixed(1),
    battery: +(randomBetween(60, 100)).toFixed(0) as unknown as number,
    rateOfRise: +(randomBetween(-0.1, 0.6) * m).toFixed(3),
  };
}

// Add latest readings to stations
stations.forEach(s => { s.latestReading = generateReading(s); });

export function getHistoricalReadings(stationId: string, hours: number = 72): SensorReading[] {
  const station = stations.find(s => s.id === stationId);
  if (!station) return [];
  return Array.from({ length: hours }, (_, i) => generateReading(station, hours - i));
}

export function getPrediction(stationId: string): FloodPrediction {
  const station = stations.find(s => s.id === stationId);
  const riskProbs: Record<RiskLevel, number> = { green: 0.1, yellow: 0.35, orange: 0.6, red: 0.85 };
  const base = riskProbs[station?.riskLevel || 'green'];
  return {
    stationId,
    timestamp: new Date().toISOString(),
    prob6h: +(base * randomBetween(0.9, 1.1)).toFixed(2),
    prob12h: +(base * randomBetween(1.0, 1.3)).toFixed(2),
    prob24h: +(base * randomBetween(1.1, 1.5)).toFixed(2),
    peakLevel: +((station?.criticalLevel || 5) * base * 1.2).toFixed(2),
    riskLevel: station?.riskLevel || 'green',
    confidence: +(randomBetween(0.7, 0.95)).toFixed(2),
  };
}

export const recentAlerts: Alert[] = [
  { id: 'a1', stationId: 's4', riskLevel: 'red', message: 'CRITICAL: Nzoia River exceeding critical levels. Immediate evacuation recommended for low-lying areas.', affectedArea: 'Budalangi, Busia County', sentAt: new Date(Date.now() - 3600000).toISOString(), recipientCount: 2340 },
  { id: 'a2', stationId: 's3', riskLevel: 'orange', message: 'WARNING: Nyando River rising rapidly. Prepare for possible flooding in next 6 hours.', affectedArea: 'Ahero, Kisumu County', sentAt: new Date(Date.now() - 7200000).toISOString(), recipientCount: 1560 },
  { id: 'a3', stationId: 's9', riskLevel: 'orange', message: 'WARNING: Yala Wetland water levels approaching warning threshold.', affectedArea: 'Yala, Siaya County', sentAt: new Date(Date.now() - 14400000).toISOString(), recipientCount: 890 },
  { id: 'a4', stationId: 's2', riskLevel: 'yellow', message: 'WATCH: Athi River levels elevated. Monitor conditions.', affectedArea: 'Athi River Town', sentAt: new Date(Date.now() - 28800000).toISOString(), recipientCount: 1200 },
];

export const registeredUsers: RegisteredUser[] = [
  { id: 'u1', phone: '+254712345678', location: { lat: 0.1, lng: 34.1 }, language: 'en', verified: true, subscribedStations: ['s4', 's9'], createdAt: '2024-01-15T10:00:00Z' },
  { id: 'u2', phone: '+254723456789', location: { lat: -0.15, lng: 35.05 }, language: 'sw', verified: true, subscribedStations: ['s3', 's7'], createdAt: '2024-02-20T14:30:00Z' },
  { id: 'u3', phone: '+254734567890', location: { lat: -1.45, lng: 37.1 }, language: 'en', verified: false, subscribedStations: ['s2'], createdAt: '2024-03-01T08:00:00Z' },
];
