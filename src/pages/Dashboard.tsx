import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Award, Flame, Star } from 'lucide-react';
import { useGame, getRankColor, getXPToNextLevel, getLevelProgress } from '../context/GameContext';
import { useWallet } from '../context/WalletContext';

const Dashboard: React.FC = () => {
  const { totalXP, level, rank, streak, isLoading } = useGame();
  const { shortAddress } = useWallet();
  const progress = Math.round(getLevelProgress(totalXP) * 100);
  const xpToNext = getXPToNextLevel(totalXP);
  const rankColor = getRankColor(rank);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary pt-24 pb-8 px-4 flex items-center justify-center">
        <p className="text-text-secondary">Loading your data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary mb-8">Welcome back, {shortAddress}</p>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={20} className="text-brand-purple" />
              <span className="text-text-secondary">Level</span>
            </div>
            <div className="text-3xl font-bold text-text-primary">{level}</div>
            <div className="h-2 bg-secondary-layer rounded-full mt-2 overflow-hidden">
              <div className="h-2 bg-brand-purple rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs text-text-secondary mt-1">{xpToNext} XP to next level</div>
          </div>
          <div className="bg-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Award size={20} style={{ color: rankColor }} />
              <span className="text-text-secondary">Rank</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: rankColor }}>{rank}</div>
          </div>
          <div className="bg-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Flame size={20} className="text-orange-500" />
              <span className="text-text-secondary">Day Streak</span>
            </div>
            <div className="text-3xl font-bold text-orange-500">{streak}</div>
          </div>
          <div className="bg-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Star size={20} className="text-gold" />
              <span className="text-text-secondary">Total XP</span>
            </div>
            <div className="text-3xl font-bold text-gold">{totalXP.toLocaleString()}</div>
          </div>
        </div>

        <Link to="/challenge" className="inline-block px-6 py-3 bg-gradient-brand text-white rounded-xl font-semibold hover:scale-105 transition-transform">
          Start a Challenge
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
