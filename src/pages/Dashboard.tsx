import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { t } from '@/utils/i18n';
import { getRiskColor, getRiskLabel } from '@/utils/riskCalculator';
import { recentAlerts } from '@/data/mockData';
import { RiskBadge } from '@/components/RiskBadge';
import { AlertCard } from '@/components/AlertCard';
import { Droplets, CloudRain, TreePine, Activity } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function Dashboard() {
  const { stations, language } = useAppStore();
  const [, setTick] = useState(0);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const riskCounts = { green: 0, yellow: 0, orange: 0, red: 0 };
  stations.forEach(s => riskCounts[s.riskLevel]++);

  return (
    <div className="container space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('app.title', language)}</h1>
        <p className="text-sm text-muted-foreground">{t('app.subtitle', language)}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(['green', 'yellow', 'orange', 'red'] as const).map(risk => (
          <div key={risk} className="rounded-lg border bg-card p-3 shadow-panel">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{getRiskLabel(risk, language)}</span>
              <RiskBadge risk={risk} size="sm" showLabel={false} />
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground">{riskCounts[risk]}</p>
            <p className="text-xs text-muted-foreground">stations</p>
          </div>
        ))}
      </div>

      {/* Map + Alerts sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg border bg-card shadow-panel">
            <div className="h-[500px]">
              <MapContainer center={[-0.5, 36]} zoom={6} scrollWheelZoom className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {stations.map(station => (
                  <CircleMarker
                    key={station.id}
                    center={[station.lat, station.lng]}
                    radius={station.riskLevel === 'red' ? 12 : station.riskLevel === 'orange' ? 10 : 8}
                    fillColor={getRiskColor(station.riskLevel)}
                    color={getRiskColor(station.riskLevel)}
                    weight={2}
                    opacity={0.9}
                    fillOpacity={0.6}
                  >
                    <Popup>
                      <div className="min-w-[200px] space-y-2 p-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold">{station.name}</h3>
                          <RiskBadge risk={station.riskLevel} size="sm" />
                        </div>
                        <p className="text-xs text-muted-foreground">{station.river} River</p>
                        {station.latestReading && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Droplets className="h-3 w-3 text-water" />
                              {station.latestReading.waterLevel.toFixed(1)}m
                            </div>
                            <div className="flex items-center gap-1">
                              <CloudRain className="h-3 w-3 text-rainfall" />
                              {station.latestReading.rainfall.toFixed(0)}mm/hr
                            </div>
                            <div className="flex items-center gap-1">
                              <TreePine className="h-3 w-3 text-soil" />
                              {station.latestReading.soilMoisture.toFixed(0)}%
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              {station.latestReading.rateOfRise.toFixed(2)}m/hr
                            </div>
                          </div>
                        )}
                        <Link
                          to={`/station/${station.id}`}
                          className="mt-2 block rounded bg-primary px-3 py-1 text-center text-xs font-medium text-primary-foreground"
                        >
                          View Details →
                        </Link>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 border-t px-4 py-2">
              {(['green', 'yellow', 'orange', 'red'] as const).map(r => (
                <div key={r} className="flex items-center gap-1.5 text-xs">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: getRiskColor(r) }} />
                  {getRiskLabel(r, language)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">{t('nav.alerts', language)}</h2>
          {recentAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
}
