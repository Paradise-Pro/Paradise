-- Clear all records without deleting tables
delete from user_guilds;
delete from users;

-- Table of users (Discord users)
create table if not exists users (
  id text primary key,
  email text,
  username text,
  avatar text,
  locale text,
  verified boolean,
  access_token text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Table of guilds each user belongs to
create table if not exists user_guilds (
  user_id text references users(id) on delete cascade,
  guild_id text,
  guild_name text,
  is_owner boolean,
  is_admin boolean,
  is_manager boolean,
  raw_permissions bigint,
  joined_at timestamptz,
  primary key (user_id, guild_id)
);

-- Embed queue
create table embed_queue (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  color text,
  channel_id text,
  status text default 'pending',
  created_at timestamp default current_timestamp
);

-- Ticket Table
create table tickets (
  id uuid primary key,
  title text not null,
  description text,
  category text not null,
  created_by text not null,
  visibility text[],
  status text default 'open',
  created_at timestamp default current_timestamp,
  closed_at timestamp,
  channel_id text
);

-- Create ticket_messages table
create table ticket_messages (
  id uuid primary key,
  channel_id text not null,
  author_id text not null,
  author_tag text,
  avatar text,
  content text,
  created_at timestamp default current_timestamp
);

-- Giveaways
drop table if exists giveaways cascade;
create table giveaways (
  id uuid primary key default gen_random_uuid(),
  prize text not null,
  description text,
  creator_id text not null,
  creator_tag text not null,
  creator_avatar text,
  status text not null default 'active', -- active | cancelled | ended
  processing boolean not null default false, -- ✅ anti-spam flag
  participants jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  ends_at timestamptz not null
);

-- Logs
drop table if exists logs cascade;
create table logs (
  id uuid primary key default gen_random_uuid(),
  type text not null, -- giveaway_start | giveaway_cancel | giveaway_reroll | giveaway_end
  data jsonb,
  timestamp timestamptz default now()
);