-- ============================================================
-- STAC Engage — Service Hours Table
-- Run in Supabase SQL Editor
-- ============================================================

create table if not exists service_hours (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  org_name    text not null,
  date        date not null,
  hours       numeric(4,1) not null,
  description text default '',
  status      text default 'pending',
  admin_note  text default '',
  created_at  timestamptz default now()
);

alter table service_hours enable row level security;

create policy "Users can manage own hours" on service_hours
  for all using (auth.uid() = user_id);

create policy "Admins can read all hours" on service_hours
  for select using (true);

create policy "Admins can update hours" on service_hours
  for update using (true);

-- Auto-award points when approved
create or replace function award_service_points()
returns trigger language plpgsql security definer as $$
begin
  if NEW.status = 'approved' and OLD.status != 'approved' then
    update public.profiles
    set score = score + floor(NEW.hours * 10)::integer
    where id = NEW.user_id;
  end if;
  return NEW;
end;
$$;

drop trigger if exists on_service_approved on service_hours;
create trigger on_service_approved
  after update on service_hours
  for each row execute procedure award_service_points();
