import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary mb-8">Welcome back, 0x1234...5678</p>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={20} className="text-brand-purple" />
              <span className="text-text-secondary">Level</span>
            </div>
            <div className="text-3xl font-bold text-text-primary">7</div>
            <div className="h-2 bg-secondary-layer rounded-full mt-2">
              <div className="h-2 bg-brand-purple rounded-full w-4/5" />
            </div>
            <div className="text-xs text-text-secondary mt-1">320 / 400 XP</div>
          </div>

          <div className="bg-card rounded-xl p-5">
            <div className="text-text-secondary mb-3">Rank</div>
            <div className="text-2xl font-bold text-gray-400">Silver</div>
          </div>

          <div className="bg-card rounded-xl p-5">
            <div className="text-text-secondary mb-3">Day Streak</div>
            <div className="text-3xl font-bold text-orange-500">3</div>
          </div>

          <div className="bg-card rounded-xl p-5">
            <div className="text-text-secondary mb-3">Total XP</div>
            <div className="text-3xl font-bold text-gold">1,250</div>
          </div>
        </div>

        <Link
          to="/challenge"
          className="inline-block px-6 py-3 bg-gradient-brand text-white rounded-xl font-semibold hover:scale-105 transition-transform"
        >
          Start a Challenge
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
