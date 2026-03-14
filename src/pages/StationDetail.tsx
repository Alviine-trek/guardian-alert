import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { t } from '@/utils/i18n';
import { stations, getHistoricalReadings, getPrediction } from '@/data/mockData';
import { RiskBadge } from '@/components/RiskBadge';
import { SensorGauge } from '@/components/SensorGauge';
import { ArrowLeft, Wifi, WifiOff, Wrench, BatteryMedium } from 'lucide-react';
import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend,
} from 'recharts';

export default function StationDetail() {
  const { id } = useParams<{ id: string }>();
  const { language } = useAppStore();
  const station = stations.find(s => s.id === id);

  const historicalData = useMemo(() => {
    if (!id) return [];
    return getHistoricalReadings(id, 48).map(r => ({
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      waterLevel: r.waterLevel,
      rainfall: r.rainfall,
      soilMoisture: r.soilMoisture,
    }));
  }, [id]);

  const prediction = useMemo(() => id ? getPrediction(id) : null, [id]);

  if (!station) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Station not found</p>
        <Link to="/" className="mt-4 inline-block text-primary underline">Back to Dashboard</Link>
      </div>
    );
  }

  const reading = station.latestReading!;
  const statusIcon = station.status === 'online' ? <Wifi className="h-4 w-4 text-risk-green" /> :
    station.status === 'maintenance' ? <Wrench className="h-4 w-4 text-risk-yellow" /> :
    <WifiOff className="h-4 w-4 text-risk-red" />;

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center gap-3">
        <Link to="/" className="rounded-md border p-2 transition-colors hover:bg-muted">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{station.name}</h1>
            <RiskBadge risk={station.riskLevel} pulse />
          </div>
          <p className="text-sm text-muted-foreground">{station.river} River · {station.lat.toFixed(3)}, {station.lng.toFixed(3)}</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {statusIcon}
          <span className="capitalize">{station.status}</span>
          <BatteryMedium className="ml-2 h-4 w-4" />
          <span>{reading.battery}%</span>
        </div>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-panel">
          <SensorGauge value={reading.waterLevel} max={station.criticalLevel * 1.3} warningLevel={station.warningLevel} criticalLevel={station.criticalLevel} label={t('station.waterLevel', language)} unit={t('unit.meters', language)} />
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-panel">
          <SensorGauge value={reading.rainfall} max={80} warningLevel={30} criticalLevel={50} label={t('station.rainfall', language)} unit={t('unit.mmhr', language)} />
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-panel">
          <SensorGauge value={reading.soilMoisture} max={100} warningLevel={70} criticalLevel={90} label={t('station.soilMoisture', language)} unit={t('unit.percent', language)} />
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-panel">
          <SensorGauge value={Math.abs(reading.rateOfRise)} max={1} warningLevel={0.3} criticalLevel={0.5} label={t('station.rateOfRise', language)} unit={t('unit.mhr', language)} />
        </div>
      </div>

      {/* AI Predictions */}
      {prediction && (
        <div className="rounded-lg border bg-card p-5 shadow-panel">
          <h2 className="mb-4 text-lg font-semibold text-foreground">{t('station.predictions', language)}</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: t('station.prob6h', language), value: prediction.prob6h },
              { label: t('station.prob12h', language), value: prediction.prob12h },
              { label: t('station.prob24h', language), value: prediction.prob24h },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className={`mt-1 text-3xl font-bold ${value > 0.7 ? 'text-risk-red' : value > 0.4 ? 'text-risk-orange' : value > 0.2 ? 'text-risk-yellow' : 'text-risk-green'}`}>
                  {(value * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">flood probability</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Predicted peak: {prediction.peakLevel.toFixed(2)}m</span>
            <span>Model confidence: {(prediction.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-5 shadow-panel">
          <h3 className="mb-3 text-sm font-semibold text-foreground">{t('station.waterLevel', language)} (48h)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={5} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <ReTooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} />
              <defs>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="waterLevel" stroke="hsl(200, 80%, 50%)" fill="url(#waterGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-5 shadow-panel">
          <h3 className="mb-3 text-sm font-semibold text-foreground">{t('station.rainfall', language)} (48h)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={5} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <ReTooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} />
              <Bar dataKey="rainfall" fill="hsl(215, 70%, 55%)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
