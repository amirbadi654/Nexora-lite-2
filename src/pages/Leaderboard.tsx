import React, { useState, useEffect } from 'react';
import { Crown, Star } from 'lucide-react';
import { useGame, getRankColor, RankName } from '../context/GameContext';
import { useWallet } from '../context/WalletContext';
import { getLeaderboard, LeaderboardEntry } from '../lib/supabase';

const MOCK_PLAYERS: LeaderboardEntry[] = [
  { wallet_address: '0x4f2a91b8e7c3d5a1f9e8b2c4d6a8f0e2', total_xp: 2480, level: 24, rank: 'Gold', premium_status: true },
  { wallet_address: '0x8b3c7d9e1f2a4b6c8d0e2f4a6b8c0d2e', total_xp: 2150, level: 21, rank: 'Gold', premium_status: true },
  { wallet_address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d', total_xp: 1920, level: 19, rank: 'Silver', premium_status: false },
  { wallet_address: '0x9e8f7d6c5b4a3f2e1d0c9b8a7f6e5d4c', total_xp: 1740, level: 17, rank: 'Silver', premium_status: false },
  { wallet_address: '0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f', total_xp: 1610, level: 16, rank: 'Silver', premium_status: true },
  { wallet_address: '0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d', total_xp: 1480, level: 15, rank: 'Silver', premium_status: false },
  { wallet_address: '0x7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a', total_xp: 1290, level: 13, rank: 'Bronze', premium_status: false },
  { wallet_address: '0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b', total_xp: 1170, level: 12, rank: 'Bronze', premium_status: false },
  { wallet_address: '0x6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e', total_xp: 1050, level: 11, rank: 'Bronze', premium_status: false },
  { wallet_address: '0x0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c', total_xp: 980, level: 10, rank: 'Bronze', premium_status: false },
];

const short = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

const PODIUM_THEMES: Record<number, { color: string; height: string }> = {
  1: { color: '#FBBF24', height: 'h-44' },
  2: { color: '#C0C0C0', height: 'h-36' },
  3: { color: '#B87333', height: 'h-28' },
};

const PodiumCard: React.FC<{ player: LeaderboardEntry; rank: number }> = ({ player, rank }) => {
  const theme = PODIUM_THEMES[rank];
  return (
    <div className="flex flex-col items-center">
      {rank === 1 && <Crown size={32} className="mb-2" style={{ color: theme.color }} fill="currentColor" />}
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3 ring-4" style={{ background: 'linear-gradient(135deg, #8B5CF6, #38BDF8)', boxShadow: `0 0 24px ${theme.color}66`, ['--tw-ring-color' as string]: theme.color }}>
        {player.wallet_address.slice(2, 4).toUpperCase()}
      </div>
      <div className="text-sm font-semibold text-text-primary mb-1">{short(player.wallet_address)}</div>
      <div className="text-lg font-bold mb-2" style={{ color: theme.color }}>{player.total_xp.toLocaleString()} XP</div>
      <div className="px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: `${theme.color}22`, color: theme.color }}>{player.rank}</div>
      <div className={`${theme.height} w-full max-w-[140px] rounded-t-xl flex items-start justify-center pt-3`} style={{ background: `${theme.color}33`, borderTop: `3px solid ${theme.color}` }}>
        <span className="text-2xl font-extrabold" style={{ color: theme.color }}>{rank}</span>
      </div>
    </div>
  );
};

const Leaderboard: React.FC = () => {
  const [tab, setTab] = useState<'weekly' | 'alltime'>('weekly');
  const [players, setPlayers] = useState<LeaderboardEntry[]>(MOCK_PLAYERS);
  const { totalXP, level, rank, premiumStatus } = useGame();
  const { walletAddress } = useWallet();
  const rankColor = getRankColor(rank);

  useEffect(() => {
    let active = true;
    getLeaderboard(tab).then((data) => {
      if (active && data.length > 0) setPlayers(data);
    });
    return () => { active = false; };
  }, [tab]);

  const currentUserRank = players.findIndex((p) => p.wallet_address === walletAddress) + 1;

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-28 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Leaderboard</h1>
        <p className="text-text-secondary mb-6">Compete with the best. Prove your knowledge.</p>

        <div className="flex gap-2 mb-8">
          {(['weekly', 'alltime'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors" style={tab === t ? { background: '#8B5CF6', color: '#FFFFFF' } : { background: '#1E293B', color: '#A8B3C7' }}>
              {t === 'weekly' ? 'Weekly' : 'All-Time'}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-end justify-center gap-6 mb-10">
          {players[1] && <PodiumCard player={players[1]} rank={2} />}
          {players[0] && <PodiumCard player={players[0]} rank={1} />}
          {players[2] && <PodiumCard player={players[2]} rank={3} />}
        </div>

        <div className="bg-card rounded-xl overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_90px_60px_80px_40px] sm:grid-cols-[50px_1fr_100px_70px_90px_50px] gap-2 px-4 py-3 text-xs font-semibold text-text-secondary uppercase border-b border-secondary-layer">
            <span>#</span><span>Player</span><span>Rank</span><span>Level</span><span>XP</span><span className="text-right">Status</span>
          </div>
          {players.map((p, i) => {
            const isCurrentUser = p.wallet_address === walletAddress;
            const pColor = getRankColor(p.rank as RankName);
            return (
              <div key={i} className="grid grid-cols-[40px_1fr_90px_60px_80px_40px] sm:grid-cols-[50px_1fr_100px_70px_90px_50px] gap-2 px-4 py-3 items-center transition-colors hover:bg-secondary-layer" style={{ background: isCurrentUser ? '#273449' : '#1E293B', borderLeft: isCurrentUser ? '3px solid #8B5CF6' : '3px solid transparent' }}>
                <span className="font-bold text-text-primary">{i + 1}</span>
                <span className="inline-block px-2 py-1 rounded-md bg-secondary-layer text-xs font-mono text-text-primary truncate">{short(p.wallet_address)}</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: pColor }} /><span className="text-xs text-text-primary">{p.rank}</span></span>
                <span className="text-xs text-text-secondary">Lvl {p.level}</span>
                <span className="text-sm font-bold text-gold">{p.total_xp.toLocaleString()}</span>
                <span className="text-right">{p.premium_status && <Star size={16} className="text-gold inline-block" fill="currentColor" />}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 py-3" style={{ background: '#273449', borderTop: '2px solid #8B5CF6' }}>
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-text-secondary">Your Position:</span>
          <span className="font-bold text-text-primary">#{currentUserRank || '—'}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: rankColor }} /><span style={{ color: rankColor }}>{rank}</span></span>
          <span className="text-text-secondary">Level {level}</span>
          <span className="font-bold text-gold">{totalXP.toLocaleString()} XP</span>
          {premiumStatus && <Star size={16} className="text-gold" fill="currentColor" />}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
