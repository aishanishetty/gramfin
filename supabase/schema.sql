-- ============================================================
-- GramFin — Supabase Database Schema
-- ============================================================
-- HOW TO USE:
--   1. Go to your Supabase project dashboard
--   2. Click "SQL Editor" in the left sidebar
--   3. Paste this ENTIRE file and click "Run"
--   4. You should see "Success" for each statement
--
-- This script is safe to re-run (uses IF NOT EXISTS).
-- ============================================================

-- Enable the UUID extension (usually already enabled on Supabase)
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: schemes
-- Stores all government schemes. Publicly readable, not writable
-- from the frontend (data is managed via Supabase dashboard).
-- ============================================================
create table if not exists schemes (
  id             text primary key,
  name           text not null,
  summary        text,
  eligibility    text,
  benefits       text,
  documents      text,
  apply          text,
  link           text,
  business_types text[]       default '{}',
  states         text[]       default '{}',
  groups         text[]       default '{}',
  created_at     timestamptz  default now()
);

-- ============================================================
-- TABLE: quiz_questions
-- Stores quiz questions. Publicly readable.
-- ============================================================
create table if not exists quiz_questions (
  id           serial      primary key,
  question     text        not null,
  options      jsonb       not null,   -- e.g. ["Option A", "Option B", "Option C"]
  answer_index integer     not null,   -- 0-based index of correct option
  explanation  text,
  sort_order   integer     default 0
);

-- ============================================================
-- TABLE: quiz_scores
-- Stores quiz results. Users can only see and add their own.
-- ============================================================
create table if not exists quiz_scores (
  id         uuid        default gen_random_uuid() primary key,
  user_id    uuid        references auth.users(id) on delete cascade,
  session_id text,                          -- for anonymous (not-logged-in) saves
  score      integer     not null check (score >= 0),
  total      integer     not null check (total > 0),
  taken_at   timestamptz default now()
);

-- ============================================================
-- TABLE: saved_schemes
-- Tracks which schemes each logged-in user has starred.
-- ============================================================
create table if not exists saved_schemes (
  id        uuid        default gen_random_uuid() primary key,
  user_id   uuid        not null references auth.users(id) on delete cascade,
  scheme_id text        not null references schemes(id) on delete cascade,
  saved_at  timestamptz default now(),
  unique (user_id, scheme_id)
);

