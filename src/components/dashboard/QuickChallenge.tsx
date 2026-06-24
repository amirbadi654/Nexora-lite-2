import React from 'react';
import { Brain, Trophy, Cpu, Play } from 'lucide-react';

const challenges = [
  {
    id: 1,
    title: 'General Knowledge',
    icon: Brain,
    levels: 'All Levels',
    hasBadge: false,
    bgColor: 'rgba(56, 189, 248, 0.2)',
    iconColor: '#38BDF8',
  },
  {
    id: 2,
    title: 'Football',
    icon: Trophy,
    levels: 'All Levels',
    hasBadge: false,
    bgColor: 'rgba(16, 185, 129, 0.2)',
    iconColor: '#10B981',
  },
  {
    id: 3,
    title: 'AI & Technology',
    icon: Cpu,
    levels: 'Higher XP Rewards',
    hasBadge: true,
    badgeText: 'BEST XP',
    bgColor: 'rgba(139, 92, 246, 0.2)',
    iconColor: '#8B5CF6',
  },
];

const QuickChallenge: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl lg:text-2xl font-bold text-text-primary mb-4">Start a Challenge</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="relative bg-card rounded-xl p-5 border border-secondary-layer/50 hover:border-brand-purple/30 transition-all duration-200 group"
          >
            {/* Badge */}
            {challenge.hasBadge && (
              <div className="absolute -top-2 -right-2 px-2 py-1 bg-gold rounded-full text-xs font-bold text-bg-primary">
                {challenge.badgeText}
              </div>
            )}

            {/* Icon */}
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: challenge.bgColor }}
            >
              <challenge.icon size={24} style={{ color: challenge.iconColor }} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-text-primary mb-1">{challenge.title}</h3>

            {/* Levels */}
            <p className="text-sm text-text-secondary mb-4">{challenge.levels}</p>

            {/* Play Button */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-purple hover:bg-brand-purple/80 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02]">
              <Play size={16} fill="currentColor" />
              <span>Play Now</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickChallenge;
