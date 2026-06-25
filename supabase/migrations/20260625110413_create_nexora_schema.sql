/*
# Create Nexora game schema

1. Overview
Creates the core database tables for Nexora, a competitive learning platform.
Users are identified by wallet address (no Supabase auth). All tables use
wallet_address as the key. RLS is enabled with anon+authenticated access since
the app uses the anon key directly (no sign-in flow).

2. New Tables
- `users`: Player profile — XP, level, rank, streak, premium status, booster state.
- `challenge_history`: Record of each challenge attempt (category, difficulty, answer, XP).
- `achievements`: Unlocked achievements per user (unique per wallet+achievement_id).
- `transactions`: Purchase records (booster, premium) with tx hash and amount.

3. Security
- RLS enabled on all tables.
- Policies allow anon + authenticated full CRUD (single-tenant, wallet-keyed, no auth).
- This is acceptable because the app has no sign-in and uses the anon key directly.
*/

-- users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  total_xp integer DEFAULT 0,
  level integer DEFAULT 0,
  rank text DEFAULT 'Beginner',
  rank_score integer DEFAULT 0,
  streak integer DEFAULT 0,
  last_active_date date,
  correct_answers integer DEFAULT 0,
  total_challenges integer DEFAULT 0,
  premium_status boolean DEFAULT false,
  premium_purchased_at timestamp,
  xp_booster_active boolean DEFAULT false,
  xp_booster_expiry timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_users" ON users;
CREATE POLICY "anon_select_users" ON users FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_users" ON users;
CREATE POLICY "anon_insert_users" ON users FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_users" ON users;
CREATE POLICY "anon_update_users" ON users FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_users" ON users;
CREATE POLICY "anon_delete_users" ON users FOR DELETE
  TO anon, authenticated USING (true);

-- challenge_history table
CREATE TABLE IF NOT EXISTS challenge_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text REFERENCES users(wallet_address),
  category text NOT NULL,
  difficulty text NOT NULL,
  question text,
  user_answer text,
  correct_answer text,
  is_correct boolean,
  xp_earned integer DEFAULT 0,
  created_at timestamp DEFAULT now()
);

ALTER TABLE challenge_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_challenge_history" ON challenge_history;
CREATE POLICY "anon_select_challenge_history" ON challenge_history FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_challenge_history" ON challenge_history;
CREATE POLICY "anon_insert_challenge_history" ON challenge_history FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_challenge_history" ON challenge_history;
CREATE POLICY "anon_update_challenge_history" ON challenge_history FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_challenge_history" ON challenge_history;
CREATE POLICY "anon_delete_challenge_history" ON challenge_history FOR DELETE
  TO anon, authenticated USING (true);

-- achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text REFERENCES users(wallet_address),
  achievement_id text NOT NULL,
  achievement_name text,
  unlocked_at timestamp DEFAULT now(),
  UNIQUE(wallet_address, achievement_id)
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_achievements" ON achievements;
CREATE POLICY "anon_select_achievements" ON achievements FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_achievements" ON achievements;
CREATE POLICY "anon_insert_achievements" ON achievements FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_achievements" ON achievements;
CREATE POLICY "anon_delete_achievements" ON achievements FOR DELETE
  TO anon, authenticated USING (true);

-- transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text REFERENCES users(wallet_address),
  transaction_type text NOT NULL,
  tx_hash text,
  amount text,
  status text DEFAULT 'confirmed',
  created_at timestamp DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_transactions" ON transactions;
CREATE POLICY "anon_select_transactions" ON transactions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_transactions" ON transactions;
CREATE POLICY "anon_insert_transactions" ON transactions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_transactions" ON transactions;
CREATE POLICY "anon_delete_transactions" ON transactions FOR DELETE
  TO anon, authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_total_xp ON users(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_challenge_history_wallet ON challenge_history(wallet_address);
CREATE INDEX IF NOT EXISTS idx_achievements_wallet ON achievements(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(wallet_address);
