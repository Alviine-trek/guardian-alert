import { RiskLevel } from '@/types';
import { getRiskLabel, getRiskTailwindClass } from '@/utils/riskCalculator';
import { useAppStore } from '@/store/appStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface RiskBadgeProps {
  risk: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  pulse?: boolean;
}

export function RiskBadge({ risk, size = 'md', showLabel = true, pulse = false }: RiskBadgeProps) {
  const { language } = useAppStore();
  const label = getRiskLabel(risk, language);
  const bgClass = getRiskTailwindClass(risk);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-semibold text-primary-foreground ${bgClass} ${sizeClasses[size]} ${pulse && (risk === 'red' || risk === 'orange') ? 'animate-pulse-risk' : ''}`}
        >
          <span className="h-2 w-2 rounded-full bg-primary-foreground/40" />
          {showLabel && label}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Risk Level: {label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
