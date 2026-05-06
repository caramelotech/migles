
-- ============================================================
-- ENUMS
-- ============================================================
create type public.community_type as enum ('public', 'private');
create type public.community_member_role as enum ('admin', 'member');
create type public.community_member_status as enum ('active', 'pending', 'banned');
create type public.event_visibility as enum ('private', 'community');
create type public.event_status as enum ('draft', 'published', 'cancelled', 'finished');
create type public.rsvp_status as enum ('pending', 'confirmed', 'declined', 'waitlisted');

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- COMMUNITIES
-- ============================================================
create table public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  avatar_url text,
  type public.community_type not null default 'public',
  allow_invite_link boolean not null default true,
  allow_request_to_join boolean not null default true,
  allow_free_join boolean not null default true,
  invite_code text not null default substr(md5(gen_random_uuid()::text), 1, 12) unique,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger communities_set_updated_at
  before update on public.communities
  for each row execute function public.set_updated_at();

alter table public.communities enable row level security;

-- ============================================================
-- COMMUNITY MEMBERS
-- ============================================================
create table public.community_members (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.community_member_role not null default 'member',
  status public.community_member_status not null default 'active',
  joined_at timestamptz not null default now(),
  unique (community_id, user_id)
);

alter table public.community_members enable row level security;

create index community_members_user_idx on public.community_members(user_id);
create index community_members_community_idx on public.community_members(community_id);

-- Security definer helpers (avoid recursive RLS)
create or replace function public.is_community_member(_community_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.community_members
    where community_id = _community_id
      and user_id = _user_id
      and status = 'active'
  );
$$;

create or replace function public.is_community_admin(_community_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.community_members
    where community_id = _community_id
      and user_id = _user_id
      and status = 'active'
      and role = 'admin'
  );
$$;

-- Communities policies
create policy "Public communities visible to all, private to members"
  on public.communities for select
  using (
    type = 'public'
    or (auth.uid() is not null and public.is_community_member(id, auth.uid()))
    or created_by = auth.uid()
  );

create policy "Authenticated users can create communities"
  on public.communities for insert
  with check (auth.uid() = created_by);

create policy "Admins can update communities"
  on public.communities for update
  using (public.is_community_admin(id, auth.uid()));

create policy "Admins can delete communities"
  on public.communities for delete
  using (public.is_community_admin(id, auth.uid()));

-- Auto-add creator as admin
create or replace function public.handle_new_community()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.community_members (community_id, user_id, role, status)
  values (new.id, new.created_by, 'admin', 'active');
  return new;
end;
$$;

create trigger on_community_created
  after insert on public.communities
  for each row execute function public.handle_new_community();

-- Community members policies
create policy "Members visible to community members, public communities open"
  on public.community_members for select
  using (
    public.is_community_member(community_id, auth.uid())
    or exists (
      select 1 from public.communities c
      where c.id = community_id and c.type = 'public'
    )
    or user_id = auth.uid()
  );

create policy "Users can request to join or join free public"
  on public.community_members for insert
  with check (
    auth.uid() = user_id
    and role = 'member'
  );

create policy "Admins can manage members; users can leave"
  on public.community_members for update
  using (
    public.is_community_admin(community_id, auth.uid())
    or auth.uid() = user_id
  );

create policy "Admins can remove members; users can remove themselves"
  on public.community_members for delete
  using (
    public.is_community_admin(community_id, auth.uid())
    or auth.uid() = user_id
  );

-- ============================================================
-- EVENTS
-- ============================================================
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  starts_at timestamptz not null,
  capacity integer,
  visibility public.event_visibility not null default 'private',
  status public.event_status not null default 'published',
  community_id uuid references public.communities(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  invite_code text not null default substr(md5(gen_random_uuid()::text), 1, 12) unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint capacity_positive check (capacity is null or capacity > 0)
);

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

alter table public.events enable row level security;

-- ============================================================
-- EVENT ORGANIZERS
-- ============================================================
create table public.event_organizers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  added_at timestamptz not null default now(),
  unique (event_id, user_id)
);

alter table public.event_organizers enable row level security;

create or replace function public.is_event_organizer(_event_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.event_organizers
    where event_id = _event_id and user_id = _user_id
  );
$$;

-- Auto-add creator as organizer
create or replace function public.handle_new_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.event_organizers (event_id, user_id)
  values (new.id, new.created_by);
  return new;
end;
$$;

create trigger on_event_created
  after insert on public.events
  for each row execute function public.handle_new_event();

-- ============================================================
-- RSVPs
-- ============================================================
create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.rsvp_status not null default 'pending',
  waitlist_position integer,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create trigger rsvps_set_updated_at
  before update on public.rsvps
  for each row execute function public.set_updated_at();

alter table public.rsvps enable row level security;

create index rsvps_event_idx on public.rsvps(event_id, status);

create or replace function public.has_rsvp(_event_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.rsvps where event_id = _event_id and user_id = _user_id
  );
$$;

-- Helper: can user view event
create or replace function public.can_view_event(_event_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.events e
    where e.id = _event_id
      and (
        e.created_by = _user_id
        or public.is_event_organizer(e.id, _user_id)
        or public.has_rsvp(e.id, _user_id)
        or (e.visibility = 'community' and e.community_id is not null
            and public.is_community_member(e.community_id, _user_id))
      )
  );
$$;

-- Events policies
create policy "Users can view events they are part of"
  on public.events for select
  using (
    auth.uid() is not null and (
      created_by = auth.uid()
      or public.is_event_organizer(id, auth.uid())
      or public.has_rsvp(id, auth.uid())
      or (visibility = 'community' and community_id is not null
          and public.is_community_member(community_id, auth.uid()))
    )
  );

