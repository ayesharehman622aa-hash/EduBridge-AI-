import React from 'react';
import { WifiOff, HardDrive } from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../lib/TranslationContext';

interface OfflineBannerProps {
  isOnline: boolean;
  language: Language;
  onOpenOfflinePack?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline, onOpenOfflinePack }) => {
  const { t } = useTranslation();

  if (isOnline) return null;

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2.5 shadow-sm border-b border-amber-600/40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-slate-900 shrink-0 animate-bounce" />
          <span>{t.offlineBanner.message}</span>
        </div>
        {onOpenOfflinePack && (
          <button
            onClick={onOpenOfflinePack}
            className="shrink-0 bg-slate-900 text-amber-300 hover:bg-slate-800 px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>{t.offlineBanner.viewOfflineBank}</span>
          </button>
        )}
      </div>
    </div>
  );
};
