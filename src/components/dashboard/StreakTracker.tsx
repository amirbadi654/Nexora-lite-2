import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';

const days = [
  { day: 1, xp: 10, completed: true },
  { day: 2, xp: 20, completed: true },
  { day: 3, xp: 30, completed: true, current: true },
  { day: 4, xp: 40, completed: false },
  { day: 5, xp: 50, completed: false },
];

const StreakTracker: React.FC = () => {
  return (
    <div className="bg-card rounded-xl p-5 lg:p-6 border border-secondary-layer/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-text-primary">Daily Streak Progress</h2>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Flame size={18} className="text-orange-500" />
          <span>3 days</span>
        </div>
      </div>

      {/* Day Circles */}
      <div className="flex items-center justify-between gap-2 lg:gap-4 mb-6">
        {days.map((day) => (
          <div key={day.day} className="flex-1 flex flex-col items-center">
            <div
              className={`relative w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mb-2 ${
                day.completed
                  ? 'bg-brand-purple'
                  : 'bg-secondary-layer'
              } ${day.current ? 'animate-pulse ring-2 ring-interactive-cyan ring-offset-2 ring-offset-card' : ''}`}
            >
              {day.completed ? (
                <span className="text-white font-bold text-lg">+{day.xp}</span>
              ) : (
                <span className="text-text-secondary font-medium">Day {day.day}</span>
              )}
              {day.current && (
                <div className="absolute -bottom-5 text-xs text-interactive-cyan font-medium">
                  Current
                </div>
              )}
            </div>
            <span className="text-xs text-text-secondary mt-1">+{day.xp} XP</span>
          </div>
        ))}
      </div>

      {/* Bonus Message */}
      <div className="flex items-center justify-center gap-2 py-3 bg-secondary-layer rounded-lg">
        <ArrowRight size={16} className="text-gold" />
        <span className="text-sm text-text-primary font-medium">
          Complete all 5 days
        </span>
        <span className="text-sm text-gold font-bold">→ 150 XP Bonus</span>
      </div>
    </div>
  );
};

export default StreakTracker;
