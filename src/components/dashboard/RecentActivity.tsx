import React from 'react';
import { CheckCircle, Trophy, Flame, Star, Target } from 'lucide-react';

const activities = [
  {
    id: 1,
    icon: CheckCircle,
    text: 'Answered AI Challenge (Hard)',
    xp: '+60 XP',
    time: '2h ago',
    bgColor: 'rgba(16, 185, 129, 0.2)',
    iconColor: '#10B981',
  },
  {
    id: 2,
    icon: Trophy,
    text: 'Reached Silver Rank',
    xp: '',
    time: '1d ago',
    bgColor: 'rgba(192, 192, 192, 0.2)',
    iconColor: '#C0C0C0',
  },
  {
    id: 3,
    icon: Flame,
    text: 'Day 3 Streak Bonus',
    xp: '+30 XP',
    time: '1d ago',
    bgColor: 'rgba(249, 115, 22, 0.2)',
    iconColor: '#F97316',
  },
  {
    id: 4,
    icon: Target,
    text: 'Completed Football Quiz',
    xp: '+45 XP',
    time: '2d ago',
    bgColor: 'rgba(16, 185, 129, 0.2)',
    iconColor: '#10B981',
  },
  {
    id: 5,
    icon: Star,
    text: 'Earned Achievement: Quick Learner',
    xp: '+100 XP',
    time: '3d ago',
    bgColor: 'rgba(251, 191, 36, 0.2)',
    iconColor: '#FBBF24',
  },
];

const RecentActivity: React.FC = () => {
  return (
    <div className="bg-card rounded-xl border border-secondary-layer/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-secondary-layer/50">
        <h2 className="text-xl font-bold text-text-primary">Recent Activity</h2>
      </div>

      <div className="divide-y divide-secondary-layer/50">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 px-5 py-4 hover:bg-secondary-layer/30 transition-colors"
          >
            {/* Icon */}
            <div
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: activity.bgColor }}
            >
              <activity.icon size={20} style={{ color: activity.iconColor }} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-text-primary font-medium truncate">{activity.text}</p>
            </div>

            {/* XP */}
            {activity.xp && (
              <div className="flex-shrink-0 text-sm font-semibold text-gold">
                {activity.xp}
              </div>
            )}

            {/* Time */}
            <div className="flex-shrink-0 text-sm text-text-secondary">{activity.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
