import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { useWallet } from './WalletContext';
import {
  getOrCreateUser,
  updateUserStats,
  saveChallenge,
  unlockAchievementDb,
  saveTransactionDb,
  getUserAchievements,
  DbUser,
} from '../lib/supabase';

export type RankName = 'Beginner' | 'Bronze' | 'Silver' | 'Gold';

export interface Achievement {
  id: string;
  name: string;
  unlockedAt: number;
}

export interface GameState {
  totalXP: number;
  level: number;
  rank: RankName;
  rankScore: number;
  streak: number;
  lastActiveDate: string | null;
  correctAnswers: number;
  totalChallenges: number;
  accuracy: number;
  achievements: Achievement[];
  premiumStatus: boolean;
  xpBoosterActive: boolean;
  xpBoosterExpiry: number | null;
}

export interface GameNotification {
  id: number;
  type: 'levelup' | 'rankup' | 'achievement' | 'streak';
  payload: any;
}

interface GameContextType extends GameState {
  awardXP: (
    category: string,
    difficulty: string,
    isCorrect: boolean,
    challengeData?: { question: string; userAnswer: string; correctAnswer: string }
  ) => { xpEarned: number; leveledUp: boolean; newRank: RankName | null };
  checkAndUpdateStreak: (walletAddress: string) => void;
  purchasePremium: (txHash?: string) => void;
  activateBooster: (durationMs: number, txHash?: string) => void;
  resetProgress: () => void;
  syncFromSupabase: (walletAddress: string) => Promise<void>;
  notifications: GameNotification[];
  dismissNotification: (id: number) => void;
  isLoading: boolean;
}

const STORAGE_KEY = 'nexora_gamestate';

const XP_TABLE: Record<string, Record<string, number>> = {
  general: { easy: 10, medium: 20, hard: 40 },
  football: { easy: 10, medium: 20, hard: 40 },
  ai: { easy: 15, medium: 30, hard: 60 },
};

const RANK_THRESHOLDS: { name: RankName; min: number; color: string }[] = [
  { name: 'Beginner', min: 0, color: '#64748B' },
  { name: 'Bronze', min: 200, color: '#B87333' },
  { name: 'Silver', min: 500, color: '#C0C0C0' },
  { name: 'Gold', min: 1000, color: '#FBBF24' },
];

const ACHIEVEMENT_DEFS: Record<string, string> = {
  first_login: 'First Login',
  first_correct: 'First Correct Answer',
  level_5: 'Reach Level 5',
  rank_bronze: 'Reach Bronze',
  rank_silver: 'Reach Silver',
  rank_gold: 'Reach Gold',
  streak_5: '5-Day Streak',
  buy_premium: 'Premium Member',
};

const DEFAULT_STATE: GameState = {
  totalXP: 0,
  level: 0,
  rank: 'Beginner',
  rankScore: 0,
  streak: 0,
  lastActiveDate: null,
  correctAnswers: 0,
  totalChallenges: 0,
  accuracy: 0,
  achievements: [],
  premiumStatus: false,
  xpBoosterActive: false,
  xpBoosterExpiry: null,
};

const computeLevel = (totalXP: number) => Math.floor(totalXP / 100);
const computeRank = (rankScore: number): RankName => {
  let result: RankName = 'Beginner';
  for (const r of RANK_THRESHOLDS) {
    if (rankScore >= r.min) result = r.name;
  }
  return result;
};

