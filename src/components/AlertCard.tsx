import { Alert } from '@/types';
import { RiskBadge } from './RiskBadge';
import { Clock, MapPin, Users } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const timeAgo = getTimeAgo(alert.sentAt);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-panel transition-all hover:shadow-lg">
      <div className="mb-2 flex items-start justify-between">
        <RiskBadge risk={alert.riskLevel} pulse={alert.riskLevel === 'red'} />
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {timeAgo}
        </span>
      </div>
      <p className="mb-3 text-sm text-foreground">{alert.message}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {alert.affectedArea}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {alert.recipientCount.toLocaleString()} notified
        </span>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
