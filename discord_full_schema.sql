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