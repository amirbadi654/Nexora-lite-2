import React, { useState, useEffect } from 'react';
import { Copy, Check, Star, Zap, Award, Flame, TrendingUp, Clock } from 'lucide-react';
import { useGame, getRankColor, getLevelProgress, RankName } from '../context/GameContext';
import { useWallet } from '../context/WalletContext';
import { RankBadge, ACHIEVEMENT_DEFS, AchievementCard } from '../components/AchievementBadge';
import { getUserTransactions, DbTransaction } from '../lib/supabase';

const RANK_ORDER: RankName[] = ['Beginner', 'Bronze', 'Silver', 'Gold'];
const RANK_THRESHOLDS: Record<RankName, number> = { Beginner: 0, Bronze: 200, Silver: 500, Gold: 1000 };

const DonutChart: React.FC<{ accuracy: number }> = ({ accuracy }) => {
  const pct = Math.round(accuracy * 100);
  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#273449" strokeWidth="3" />
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-text-primary">{pct}%</div>
    </div>
  );
};

const Bar: React.FC<{ label: string; value: number; max: number; color: string }> = ({ label, value, max, color }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1"><span className="text-text-secondary">{label}</span><span className="text-text-primary font-semibold">{value}</span></div>
      <div className="h-2 bg-secondary-layer rounded-full overflow-hidden"><div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} /></div>
    </div>
  );
};

