-- ============================================================
-- MVP投票（ファンが選ぶ イタリア大会MVP）
--
-- 使い方：このファイルの内容をそのまま Supabase の SQL Editor に貼って実行する。
--
-- セキュリティ方針：
--   RLS を有効にしたうえで anon ロールにはポリシーを一切付けない。
--   読み書きはすべてサーバー側の API ルートから Service Role キーで行うため、
--   ブラウザに Supabase のキーは露出しない。
-- ============================================================

create table if not exists public.mvp_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id text not null default 'kwcc2026-italy',
  candidate_slug text not null,
  reason_tags text[] not null default '{}',
  -- sha256(IPアドレス + User-Agent + VOTE_HASH_SALT)。
  -- IPアドレスと User-Agent は生のまま保存しない。
  voter_hash text not null,
  -- 自由記述は今回のUIでは使わないが、あとから足せるよう列だけ用意しておく
  comment text,
  created_at timestamptz not null default now()
);

-- 同一 poll での二重投票を防ぐ
create unique index if not exists mvp_votes_poll_voter_uidx
  on public.mvp_votes (poll_id, voter_hash);

-- 候補ごとの集計用
create index if not exists mvp_votes_poll_candidate_idx
  on public.mvp_votes (poll_id, candidate_slug);

alter table public.mvp_votes enable row level security;

-- anon / authenticated 向けのポリシーは意図的に作成しない。
-- ポリシーが無い状態で RLS が有効なため、Service Role 以外からは読み書きできない。
