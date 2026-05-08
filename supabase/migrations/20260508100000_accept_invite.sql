-- Resolves the circular RLS dependency on the invite flow:
-- inserting an RSVP requires can_view_event, which requires an RSVP.
-- SECURITY DEFINER bypasses RLS; the invite code is the authorization token.
CREATE OR REPLACE FUNCTION public.accept_invite(
  p_code   text,
  p_status public.rsvp_status
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _event_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT id INTO _event_id
  FROM public.events
  WHERE invite_code = p_code
    AND status = 'published';

  IF _event_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired invite code';
  END IF;

  INSERT INTO public.rsvps (event_id, user_id, status)
  VALUES (_event_id, auth.uid(), p_status)
  ON CONFLICT (event_id, user_id) DO UPDATE
    SET status = EXCLUDED.status,
        updated_at = now();

  RETURN _event_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.accept_invite(text, public.rsvp_status) FROM anon;
GRANT EXECUTE ON FUNCTION public.accept_invite(text, public.rsvp_status) TO authenticated;
