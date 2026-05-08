-- Allow any authenticated user to fetch an event by its invite code.
-- SECURITY DEFINER bypasses the events RLS policy, which would otherwise
-- block users who are not yet organizers/RSVPs/community members.
CREATE OR REPLACE FUNCTION public.get_event_by_invite_code(p_code text)
RETURNS SETOF public.events
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.events
  WHERE invite_code = p_code
    AND status = 'published'
    AND auth.uid() IS NOT NULL;
$$;
