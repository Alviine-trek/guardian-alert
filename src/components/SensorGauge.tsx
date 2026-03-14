interface SensorGaugeProps {
  value: number;
  max: number;
  warningLevel: number;
  criticalLevel: number;
  label: string;
  unit: string;
}

export function SensorGauge({ value, max, warningLevel, criticalLevel, label, unit }: SensorGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const warningPct = (warningLevel / max) * 100;
  const criticalPct = (criticalLevel / max) * 100;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (value >= criticalLevel) return 'hsl(0, 84%, 50%)';
    if (value >= warningLevel) return 'hsl(25, 95%, 53%)';
    if (value >= warningLevel * 0.8) return 'hsl(45, 93%, 47%)';
    return 'hsl(142, 71%, 45%)';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="-rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--gauge-bg))" strokeWidth="8" />
          {/* Warning threshold marker */}
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke="hsl(var(--risk-yellow))" strokeWidth="1" strokeDasharray={`2 ${circumference - 2}`}
            strokeDashoffset={circumference - (warningPct / 100) * circumference}
            opacity={0.5}
          />
          {/* Critical threshold marker */}
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke="hsl(var(--risk-red))" strokeWidth="1" strokeDasharray={`2 ${circumference - 2}`}
            strokeDashoffset={circumference - (criticalPct / 100) * circumference}
            opacity={0.5}
          />
          {/* Value arc */}
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={getColor()} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="animate-gauge-fill transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-foreground">{value.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
