-- Profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  created_at timestamptz default now()
);

-- Flowers
do $$ begin
  create type flower_type as enum ('limited', 'standard');
exception when duplicate_object then null; end $$;

create table if not exists flowers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type flower_type not null,
  category text not null,
  price_cents int not null,
  stock int,
  media_url text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Orders
do $$ begin
  create type plan_type as enum ('30d', '365d');
exception when duplicate_object then null; end $$;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  flower_id uuid references flowers(id),
  plan plan_type not null,
  token_grant int not null,
  token_used int not null default 0,
  buyer_name text,
  recipient_name text,
  theme text,
  song_id text,
  gift_code text unique,
  status text not null check (status in ('pending','paid','failed','refunded')) default 'pending',
  created_at timestamptz default now()
);

-- Daily messages
create table if not exists daily_messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  day_index int not null,
  content text not null,
  generated_by text not null check (generated_by in ('ai','manual')),
  created_at timestamptz default now(),
  unique(order_id, day_index)
);

-- AI events
create table if not exists ai_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  kind text not null check (kind in ('generate','regenerate')),
  tokens int not null,
  created_at timestamptz default now()
);

-- Stock decrement trigger
create or replace function dec_stock() returns trigger as $$
begin
  if (select type from flowers where id = NEW.flower_id) = 'limited' then
    update flowers set stock = stock - 1 where id = NEW.flower_id and stock > 0;
    if not found then
      raise exception 'Out of stock';
    end if;
  end if;
  return NEW;
end;$$ language plpgsql;

drop trigger if exists trg_dec_stock on orders;
create trigger trg_dec_stock before insert on orders
for each row execute function dec_stock();

-- RLS
alter table profiles enable row level security;
alter table orders enable row level security;
alter table daily_messages enable row level security;
alter table ai_events enable row level security;

-- Profiles: user can see own profile
do $$ begin
  create policy profiles_self_select on profiles for select using (id = auth.uid());
exception when duplicate_object then null; end $$;

-- Orders: owner can select/insert/update
do $$ begin
  create policy orders_owner_select on orders for select using (user_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy orders_owner_insert on orders for insert with check (user_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy orders_owner_update on orders for update using (user_id = auth.uid());
exception when duplicate_object then null; end $$;

-- Daily messages: owner
do $$ begin
  create policy daily_messages_owner_select on daily_messages for select using (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create policy daily_messages_owner_upsert on daily_messages for insert with check (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create policy daily_messages_owner_update on daily_messages for update using (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

-- AI events: owner
do $$ begin
  create policy ai_events_owner_select on ai_events for select using (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create policy ai_events_owner_insert on ai_events for insert with check (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );
exception when duplicate_object then null; end $$;


