import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { t } from '@/utils/i18n';
import { stations } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Phone, MapPin, Check, Shield } from 'lucide-react';

export default function Register() {
  const { language } = useAppStore();
  const [phone, setPhone] = useState('');
  const [selectedLang, setSelectedLang] = useState<'en' | 'sw'>('en');
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [code, setCode] = useState('');

  const toggleStation = (id: string) => {
    setSelectedStations(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (selectedStations.length === 0) {
      toast.error('Please select at least one station');
      return;
    }
    toast.info('Verification code sent to ' + phone);
    setStep('verify');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }
    toast.success('Registration successful! You will receive flood alerts via SMS.');
    setStep('form');
    setPhone('');
    setCode('');
    setSelectedStations([]);
  };

  return (
    <div className="container max-w-lg space-y-6 py-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Phone className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{t('register.title', language)}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Receive early flood warnings for your area via SMS
        </p>
      </div>

      {step === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-card p-6 shadow-panel">
          <div className="space-y-2">
            <Label>{t('register.phone', language)}</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="+254 7XX XXX XXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('register.language', language)}</Label>
            <div className="flex gap-2">
              {(['en', 'sw'] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setSelectedLang(l)}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                    selectedLang === l
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {l === 'en' ? 'English' : 'Kiswahili'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('register.stations', language)}</Label>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
              {stations.filter(s => s.status !== 'offline').map(station => (
                <label
                  key={station.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors ${
                    selectedStations.includes(station.id) ? 'bg-primary/10' : 'hover:bg-muted'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedStations.includes(station.id)}
                    onChange={() => toggleStation(station.id)}
                    className="rounded border-input accent-primary"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{station.name}</p>
                    <p className="text-xs text-muted-foreground">{station.river} River</p>
                  </div>
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            {t('register.submit', language)}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-5 rounded-lg border bg-card p-6 shadow-panel">
          <div className="text-center">
            <Shield className="mx-auto mb-2 h-8 w-8 text-primary" />
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to <strong>{phone}</strong>
            </p>
          </div>
          <Input
            type="text"
            placeholder="000000"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-2xl tracking-[0.5em]"
            maxLength={6}
          />
          <Button type="submit" className="w-full">
            <Check className="mr-2 h-4 w-4" />
            {t('register.verify', language)}
          </Button>
          <button type="button" onClick={() => setStep('form')} className="w-full text-sm text-muted-foreground underline">
            Back to registration
          </button>
        </form>
      )}
    </div>
  );
}