create policy "Authenticated users can create events"
  on public.events for insert
  with check (
    auth.uid() = created_by
    and (
      community_id is null
      or public.is_community_admin(community_id, auth.uid())
    )
  );

create policy "Organizers can update events"
  on public.events for update
  using (public.is_event_organizer(id, auth.uid()));

create policy "Organizers can delete events"
  on public.events for delete
  using (public.is_event_organizer(id, auth.uid()));

-- Event organizers policies
create policy "Organizers visible to event viewers"
  on public.event_organizers for select
  using (public.can_view_event(event_id, auth.uid()));

create policy "Organizers can add other organizers"
  on public.event_organizers for insert
  with check (public.is_event_organizer(event_id, auth.uid()) or auth.uid() = user_id);

create policy "Organizers can remove organizers"
  on public.event_organizers for delete
  using (public.is_event_organizer(event_id, auth.uid()));

-- RSVPs policies
create policy "RSVPs visible to event viewers and the user themselves"
  on public.rsvps for select
  using (
    user_id = auth.uid()
    or public.can_view_event(event_id, auth.uid())
  );

create policy "Users can RSVP to events they can view, organizers can invite"
  on public.rsvps for insert
  with check (
    (auth.uid() = user_id and public.can_view_event(event_id, auth.uid()))
    or public.is_event_organizer(event_id, auth.uid())
  );

create policy "Users can update own RSVP, organizers can update any"
  on public.rsvps for update
  using (
    auth.uid() = user_id
    or public.is_event_organizer(event_id, auth.uid())
  );

create policy "Users can remove own RSVP, organizers can remove any"
  on public.rsvps for delete
  using (
    auth.uid() = user_id
    or public.is_event_organizer(event_id, auth.uid())
  );

-- ============================================================
-- WAITLIST AUTOMATION
-- ============================================================
-- On RSVP insert/update: if event has capacity and confirmed count >= capacity,
-- new confirmed RSVPs become waitlisted.
create or replace function public.apply_waitlist_on_rsvp()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _capacity integer;
  _confirmed_count integer;
  _next_position integer;
begin
  if new.status = 'confirmed' then
    select capacity into _capacity from public.events where id = new.event_id;

    if _capacity is not null then
      select count(*) into _confirmed_count
      from public.rsvps
      where event_id = new.event_id
        and status = 'confirmed'
        and id <> new.id;

      if _confirmed_count >= _capacity then
        select coalesce(max(waitlist_position), 0) + 1 into _next_position
        from public.rsvps
        where event_id = new.event_id and status = 'waitlisted';

        new.status := 'waitlisted';
        new.waitlist_position := _next_position;
      else
        new.waitlist_position := null;
      end if;
    else
      new.waitlist_position := null;
    end if;
  end if;

  if new.status in ('declined', 'pending') then
    new.waitlist_position := null;
  end if;

  if new.status in ('confirmed', 'declined', 'waitlisted') and new.responded_at is null then
    new.responded_at := now();
  end if;

  return new;
end;
$$;

create trigger rsvps_apply_waitlist
  before insert or update on public.rsvps
  for each row execute function public.apply_waitlist_on_rsvp();

-- After delete or status change away from confirmed: promote next in waitlist
create or replace function public.promote_waitlist()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _event_id uuid;
  _capacity integer;
  _confirmed_count integer;
  _next_rsvp record;
begin
  if tg_op = 'DELETE' then
    _event_id := old.event_id;
    if old.status <> 'confirmed' then return old; end if;
  else
    _event_id := new.event_id;
    if old.status = 'confirmed' and new.status = 'confirmed' then return new; end if;
    if new.status = 'confirmed' then return new; end if;
  end if;

  select capacity into _capacity from public.events where id = _event_id;
  if _capacity is null then
    if tg_op = 'DELETE' then return old; else return new; end if;
  end if;

  select count(*) into _confirmed_count
  from public.rsvps
  where event_id = _event_id and status = 'confirmed';

  while _confirmed_count < _capacity loop
    select * into _next_rsvp
    from public.rsvps
    where event_id = _event_id and status = 'waitlisted'
    order by waitlist_position asc
    limit 1;

    exit when _next_rsvp.id is null;

    update public.rsvps
    set status = 'confirmed', waitlist_position = null
    where id = _next_rsvp.id;

    _confirmed_count := _confirmed_count + 1;
  end loop;

  if tg_op = 'DELETE' then return old; else return new; end if;
end;
$$;

create trigger rsvps_promote_after_change
  after update or delete on public.rsvps
  for each row execute function public.promote_waitlist();

-- ============================================================
-- COMMENTS
-- ============================================================
create table public.event_comments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.event_comments(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger event_comments_set_updated_at
  before update on public.event_comments
  for each row execute function public.set_updated_at();

alter table public.event_comments enable row level security;
create index event_comments_event_idx on public.event_comments(event_id);

create policy "Comments visible to event viewers"
  on public.event_comments for select
  using (public.can_view_event(event_id, auth.uid()));

create policy "Event viewers can comment"
  on public.event_comments for insert
  with check (
    auth.uid() = user_id
    and public.can_view_event(event_id, auth.uid())
  );

create policy "Authors can update own comments"
  on public.event_comments for update
  using (auth.uid() = user_id);

create policy "Authors and organizers can delete comments"
  on public.event_comments for delete
  using (
    auth.uid() = user_id
    or public.is_event_organizer(event_id, auth.uid())
  );