const Profile: React.FC = () => {
  const { totalXP, level, rank, rankScore, streak, correctAnswers, totalChallenges, accuracy, achievements, premiumStatus, xpBoosterActive, xpBoosterExpiry } = useGame();
  const { walletAddress, shortAddress } = useWallet();
  const [copied, setCopied] = useState(false);
  const [boosterRemaining, setBoosterRemaining] = useState(0);
  const [transactions, setTransactions] = useState<DbTransaction[]>([]);

  const rankColor = getRankColor(rank);
  const levelProgress = Math.round(getLevelProgress(totalXP) * 100);
  const nextLevelXP = (level + 1) * 100;
  const currentLevelXP = level * 100;
  const rankIdx = RANK_ORDER.indexOf(rank);
  const nextRank = RANK_ORDER[Math.min(rankIdx + 1, 3)];
  const currentRankMin = RANK_THRESHOLDS[rank];
  const nextRankMin = nextRank ? RANK_THRESHOLDS[nextRank] : RANK_THRESHOLDS.Gold;
  const rankProgressPct = nextRank ? Math.min(100, Math.round(((rankScore - currentRankMin) / (nextRankMin - currentRankMin)) * 100)) : 100;

  useEffect(() => {
    if (walletAddress) {
      getUserTransactions(walletAddress).then(setTransactions);
    }
  }, [walletAddress, xpBoosterActive, premiumStatus]);

  useEffect(() => {
    if (!xpBoosterActive || !xpBoosterExpiry) return;
    const tick = () => setBoosterRemaining(Math.max(0, xpBoosterExpiry - Date.now()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [xpBoosterActive, xpBoosterExpiry]);

  const formatCountdown = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const copyWallet = () => {
    if (walletAddress) navigator.clipboard?.writeText(walletAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const unlockedIds = new Set(achievements.map((a) => a.id));
  const wrongAnswers = totalChallenges - correctAnswers;
  const catMax = Math.max(totalChallenges, 1);
  const catData = [
    { label: 'General Knowledge', value: Math.round(totalChallenges * 0.5), color: '#8B5CF6' },
    { label: 'Football', value: Math.round(totalChallenges * 0.3), color: '#38BDF8' },
    { label: 'AI & Technology', value: Math.round(totalChallenges * 0.2), color: '#10B981' },
  ];
  const diffData = [
    { label: 'Easy', value: Math.round(totalChallenges * 0.5), color: '#10B981' },
    { label: 'Medium', value: Math.round(totalChallenges * 0.35), color: '#FBBF24' },
    { label: 'Hard', value: Math.round(totalChallenges * 0.15), color: '#EF4444' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #8B5CF6, #38BDF8)' }}>0X</div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="text-lg font-mono text-text-primary">{shortAddress || 'Not connected'}</span>
              {walletAddress && (
                <button onClick={copyWallet} className="p-1.5 rounded-md bg-secondary-layer hover:bg-brand-purple/30 transition-colors" title="Copy full address">
                  {copied ? <Check size={14} className="text-success-emerald" /> : <Copy size={14} className="text-text-secondary" />}
                </button>
              )}
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <RankBadge rank={rank} size="md" />
              <span className="font-bold text-lg" style={{ color: rankColor }}>{rank}</span>
              {premiumStatus && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#FBBF2422', color: '#FBBF24' }}><Star size={12} fill="currentColor" /> Premium Member</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total XP', value: totalXP.toLocaleString(), icon: <Zap size={18} className="text-gold" /> },
            { label: 'Current Level', value: level, icon: <TrendingUp size={18} className="text-brand-purple" /> },
            { label: 'Rank', value: rank, color: rankColor, icon: <Award size={18} style={{ color: rankColor }} /> },
            { label: 'Total Challenges', value: totalChallenges, icon: <Flame size={18} className="text-orange-500" /> },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-xs text-text-secondary">{s.label}</span></div>
              <div className="text-2xl font-bold" style={s.color ? { color: s.color } : { color: '#E6EDF7' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="bg-card rounded-xl p-6 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-2">Progress to Next Level</h3>
            <div className="h-3 bg-secondary-layer rounded-full overflow-hidden mb-2"><div className="h-3 rounded-full transition-all duration-500" style={{ width: `${levelProgress}%`, background: '#8B5CF6' }} /></div>
            <p className="text-xs text-text-secondary"><span className="text-text-primary font-semibold">{totalXP - currentLevelXP}</span> / {nextLevelXP - currentLevelXP} XP to Level {level + 1}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-2">Progress to Next Rank{nextRank && nextRank !== rank ? ` (${nextRank})` : ' (Max Rank)'}</h3>
            <div className="h-3 bg-secondary-layer rounded-full overflow-hidden mb-2"><div className="h-3 rounded-full transition-all duration-500" style={{ width: `${rankProgressPct}%`, background: rankColor }} /></div>
            <p className="text-xs text-text-secondary"><span className="text-text-primary font-semibold">{Math.round(rankScore)}</span> / {nextRank ? nextRankMin : rankScore} rank score</p>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-secondary">Daily Streak</h3>
            <span className="text-xs text-text-secondary">Best streak: {Math.max(streak, 5)} days</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Flame size={40} className="text-orange-500" />
            <span className="text-4xl font-bold text-orange-500">{streak}</span>
            <span className="text-text-secondary">/ 5 day cycle</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((day) => (
              <div key={day} className="flex-1 h-12 rounded-lg flex items-center justify-center text-sm font-bold transition-all" style={{ background: day <= streak ? '#F97316' : '#273449', color: day <= streak ? '#FFFFFF' : '#A8B3C7' }}>Day {day}</div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-4">Achievements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACHIEVEMENT_DEFS.map((def) => <AchievementCard key={def.id} def={def} unlocked={unlockedIds.has(def.id)} />)}
          </div>
        </div>

        {/* My Items */}
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-4">My Items</h3>
          {!premiumStatus && !xpBoosterActive ? (
            <p className="text-text-secondary text-sm bg-card rounded-xl p-6">No items yet. Visit the Shop.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {xpBoosterActive && (
                <div className="bg-card rounded-xl p-5 border-2" style={{ borderColor: '#38BDF8' }}>
                  <div className="flex items-center gap-2 mb-2"><Zap size={20} className="text-interactive-cyan" /><span className="font-bold text-text-primary">XP Booster</span></div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><Clock size={14} /><span className="font-mono text-interactive-cyan">{formatCountdown(boosterRemaining)}</span><span>remaining</span></div>
                </div>
              )}
              {premiumStatus && (
                <div className="bg-card rounded-xl p-5 border-2" style={{ borderColor: '#FBBF24' }}>
                  <div className="flex items-center gap-2 mb-2"><Star size={20} className="text-gold" fill="currentColor" /><span className="font-bold text-text-primary">Premium Pass</span></div>
                  <p className="text-sm text-text-secondary">Active — 1.5x XP multiplier on all challenges.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="bg-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-text-primary mb-5">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-text-secondary text-sm">Total Challenges Attempted</span><span className="text-text-primary font-semibold">{totalChallenges}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary text-sm">Correct Answers</span><span className="text-success-emerald font-semibold">{correctAnswers}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary text-sm">Wrong Answers</span><span className="text-red-400 font-semibold">{wrongAnswers}</span></div>
              <div className="flex items-center justify-between pt-2"><span className="text-text-secondary text-sm">Accuracy</span><DonutChart accuracy={accuracy} /></div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase mb-3">By Category</h4>
              {catData.map((c) => <Bar key={c.label} label={c.label} value={c.value} max={catMax} color={c.color} />)}
              <h4 className="text-xs font-semibold text-text-secondary uppercase mb-3 mt-4">By Difficulty</h4>
              {diffData.map((d) => <Bar key={d.label} label={d.label} value={d.value} max={catMax} color={d.color} />)}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-4">Transaction History</h3>
          {transactions.length === 0 ? (
            <p className="text-text-secondary text-sm bg-card rounded-xl p-6">No transactions yet.</p>
          ) : (
            <div className="bg-card rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-2 px-4 py-3 text-xs font-semibold text-text-secondary uppercase border-b border-secondary-layer">
                <span>Type</span><span>Date</span><span>Amount</span><span>Status</span>
              </div>
              {transactions.map((t, i) => (
                <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-2 px-4 py-3 text-sm items-center hover:bg-secondary-layer transition-colors">
                  <span className="text-text-primary font-medium">{t.transaction_type}</span>
                  <span className="text-text-secondary">{new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="text-text-primary font-mono">{t.amount}</span>
                  <span className="flex items-center gap-1 text-success-emerald"><Check size={14} /> {t.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
