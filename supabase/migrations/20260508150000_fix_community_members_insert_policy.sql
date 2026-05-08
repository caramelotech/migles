-- Allow admins to add members to their communities
DROP POLICY IF EXISTS "Users can request to join or join free public" ON public.community_members;

CREATE POLICY "Users can join; admins can add members"
  ON public.community_members FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id AND role = 'member')
    OR public.is_community_admin(community_id, auth.uid())
  );
