import React from 'react';
import { Crown } from 'lucide-react';

interface PremiumBannerProps {
  hasPremium?: boolean;
}

const PremiumBanner: React.FC<PremiumBannerProps> = ({ hasPremium = false }) => {
  if (!hasPremium) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gold/20 via-gold/10 to-gold/5 border border-gold/30 p-4 lg:p-5 mb-6">
      <div className="flex items-center gap-3">
        <Crown size={24} className="text-gold" />
        <span className="text-text-primary font-medium">
          Premium Member — Enhanced Profile & Leaderboard Status
        </span>
      </div>
    </div>
  );
};

export default PremiumBanner;