const loadState = (): GameState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATE };
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isConnected, walletAddress } = useWallet();
  const [state, setState] = useState<GameState>(loadState);
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const notifId = useRef(0);
  const firstLoginChecked = useRef(false);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  // Expire booster
  useEffect(() => {
    if (state.xpBoosterExpiry) {
      const remaining = state.xpBoosterExpiry - Date.now();
      if (remaining <= 0) {
        setState((s) => ({ ...s, xpBoosterActive: false, xpBoosterExpiry: null }));
      } else {
        const t = setTimeout(() => {
          setState((s) => ({ ...s, xpBoosterActive: false, xpBoosterExpiry: null }));
        }, remaining);
        return () => clearTimeout(t);
      }
    }
  }, [state.xpBoosterExpiry]);

  const pushNotification = useCallback((type: GameNotification['type'], payload: any) => {
    const id = ++notifId.current;
    setNotifications((n) => [...n, { id, type, payload }]);
    const duration = type === 'levelup' ? 2500 : 4000;
    setTimeout(() => {
      setNotifications((n) => n.filter((x) => x.id !== id));
    }, duration);
  }, []);

  const dismissNotification = useCallback((id: number) => {
    setNotifications((n) => n.filter((x) => x.id !== id));
  }, []);

  const unlockAchievement = useCallback(
    (id: string, current: GameState): GameState => {
      if (current.achievements.some((a) => a.id === id)) return current;
      const name = ACHIEVEMENT_DEFS[id];
      if (!name) return current;
      pushNotification('achievement', { id, name });
      // Sync to Supabase
      if (walletAddress) {
        unlockAchievementDb(walletAddress, id, name);
      }
      return {
        ...current,
        achievements: [...current.achievements, { id, name, unlockedAt: Date.now() }],
      };
    },
    [pushNotification, walletAddress]
  );

  // Sync from Supabase on wallet connect
  const syncFromSupabase = useCallback(async (addr: string) => {
    setIsLoading(true);
    try {
      const dbUser = await getOrCreateUser(addr);
      if (dbUser) {
        const dbAchievements = await getUserAchievements(addr);
        setState((prev) => ({
          ...prev,
          totalXP: dbUser.total_xp ?? 0,
          level: dbUser.level ?? 0,
          rank: (dbUser.rank as RankName) ?? 'Beginner',
          rankScore: dbUser.rank_score ?? 0,
          streak: dbUser.streak ?? 0,
          lastActiveDate: dbUser.last_active_date ?? null,
          correctAnswers: dbUser.correct_answers ?? 0,
          totalChallenges: dbUser.total_challenges ?? 0,
          accuracy:
            (dbUser.total_challenges ?? 0) > 0
              ? (dbUser.correct_answers ?? 0) / (dbUser.total_challenges ?? 1)
              : 0,
          premiumStatus: dbUser.premium_status ?? false,
          xpBoosterActive: dbUser.xp_booster_active ?? false,
          xpBoosterExpiry: dbUser.xp_booster_expiry
            ? new Date(dbUser.xp_booster_expiry).getTime()
            : null,
          achievements: dbAchievements.map((a) => ({
            id: a.achievement_id,
            name: a.achievement_name,
            unlockedAt: new Date(a.unlocked_at).getTime(),
          })),
        }));
      }
    } catch (err) {
      console.error('Failed to sync from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On wallet connect: sync + first login achievement
  useEffect(() => {
    if (isConnected && walletAddress && !firstLoginChecked.current) {
      firstLoginChecked.current = true;
      syncFromSupabase(walletAddress).then(() => {
        setState((s) => {
          const next = unlockAchievement('first_login', s);
          return next;
        });
      });
    }
    if (!isConnected) {
      firstLoginChecked.current = false;
    }
  }, [isConnected, walletAddress, syncFromSupabase, unlockAchievement]);

  const awardXP = useCallback(
    (
      category: string,
      difficulty: string,
      isCorrect: boolean,
      challengeData?: { question: string; userAnswer: string; correctAnswer: string }
    ) => {
      let result = { xpEarned: 0, leveledUp: false, newRank: null as RankName | null };
      setState((prev) => {
        let next = { ...prev };
        const baseXP = XP_TABLE[category]?.[difficulty] ?? 0;
        const earned = isCorrect ? baseXP : 0;
        const finalXP = prev.xpBoosterActive ? Math.round(earned * 1.5) : earned;
        result.xpEarned = finalXP;

        const oldLevel = computeLevel(prev.totalXP);
        const newTotalXP = prev.totalXP + finalXP;
        const newLevel = computeLevel(newTotalXP);
        next.totalXP = newTotalXP;
        next.level = newLevel;

        if (isCorrect) next.correctAnswers += 1;
        next.totalChallenges += 1;
        next.accuracy =
          next.totalChallenges > 0 ? next.correctAnswers / next.totalChallenges : 0;

        const newRankScore =
          next.totalXP * 0.5 +
          next.correctAnswers * 10 +
          next.accuracy * 100 +
          next.totalChallenges * 2;
        next.rankScore = Math.round(newRankScore);
        const oldRank = prev.rank;
        const newRank = computeRank(newRankScore);
        next.rank = newRank;

        if (newLevel > oldLevel) {
          result.leveledUp = true;
          pushNotification('levelup', { level: newLevel });
        }
        if (newRank !== oldRank) {
          const order: RankName[] = ['Beginner', 'Bronze', 'Silver', 'Gold'];
          if (order.indexOf(newRank) > order.indexOf(oldRank)) {
            result.newRank = newRank;
            pushNotification('rankup', { rank: newRank });
          }
        }

        if (isCorrect) next = unlockAchievement('first_correct', next);
        if (newLevel >= 5) next = unlockAchievement('level_5', next);
        if (newRank === 'Bronze') next = unlockAchievement('rank_bronze', next);
        if (newRank === 'Silver') next = unlockAchievement('rank_silver', next);
        if (newRank === 'Gold') next = unlockAchievement('rank_gold', next);

        // Sync to Supabase
        if (walletAddress) {
          const dbUpdates: Partial<DbUser> = {
            total_xp: next.totalXP,
            level: next.level,
            rank: next.rank,
            rank_score: next.rankScore,
            correct_answers: next.correctAnswers,
            total_challenges: next.totalChallenges,
          };
          updateUserStats(walletAddress, dbUpdates);
          if (challengeData) {
            saveChallenge(walletAddress, {
              category,
              difficulty,
              question: challengeData.question,
              user_answer: challengeData.userAnswer,
              correct_answer: challengeData.correctAnswer,
              is_correct: isCorrect,
              xp_earned: finalXP,
            });
          }
        }

        return next;
      });
      return result;
    },
    [pushNotification, unlockAchievement, walletAddress]
  );

  const checkAndUpdateStreak = useCallback(
    (addr: string) => {
      if (!addr) return;
      const today = new Date().toISOString().slice(0, 10);
      setState((prev) => {
        let next = { ...prev };
        let newStreak = prev.streak;

        if (prev.lastActiveDate === today) {
          // already counted today
        } else if (prev.lastActiveDate) {
          const last = new Date(prev.lastActiveDate);
          const diffDays = Math.round(
            (new Date(today).getTime() - last.getTime()) / 86400000
          );
          if (diffDays === 1) newStreak = prev.streak + 1;
          else newStreak = 1;
        } else {
          newStreak = 1;
        }

        if (newStreak > 5) newStreak = 1;

        const dayInCycle = ((newStreak - 1) % 5) + 1;
        const bonusXP = dayInCycle * 10;
        const oldLevel = computeLevel(prev.totalXP);
        const newTotalXP = prev.totalXP + bonusXP;
        const newLevel = computeLevel(newTotalXP);
        next.totalXP = newTotalXP;
        next.level = newLevel;
        next.streak = newStreak;
        next.lastActiveDate = today;

        const newRankScore =
          next.totalXP * 0.5 +
          next.correctAnswers * 10 +
          next.accuracy * 100 +
          next.totalChallenges * 2;
        next.rankScore = Math.round(newRankScore);
        next.rank = computeRank(newRankScore);

        if (newLevel > oldLevel) {
          pushNotification('levelup', { level: newLevel });
        }

        if (dayInCycle === 5) {
          pushNotification('streak', { day: 5, bonus: 50 });
          next = unlockAchievement('streak_5', next);
          next.streak = 0;
        }

        // Sync to Supabase
        updateUserStats(addr, {
          total_xp: next.totalXP,
          level: next.level,
          rank: next.rank,
          rank_score: next.rankScore,
          streak: next.streak,
          last_active_date: next.lastActiveDate,
        });

        return next;
      });
    },
    [pushNotification, unlockAchievement]
  );

  const purchasePremium = useCallback(
    (txHash?: string) => {
      setState((prev) => {
        let next = { ...prev, premiumStatus: true };
        next = unlockAchievement('buy_premium', next);
        if (walletAddress) {
          updateUserStats(walletAddress, {
            premium_status: true,
            premium_purchased_at: new Date().toISOString(),
          });
          if (txHash) {
            saveTransactionDb(walletAddress, {
              transaction_type: 'Premium Pass',
              tx_hash: txHash,
              amount: '0.05 RITUAL',
              status: 'confirmed',
            });
          }
        }
        return next;
      });
    },
    [unlockAchievement, walletAddress]
  );

  const activateBooster = useCallback(
    (durationMs: number, txHash?: string) => {
      const expiry = Date.now() + durationMs;
      setState((prev) => ({
        ...prev,
        xpBoosterActive: true,
        xpBoosterExpiry: expiry,
      }));
      if (walletAddress) {
        updateUserStats(walletAddress, {
          xp_booster_active: true,
          xp_booster_expiry: new Date(expiry).toISOString(),
        });
        if (txHash) {
          saveTransactionDb(walletAddress, {
            transaction_type: 'XP Booster',
            tx_hash: txHash,
            amount: '0.01 RITUAL',
            status: 'confirmed',
          });
        }
      }
    },
    [walletAddress]
  );

  const resetProgress = useCallback(() => {
    setState({ ...DEFAULT_STATE });
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        awardXP,
        checkAndUpdateStreak,
        purchasePremium,
        activateBooster,
        resetProgress,
        syncFromSupabase,
        notifications,
        dismissNotification,
        isLoading,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
};

export const getRankColor = (rank: RankName): string => {
  const r = RANK_THRESHOLDS.find((x) => x.name === rank);
  return r ? r.color : '#64748B';
};

export const getXPToNextLevel = (totalXP: number) => {
  const level = computeLevel(totalXP);
  return (level + 1) * 100 - totalXP;
};

export const getLevelProgress = (totalXP: number) => (totalXP % 100) / 100;
