
-- Revoke execute from anon for SECURITY DEFINER helpers (keep authenticated)
revoke execute on function public.is_community_member(uuid, uuid) from anon, public;
revoke execute on function public.is_community_admin(uuid, uuid) from anon, public;
revoke execute on function public.is_event_organizer(uuid, uuid) from anon, public;
revoke execute on function public.has_rsvp(uuid, uuid) from anon, public;
revoke execute on function public.can_view_event(uuid, uuid) from anon, public;
revoke execute on function public.handle_new_user() from anon, public;
revoke execute on function public.handle_new_community() from anon, public;
revoke execute on function public.handle_new_event() from anon, public;
revoke execute on function public.apply_waitlist_on_rsvp() from anon, public;
revoke execute on function public.promote_waitlist() from anon, public;
revoke execute on function public.set_updated_at() from anon, public;

grant execute on function public.is_community_member(uuid, uuid) to authenticated;
grant execute on function public.is_community_admin(uuid, uuid) to authenticated;
grant execute on function public.is_event_organizer(uuid, uuid) to authenticated;
grant execute on function public.has_rsvp(uuid, uuid) to authenticated;
grant execute on function public.can_view_event(uuid, uuid) to authenticated;

-- Fix search_path on set_updated_at (others already have it)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
