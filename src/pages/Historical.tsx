import { useMemo, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { t } from '@/utils/i18n';
import { stations, getHistoricalReadings } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts';

export default function Historical() {
  const { language } = useAppStore();
  const [selectedStation, setSelectedStation] = useState(stations[0].id);
  const [hours, setHours] = useState(72);

  const data = useMemo(() => {
    return getHistoricalReadings(selectedStation, hours).map(r => ({
      time: new Date(r.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit' }),
      waterLevel: r.waterLevel,
      rainfall: r.rainfall,
      soilMoisture: r.soilMoisture,
    }));
  }, [selectedStation, hours]);

  const station = stations.find(s => s.id === selectedStation);

  const exportData = () => {
    const csv = [
      'Time,Water Level (m),Rainfall (mm/hr),Soil Moisture (%)',
      ...data.map(d => `${d.time},${d.waterLevel},${d.rainfall},${d.soilMoisture}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${station?.name || 'data'}_${hours}h.csv`;
    a.click();
    toast.success('Data exported successfully');
  };

  return (
    <div className="container space-y-6 py-6">
      <h1 className="text-2xl font-bold text-foreground">{t('historical.title', language)}</h1>

      <div className="flex flex-wrap items-end gap-4 rounded-lg border bg-card p-4 shadow-panel">
        <div className="space-y-1">
          <Label className="text-xs">{t('historical.station', language)}</Label>
          <select
            value={selectedStation}
            onChange={e => setSelectedStation(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm text-foreground"
          >
            {stations.map(s => <option key={s.id} value={s.id}>{s.name} ({s.river})</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">{t('historical.dateRange', language)}</Label>
          <div className="flex gap-1">
            {[24, 48, 72, 168].map(h => (
              <button
                key={h}
                onClick={() => setHours(h)}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  hours === h ? 'border-primary bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={exportData}>
          <Download className="mr-1 h-4 w-4" />
          {t('historical.export', language)}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-5 shadow-panel">
          <h3 className="mb-3 text-sm font-semibold text-foreground">{t('station.waterLevel', language)}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={Math.floor(data.length / 8)} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <ReTooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', fontSize: 12 }} />
              <defs>
                <linearGradient id="histWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="waterLevel" stroke="hsl(200, 80%, 50%)" fill="url(#histWater)" strokeWidth={2} name="Water Level (m)" />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-5 shadow-panel">
          <h3 className="mb-3 text-sm font-semibold text-foreground">{t('station.rainfall', language)} & {t('station.soilMoisture', language)}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={Math.floor(data.length / 8)} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <ReTooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', fontSize: 12 }} />
              <Line type="monotone" dataKey="rainfall" stroke="hsl(215, 70%, 55%)" strokeWidth={2} dot={false} name="Rainfall (mm/hr)" />
              <Line type="monotone" dataKey="soilMoisture" stroke="hsl(30, 60%, 50%)" strokeWidth={2} dot={false} name="Soil Moisture (%)" />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
