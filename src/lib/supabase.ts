import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars. Check .env for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbUser {
  wallet_address: string;
  total_xp: number;
  level: number;
  rank: string;
  rank_score: number;
  streak: number;
  last_active_date: string | null;
  correct_answers: number;
  total_challenges: number;
  premium_status: boolean;
  premium_purchased_at: string | null;
  xp_booster_active: boolean;
  xp_booster_expiry: string | null;
}

export interface DbChallenge {
  id: string;
  wallet_address: string;
  category: string;
  difficulty: string;
  question: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  xp_earned: number;
  created_at: string;
}

export interface DbAchievement {
  id: string;
  wallet_address: string;
  achievement_id: string;
  achievement_name: string;
  unlocked_at: string;
}

export interface DbTransaction {
  id: string;
  wallet_address: string;
  transaction_type: string;
  tx_hash: string | null;
  amount: string | null;
  status: string;
  created_at: string;
}

export interface LeaderboardEntry {
  wallet_address: string;
  total_xp: number;
  level: number;
  rank: string;
  premium_status: boolean;
}

// 1. getOrCreateUser
export async function getOrCreateUser(walletAddress: string): Promise<DbUser | null> {
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .maybeSingle();

  if (existing) return existing as DbUser;

  const { data: created, error } = await supabase
    .from('users')
    .insert({ wallet_address: walletAddress })
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Failed to create user:', error);
    return null;
  }
  return created as DbUser;
}

// 2. updateUserStats
export async function updateUserStats(
  walletAddress: string,
  updates: Partial<DbUser>
): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('wallet_address', walletAddress);

  if (error) console.error('Failed to update user stats:', error);
}

// 3. saveChallenge
export async function saveChallenge(
  walletAddress: string,
  challengeData: {
    category: string;
    difficulty: string;
    question: string;
    user_answer: string;
    correct_answer: string;
    is_correct: boolean;
    xp_earned: number;
  }
): Promise<void> {
  const { error } = await supabase.from('challenge_history').insert({
    wallet_address: walletAddress,
    ...challengeData,
  });

  if (error) console.error('Failed to save challenge:', error);
}

// 4. unlockAchievement
export async function unlockAchievementDb(
  walletAddress: string,
  achievementId: string,
  achievementName: string
): Promise<void> {
  const { error } = await supabase.from('achievements').upsert(
    {
      wallet_address: walletAddress,
      achievement_id: achievementId,
      achievement_name: achievementName,
    },
    { onConflict: 'wallet_address,achievement_id', ignoreDuplicates: true }
  );

  if (error) console.error('Failed to unlock achievement:', error);
}

// 5. saveTransaction
export async function saveTransactionDb(
  walletAddress: string,
  txData: {
    transaction_type: string;
    tx_hash: string;
    amount: string;
    status: string;
  }
): Promise<void> {
  const { error } = await supabase.from('transactions').insert({
    wallet_address: walletAddress,
    ...txData,
  });

  if (error) console.error('Failed to save transaction:', error);
}

// 6. getLeaderboard
export async function getLeaderboard(type: 'weekly' | 'alltime'): Promise<LeaderboardEntry[]> {
  let query = supabase
    .from('users')
    .select('wallet_address, total_xp, level, rank, premium_status')
    .order('total_xp', { ascending: false })
    .limit(50);

  if (type === 'weekly') {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    query = query.gte('updated_at', oneWeekAgo.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to fetch leaderboard:', error);
    return [];
  }
  return (data || []) as LeaderboardEntry[];
}

// 7. getUserAchievements
export async function getUserAchievements(
  walletAddress: string
): Promise<DbAchievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('wallet_address', walletAddress);

  if (error) {
    console.error('Failed to fetch achievements:', error);
    return [];
  }
  return (data || []) as DbAchievement[];
}

// 8. getUserTransactions
export async function getUserTransactions(
  walletAddress: string
): Promise<DbTransaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch transactions:', error);
    return [];
  }
  return (data || []) as DbTransaction[];
}

// 9. getChallengeHistory
export async function getChallengeHistory(
  walletAddress: string,
  limit = 20
): Promise<DbChallenge[]> {
  const { data, error } = await supabase
    .from('challenge_history')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch challenge history:', error);
    return [];
  }
  return (data || []) as DbChallenge[];
}
