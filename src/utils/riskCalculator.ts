import { RiskLevel, SensorReading, Station } from '@/types';

export function calculateRiskLevel(
  reading: SensorReading,
  station: Station
): RiskLevel {
  const { waterLevel, rateOfRise, rainfall, soilMoisture } = reading;
  const { warningLevel, criticalLevel } = station;

  let score = 0;

  // Water level contribution (0-40 points)
  const levelRatio = waterLevel / criticalLevel;
  if (levelRatio >= 1) score += 40;
  else if (levelRatio >= warningLevel / criticalLevel) score += 25;
  else if (levelRatio >= 0.6) score += 15;
  else score += 5;

  // Rate of rise (0-25 points)
  if (rateOfRise > 0.5) score += 25;
  else if (rateOfRise > 0.3) score += 18;
  else if (rateOfRise > 0.1) score += 10;
  else score += 3;

  // Rainfall intensity (0-20 points)
  if (rainfall > 50) score += 20;
  else if (rainfall > 30) score += 14;
  else if (rainfall > 10) score += 8;
  else score += 2;

  // Soil saturation (0-15 points)
  if (soilMoisture > 90) score += 15;
  else if (soilMoisture > 70) score += 10;
  else if (soilMoisture > 50) score += 5;
  else score += 1;

  if (score >= 75) return 'red';
  if (score >= 55) return 'orange';
  if (score >= 35) return 'yellow';
  return 'green';
}

export function getRiskColor(risk: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    green: 'hsl(142, 71%, 45%)',
    yellow: 'hsl(45, 93%, 47%)',
    orange: 'hsl(25, 95%, 53%)',
    red: 'hsl(0, 84%, 50%)',
  };
  return colors[risk];
}

export function getRiskLabel(risk: RiskLevel, lang: 'en' | 'sw' = 'en'): string {
  const labels: Record<string, Record<RiskLevel, string>> = {
    en: { green: 'Normal', yellow: 'Watch', orange: 'Warning', red: 'Critical' },
    sw: { green: 'Kawaida', yellow: 'Angalia', orange: 'Onyo', red: 'Hatari' },
  };
  return labels[lang]?.[risk] || labels.en[risk];
}

export function getRiskTailwindClass(risk: RiskLevel): string {
  return {
    green: 'bg-risk-green',
    yellow: 'bg-risk-yellow',
    orange: 'bg-risk-orange',
    red: 'bg-risk-red',
  }[risk];
}

export function getRiskTextClass(risk: RiskLevel): string {
  return {
    green: 'text-risk-green',
    yellow: 'text-risk-yellow',
    orange: 'text-risk-orange',
    red: 'text-risk-red',
  }[risk];
}
