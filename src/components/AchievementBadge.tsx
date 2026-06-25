import React from 'react';
import { Crown, Shield, Medal, Star, Flame, Zap, Award, CheckCircle2 } from 'lucide-react';
import { RankName } from '../context/GameContext';

export const RankBadge: React.FC<{ rank: RankName; size?: 'sm' | 'md' | 'lg' }> = ({ rank, size = 'md' }) => {
  const colors: Record<RankName, string> = {
    Beginner: '#64748B', Bronze: '#B87333', Silver: '#C0C0C0', Gold: '#FBBF24',
  };
  const color = colors[rank];
  const dims = { sm: 32, md: 44, lg: 64 }[size];
  const iconSize = { sm: 16, md: 22, lg: 32 }[size];
  const Icon = rank === 'Gold' ? Crown : rank === 'Silver' ? Shield : rank === 'Bronze' ? Medal : Star;
  return (
    <div className="flex items-center justify-center rounded-full" style={{ width: dims, height: dims, background: `${color}22`, border: `2px solid ${color}` }}>
      <Icon size={iconSize} style={{ color }} fill={rank === 'Gold' ? 'currentColor' : 'none'} />
    </div>
  );
};

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: 'first_login', name: 'First Login', description: 'Connect your wallet for the first time.', icon: <Zap size={24} /> },
  { id: 'first_correct', name: 'First Correct Answer', description: 'Answer a question correctly.', icon: <CheckCircle2 size={24} /> },
  { id: 'level_5', name: 'Reach Level 5', description: 'Accumulate 500 XP to reach Level 5.', icon: <Star size={24} /> },
  { id: 'rank_bronze', name: 'Reach Bronze', description: 'Achieve a Bronze rank score.', icon: <Medal size={24} /> },
  { id: 'rank_silver', name: 'Reach Silver', description: 'Achieve a Silver rank score.', icon: <Shield size={24} /> },
  { id: 'rank_gold', name: 'Reach Gold', description: 'Achieve a Gold rank score.', icon: <Crown size={24} /> },
  { id: 'streak_5', name: '5-Day Streak', description: 'Complete a full 5-day streak cycle.', icon: <Flame size={24} /> },
  { id: 'buy_premium', name: 'Premium Member', description: 'Purchase the Premium Pass.', icon: <Award size={24} /> },
];

export const AchievementCard: React.FC<{ def: AchievementDef; unlocked: boolean }> = ({ def, unlocked }) => (
  <div className="rounded-xl p-4 transition-all" style={{ background: '#1E293B', border: unlocked ? '2px solid #FBBF24' : '2px solid transparent', opacity: unlocked ? 1 : 0.4, filter: unlocked ? 'none' : 'grayscale(1)' }}>
    <div className="flex items-center justify-between mb-3">
      <div className={unlocked ? 'text-gold' : 'text-text-secondary'}>{def.icon}</div>
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: unlocked ? '#FBBF2422' : '#273449', color: unlocked ? '#FBBF24' : '#A8B3C7' }}>
        {unlocked ? 'UNLOCKED' : 'LOCKED'}
      </span>
    </div>
    <h4 className="text-sm font-bold text-text-primary mb-1">{def.name}</h4>
    <p className="text-xs text-text-secondary leading-relaxed">{def.description}</p>
  </div>
);
