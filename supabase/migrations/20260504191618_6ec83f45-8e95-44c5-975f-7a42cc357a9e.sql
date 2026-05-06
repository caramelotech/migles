CREATE OR REPLACE FUNCTION public.is_event_organizer(_event_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  select exists (
    select 1
    from public.events
    where id = _event_id
      and created_by = _user_id
  )
  or exists (
    select 1
    from public.event_organizers
    where event_id = _event_id
      and user_id = _user_id
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_community_admin(_community_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  select exists (
    select 1
    from public.communities
    where id = _community_id
      and created_by = _user_id
  )
  or exists (
    select 1
    from public.community_members
    where community_id = _community_id
      and user_id = _user_id
      and status = 'active'
      and role = 'admin'
  );
$function$;

DROP TRIGGER IF EXISTS on_event_created ON public.events;
DROP TRIGGER IF EXISTS on_event_created_add_organizer ON public.events;
CREATE TRIGGER on_event_created_add_organizer
AFTER INSERT ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_event();

DROP TRIGGER IF EXISTS on_community_created ON public.communities;
DROP TRIGGER IF EXISTS on_community_created_add_admin ON public.communities;
CREATE TRIGGER on_community_created_add_admin
AFTER INSERT ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_community();