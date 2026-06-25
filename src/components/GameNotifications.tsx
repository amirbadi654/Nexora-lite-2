import React, { useEffect, useState } from 'react';
import { useGame, getRankColor, GameNotification } from '../context/GameContext';
import { Crown, Shield, Medal, Star, Trophy } from 'lucide-react';

const RankIcon: React.FC<{ rank: string; color: string }> = ({ rank, color }) => {
  const props = { size: 28, style: { color } };
  if (rank === 'Gold') return <Crown {...props} />;
  if (rank === 'Silver') return <Shield {...props} />;
  if (rank === 'Bronze') return <Medal {...props} />;
  return <Star {...props} />;
};

const LevelUpOverlay: React.FC<{ payload: any; onDone: () => void }> = ({ payload, onDone }) => {
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 1.2 + Math.random() * 0.8,
      size: 6 + Math.random() * 10,
    }))
  );

  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fadein" style={{ background: 'rgba(15,23,42,0.95)' }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: '-20px',
            width: p.size,
            height: p.size,
            background: p.id % 2 === 0 ? '#8B5CF6' : '#38BDF8',
            animation: `starRise ${p.duration}s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
      <div className="text-center px-4">
        <h1
          className="text-5xl sm:text-7xl font-extrabold mb-4 animate-pop"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #38BDF8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          LEVEL UP!
        </h1>
        <p className="text-xl sm:text-2xl text-text-primary font-semibold animate-fadein-slow">
          You reached Level {payload.level}
        </p>
      </div>
    </div>
  );
};

const RankUpToast: React.FC<{ payload: any; onDone: () => void }> = ({ payload, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);
  const color = getRankColor(payload.rank);
  return (
    <div className="rounded-xl border p-4 shadow-2xl animate-slidein-right" style={{ background: '#1E293B', borderColor: color }}>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: `${color}22` }}>
          <RankIcon rank={payload.rank} color={color} />
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color }}>Rank Up!</div>
          <div className="text-text-primary font-bold">You are now {payload.rank}</div>
        </div>
      </div>
    </div>
  );
};

const StreakToast: React.FC<{ payload: any; onDone: () => void }> = ({ payload, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="rounded-xl border border-orange-500/50 bg-[#1E293B] p-4 shadow-2xl animate-slidein-right">
      <div className="flex items-center gap-3">
        <Trophy size={28} className="text-orange-500" />
        <div>
          <div className="text-sm font-semibold text-orange-500">5-Day Streak Complete!</div>
          <div className="text-text-primary font-bold">+{payload.bonus} XP Bonus</div>
        </div>
      </div>
    </div>
  );
};

const AchievementToast: React.FC<{ payload: any; onDone: () => void }> = ({ payload, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="rounded-xl border-2 p-4 shadow-2xl animate-slidein-right" style={{ background: '#1E293B', borderColor: '#FBBF24' }}>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
          <Star size={26} className="text-gold" fill="currentColor" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-gold">Achievement Unlocked!</div>
          <div className="text-text-primary font-bold">{payload.name}</div>
        </div>
      </div>
    </div>
  );
};

const GameNotifications: React.FC = () => {
  const { notifications, dismissNotification } = useGame();
  const levelUp = notifications.filter((n) => n.type === 'levelup').slice(-1)[0];
  const toasts = notifications.filter((n) => n.type !== 'levelup');

  return (
    <>
      {levelUp && <LevelUpOverlay payload={levelUp.payload} onDone={() => dismissNotification(levelUp.id)} />}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-3">
        {toasts.map((n: GameNotification) => {
          if (n.type === 'rankup') return <RankUpToast key={n.id} payload={n.payload} onDone={() => dismissNotification(n.id)} />;
          if (n.type === 'streak') return <StreakToast key={n.id} payload={n.payload} onDone={() => dismissNotification(n.id)} />;
          if (n.type === 'achievement') return <AchievementToast key={n.id} payload={n.payload} onDone={() => dismissNotification(n.id)} />;
          return null;
        })}
      </div>
    </>
  );
};

export default GameNotifications;