-- ============================================================
-- TABLE: user_profiles
-- Extra profile info beyond what Supabase Auth stores.
-- ============================================================
create table if not exists user_profiles (
  id            uuid  primary key references auth.users(id) on delete cascade,
  display_name  text,
  state         text,
  business_type text,
  created_at    timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY — enable on every table
-- ============================================================
alter table schemes          enable row level security;
alter table quiz_questions   enable row level security;
alter table quiz_scores      enable row level security;
alter table saved_schemes    enable row level security;
alter table user_profiles    enable row level security;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- schemes: anyone (anon or authenticated) can read
drop policy if exists "Public read schemes"          on schemes;
create policy "Public read schemes"
  on schemes for select using (true);

-- quiz_questions: anyone can read
drop policy if exists "Public read quiz questions"   on quiz_questions;
create policy "Public read quiz questions"
  on quiz_questions for select using (true);

-- quiz_scores: authenticated users manage their own rows
drop policy if exists "Users insert own scores"      on quiz_scores;
drop policy if exists "Users read own scores"        on quiz_scores;
drop policy if exists "Anon insert session scores"   on quiz_scores;

create policy "Users insert own scores"
  on quiz_scores for insert
  with check (auth.uid() = user_id);

create policy "Users read own scores"
  on quiz_scores for select
  using (auth.uid() = user_id);

-- Allow anonymous saves (user_id is null, session_id identifies the session)
create policy "Anon insert session scores"
  on quiz_scores for insert
  with check (user_id is null);

-- saved_schemes: authenticated users manage their own rows only
drop policy if exists "Users read own saved"         on saved_schemes;
drop policy if exists "Users insert own saved"       on saved_schemes;
drop policy if exists "Users delete own saved"       on saved_schemes;

create policy "Users read own saved"
  on saved_schemes for select
  using (auth.uid() = user_id);

create policy "Users insert own saved"
  on saved_schemes for insert
  with check (auth.uid() = user_id);

create policy "Users delete own saved"
  on saved_schemes for delete
  using (auth.uid() = user_id);

-- user_profiles: users manage their own profile
drop policy if exists "Users read own profile"       on user_profiles;
drop policy if exists "Users update own profile"     on user_profiles;
drop policy if exists "Users insert own profile"     on user_profiles;

create policy "Users read own profile"
  on user_profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on user_profiles for update
  using (auth.uid() = id);

create policy "Users insert own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

-- ============================================================
-- SAMPLE DATA — Government Schemes
-- (Same data as the existing data.js, now in the database)
-- ============================================================
insert into schemes (id, name, summary, eligibility, benefits, documents, apply, link, business_types, states, groups)
values
  (
    'mudra',
    'PM Mudra Yojana (PMMY)',
    'Collateral-free loans for small non-farm businesses, given through banks, NBFCs and microfinance institutions.',
    'Any Indian citizen with a business plan for a non-farm income-generating activity (manufacturing, trading, services).',
    'Shishu: up to ₹50,000 · Kishore: ₹50,000 to ₹5 lakh · Tarun: ₹5 lakh to ₹10 lakh · Tarun Plus: up to ₹20 lakh. No collateral.',
    'ID proof, address proof, business proof or plan, passport photos, bank statement.',
    'Visit any bank branch, NBFC or microfinance institution, or apply on the Udyamimitra portal.',
    'https://www.mudra.org.in',
    array['shop','service','manufacturing','artisan'],
    array['all'],
    array['all']
  ),
  (
    'pmegp',
    'PMEGP (PM Employment Generation Programme)',
    'Bank loan plus a government subsidy for setting up a NEW micro-enterprise.',
    'Age 18+; new units only; 8th pass needed for larger projects. Run through KVIC / KVIB / DIC.',
    'Subsidy of roughly 15% to 35% of project cost (higher in rural areas and for special categories like women, SC/ST).',
    'ID and address proof, project report, caste/category certificate if applicable, education proof, quotations.',
    'Apply online on the KVIC PMEGP e-portal; the bank then processes the loan.',
    'https://www.kviconline.gov.in/pmegpeportal',
    array['manufacturing','service','artisan'],
    array['all'],
    array['all']
  ),
  (
    'standup',
    'Stand-Up India',
    'Bank loans for first-time entrepreneurs who are women or from SC/ST communities.',
    'Women and/or SC/ST entrepreneurs, age 18+, setting up a first-time (new) enterprise in manufacturing, services, trading or agri-allied activity.',
    'Composite loans between ₹10 lakh and ₹1 crore from scheduled commercial banks.',
    'ID and address proof, category certificate (SC/ST), business plan, bank statements.',
    'Apply through the Stand-Up India portal or directly at a bank branch.',
    'https://www.standupmitra.in',
    array['shop','service','manufacturing','farm'],
    array['all'],
    array['women','sc-st']
  ),
  (
    'svanidhi',
    'PM SVANidhi',
    'Small working-capital loans for street vendors, with rewards for digital payments.',
    'Street vendors who were vending before the scheme and have a certificate of vending / letter of recommendation from the local urban body.',
    'Collateral-free working-capital loan in stages (starting at ₹10,000 or more), interest subsidy and cashback incentives for digital transactions.',
    'Vending certificate or letter of recommendation, Aadhaar, bank account.',
    'Apply on the PM SVANidhi portal or at a CSC / bank.',
    'https://pmsvanidhi.mohua.gov.in',
    array['vendor'],
    array['all'],
    array['all']
  ),
  (
    'vishwakarma',
    'PM Vishwakarma',
    'Support for traditional artisans and craftspeople: skill training, toolkit and low-interest credit.',
    'Artisans working with their hands and tools in one of the 18 listed traditional trades (carpenter, blacksmith, potter, tailor, etc.).',
    'Training stipend, toolkit incentive, and collateral-free loans (₹1 lakh then ₹2 lakh) at a concessional interest rate, plus digital-payment incentive.',
    'Aadhaar, mobile number linked to Aadhaar, bank account details, proof of trade.',
    'Register at a Common Service Centre (CSC) or on the PM Vishwakarma portal.',
    'https://pmvishwakarma.gov.in',
    array['artisan'],
    array['all'],
    array['all']
  ),
  (
    'kcc',
    'Kisan Credit Card (KCC)',
    'Easy short-term credit for farmers for seeds, fertiliser and other farming needs; also covers dairy and fisheries.',
    'Farmers (owners or tenant farmers), sharecroppers, self-help groups; also animal husbandry and fisheries.',
    'Revolving credit limit at a low interest rate, with an interest subvention for timely repayment, plus accident insurance cover.',
    'Land records, ID and address proof, passport photos, bank account.',
    'Apply at your bank, cooperative bank or Regional Rural Bank branch.',
    'https://www.myscheme.gov.in',
    array['farm'],
    array['all'],
    array['all']
  ),
  (
    'cgtmse',
    'CGTMSE (Credit Guarantee for Micro & Small Enterprises)',
    'A government-backed guarantee so banks can lend to you without asking for collateral or a third-party guarantee.',
    'New and existing micro and small enterprises in manufacturing or services. Not available for pure retail trade in some cases; check with your bank.',
    'Collateral-free loan cover; you do not need to pledge property for eligible loans.',
    'Udyam registration, project / business details, ID and address proof, bank statements.',
    'You do not apply to CGTMSE directly. Ask your bank for a CGTMSE-covered loan.',
    'https://www.cgtmse.in',
    array['shop','service','manufacturing','artisan'],
    array['all'],
    array['all']
  ),
  (
    'cmegp',
    'CMEGP (Chief Minister Employment Generation Programme)',
    'Maharashtra state programme that gives a margin-money subsidy on bank loans for new small businesses.',
    'Residents of Maharashtra, age 18 to 45 (relaxation for special categories), starting a new unit.',
    'Subsidy of about 15% to 35% of project cost, linked to a bank loan.',
    'Aadhaar, domicile proof, education/training proof, project report, category certificate if applicable.',
    'Apply on the Maharashtra CMEGP portal; applications are processed by the District Industries Centre.',
    'https://www.maha-cmegp.gov.in',
    array['manufacturing','service','artisan','shop'],
    array['Maharashtra'],
    array['all']
  )
on conflict (id) do update
  set name = excluded.name,
      summary = excluded.summary,
      eligibility = excluded.eligibility,
      benefits = excluded.benefits,
      documents = excluded.documents,
      apply = excluded.apply,
      link = excluded.link,
      business_types = excluded.business_types,
      states = excluded.states,
      groups = excluded.groups;

-- ============================================================
-- SAMPLE DATA — Quiz Questions
-- ============================================================
insert into quiz_questions (question, options, answer_index, explanation, sort_order)
values
  (
    'Someone calls saying they are from the bank and asks for your OTP. What should you do?',
    '["Share it, they are from the bank", "Never share it and hang up", "Share only half of it"]',
    1,
    'Banks never ask for your OTP, PIN or CVV. Anyone asking is trying to steal from you.',
    1
  ),
  (
    'Do you need to enter your UPI PIN to RECEIVE money?',
    '["Yes, always", "No, only to send money", "Only for large amounts"]',
    1,
    'A PIN is only needed to send money. A ''collect request'' that asks for your PIN is a common scam.',
    2
  ),
  (
    'What does EMI stand for?',
    '["Equated Monthly Instalment", "Easy Money Interest", "Extra Monthly Income"]',
    0,
    'EMI is the fixed amount you pay every month to repay a loan with interest.',
    3
  ),
  (
    'Which is usually riskier?',
    '["Fixed Deposit", "Post Office savings", "Shares in the stock market"]',
    2,
    'Share prices go up and down. Fixed Deposits and Post Office savings are low-risk.',
    4
  ),
  (
    'What is the PM Mudra Yojana Shishu loan limit?',
    '["Up to ₹10,000", "Up to ₹50,000", "Up to ₹5 lakh"]',
    1,
    'The Shishu category of PM Mudra Yojana offers collateral-free loans up to ₹50,000 for micro-businesses.',
    5
  ),
  (
    'What is a CIBIL score used for?',
    '["To calculate your EMI", "To measure your creditworthiness", "To register your business"]',
    1,
    'A CIBIL (credit) score shows lenders how reliably you repay debts. A higher score means easier access to lower-interest loans.',
    6
  )
on conflict do nothing;

-- ============================================================
-- VERIFICATION QUERIES (run after the above to confirm)
-- ============================================================
-- select count(*) from schemes;           -- should be 8
-- select count(*) from quiz_questions;    -- should be 6
-- select * from schemes where 'all' = any(states) limit 3;
