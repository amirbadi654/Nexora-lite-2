import React from 'react';
import { Zap, Award, Flame, Star } from 'lucide-react';

const stats = [
  {
    type: 'level',
    icon: Zap,
    value: '7',
    label: 'Current Level',
    progress: 80,
    progressText: '320 / 400 XP',
    bgColor: 'rgba(139, 92, 246, 0.2)',
    iconColor: '#8B5CF6',
    valueColor: '#E6EDF7',
  },
  {
    type: 'rank',
    icon: Award,
    value: 'Silver',
    label: 'Current Rank',
    rankColor: '#C0C0C0',
    bgColor: 'rgba(192, 192, 192, 0.2)',
    iconColor: '#C0C0C0',
    valueColor: '#C0C0C0',
  },
  {
    type: 'streak',
    icon: Flame,
    value: '3',
    label: 'Day Streak',
    subtitle: 'Keep going!',
    bgColor: 'rgba(249, 115, 22, 0.2)',
    iconColor: '#F97316',
    valueColor: '#F97316',
  },
  {
    type: 'xp',
    icon: Star,
    value: '1,250',
    label: 'Total XP Earned',
    bgColor: 'rgba(251, 191, 36, 0.2)',
    iconColor: '#FBBF24',
    valueColor: '#FBBF24',
  },
];

const StatsRow: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-card rounded-xl p-5 lg:p-6 border border-secondary-layer/50 hover:border-brand-purple/30 transition-all duration-200"
        >
          {/* Icon */}
          <div
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4"
            style={{ backgroundColor: stat.bgColor }}
          >
            <stat.icon size={20} style={{ color: stat.iconColor }} />
          </div>

          {/* Value */}
          <div className="text-3xl lg:text-4xl font-bold mb-1" style={{ color: stat.valueColor }}>
            {stat.value}
          </div>

          {/* Label */}
          <div className="text-sm text-text-secondary mb-2">{stat.label}</div>

          {/* Progress Bar or Subtitle */}
          {stat.type === 'level' && (
            <>
              <div className="h-2 bg-secondary-layer rounded-full overflow-hidden mb-1">
                <div
                  className="h-full bg-brand-purple rounded-full transition-all duration-500"
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
              <div className="text-xs text-text-secondary">{stat.progressText}</div>
            </>
          )}

          {stat.type === 'streak' && (
            <div className="text-xs text-text-primary">{stat.subtitle}</div>
          )}

          {stat.type === 'rank' && (
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stat.rankColor }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
