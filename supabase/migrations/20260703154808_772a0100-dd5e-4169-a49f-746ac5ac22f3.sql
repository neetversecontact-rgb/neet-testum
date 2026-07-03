-- Enable RLS + policies on test_questions (currently open)
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.test_questions TO authenticated;
GRANT ALL ON public.test_questions TO service_role;

CREATE POLICY "Anyone signed in can read test questions"
  ON public.test_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage test questions"
  ON public.test_questions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Leaderboard needs to see other users' display names
CREATE POLICY "Signed-in users can read basic profile info"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);