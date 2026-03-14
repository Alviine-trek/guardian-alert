import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { t } from '@/utils/i18n';
import { Map, Radio, UserPlus, Shield, BarChart3, Bell, Globe } from 'lucide-react';

export function AppHeader() {
  const { language, setLanguage } = useAppStore();
  const location = useLocation();

  const links = [
    { to: '/', icon: Map, label: t('nav.dashboard', language) },
    { to: '/register', icon: UserPlus, label: t('nav.register', language) },
    { to: '/historical', icon: BarChart3, label: t('nav.historical', language) },
    { to: '/alerts', icon: Bell, label: t('nav.alerts', language) },
    { to: '/admin', icon: Shield, label: t('nav.admin', language) },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Radio className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="hidden font-bold text-foreground sm:inline">FloodWatch AI</span>
        </Link>

        <nav className="flex flex-1 items-center gap-1">
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                location.pathname === to
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden md:inline">{label}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
          className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Globe className="h-3.5 w-3.5" />
          {language === 'en' ? 'SW' : 'EN'}
        </button>
      </div>
    </header>
  );
}
