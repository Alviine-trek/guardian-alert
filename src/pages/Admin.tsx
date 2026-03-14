import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { t } from '@/utils/i18n';
import { stations as allStations, registeredUsers, recentAlerts } from '@/data/mockData';
import { RiskBadge } from '@/components/RiskBadge';
import { AlertCard } from '@/components/AlertCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Radio, Users, Bell, Activity, Plus, Pencil, Trash2, Send, CheckCircle, XCircle } from 'lucide-react';

export default function Admin() {
  const { language } = useAppStore();
  const [manualMessage, setManualMessage] = useState('');
  const [manualRisk, setManualRisk] = useState<'yellow' | 'orange' | 'red'>('yellow');

  const sendManualAlert = () => {
    if (!manualMessage.trim()) {
      toast.error('Please enter an alert message');
      return;
    }
    toast.success(`Manual ${manualRisk} alert sent to registered users`);
    setManualMessage('');
  };

  const onlineCount = allStations.filter(s => s.status === 'online').length;
  const offlineCount = allStations.filter(s => s.status === 'offline').length;

  return (
    <div className="container space-y-6 py-6">
      <h1 className="text-2xl font-bold text-foreground">{t('admin.title', language)}</h1>

      {/* System Health */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-panel">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Radio className="h-4 w-4" /> Stations Online</div>
          <p className="mt-1 text-2xl font-bold text-risk-green">{onlineCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-panel">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><XCircle className="h-4 w-4" /> Offline</div>
          <p className="mt-1 text-2xl font-bold text-risk-red">{offlineCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-panel">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4" /> Registered Users</div>
          <p className="mt-1 text-2xl font-bold text-foreground">{registeredUsers.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-panel">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Bell className="h-4 w-4" /> Alerts Sent (24h)</div>
          <p className="mt-1 text-2xl font-bold text-foreground">{recentAlerts.length}</p>
        </div>
      </div>

      <Tabs defaultValue="stations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stations">{t('admin.stations', language)}</TabsTrigger>
          <TabsTrigger value="users">{t('admin.users', language)}</TabsTrigger>
          <TabsTrigger value="alerts">{t('admin.alerts', language)}</TabsTrigger>
          <TabsTrigger value="manual">Send Alert</TabsTrigger>
        </TabsList>

        <TabsContent value="stations" className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Add Station</Button>
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">River</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Risk</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Warning / Critical</th>
                  <th className="px-4 py-2 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {allStations.map(s => (
                  <tr key={s.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.river}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${s.status === 'online' ? 'text-risk-green' : s.status === 'maintenance' ? 'text-risk-yellow' : 'text-risk-red'}`}>
                        {s.status === 'online' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3"><RiskBadge risk={s.riskLevel} size="sm" /></td>
                    <td className="px-4 py-3 text-muted-foreground">{s.warningLevel}m / {s.criticalLevel}m</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Phone</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Language</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Verified</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Stations</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {registeredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-foreground">{u.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground uppercase">{u.language}</td>
                    <td className="px-4 py-3">
                      {u.verified ? <CheckCircle className="h-4 w-4 text-risk-green" /> : <XCircle className="h-4 w-4 text-risk-red" />}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.subscribedStations.length}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-3">
          {recentAlerts.map(a => <AlertCard key={a.id} alert={a} />)}
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <div className="rounded-lg border bg-card p-5 shadow-panel">
            <h3 className="mb-4 font-semibold text-foreground">Send Manual Alert</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                {(['yellow', 'orange', 'red'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setManualRisk(r)}
                    className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                      manualRisk === r ? 'border-primary bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <RiskBadge risk={r} size="sm" />
                  </button>
                ))}
              </div>
              <Input
                placeholder="Alert message..."
                value={manualMessage}
                onChange={e => setManualMessage(e.target.value)}
              />
              <Button onClick={sendManualAlert} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Alert to All Users
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
