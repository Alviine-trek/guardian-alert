import { useAppStore } from '@/store/appStore';
import { t } from '@/utils/i18n';
import { recentAlerts } from '@/data/mockData';
import { AlertCard } from '@/components/AlertCard';

export default function Alerts() {
  const { language } = useAppStore();

  return (
    <div className="container max-w-2xl space-y-6 py-6">
      <h1 className="text-2xl font-bold text-foreground">{t('nav.alerts', language)}</h1>
      <div className="space-y-3">
        {recentAlerts.map(a => <AlertCard key={a.id} alert={a} />)}
      </div>
    </div>
  );
}
