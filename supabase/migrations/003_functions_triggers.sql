-- Auto-create profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recalculate opposite_score from score_events
CREATE OR REPLACE FUNCTION public.recalculate_opposite_score(p_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_total integer;
BEGIN
  SELECT COALESCE(SUM(points), 0) INTO v_total
  FROM public.score_events
  WHERE user_id = p_user_id;

  UPDATE public.profiles
  SET opposite_score = v_total, updated_at = now()
  WHERE id = p_user_id;
END;
$$;

-- Weekly leaderboard RPC
CREATE OR REPLACE FUNCTION public.get_weekly_leaderboard()
RETURNS TABLE (
  id           uuid,
  username     text,
  display_name text,
  avatar_url   text,
  weekly_score bigint,
  rank         bigint
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    COALESCE(SUM(se.points), 0) AS weekly_score,
    RANK() OVER (ORDER BY COALESCE(SUM(se.points), 0) DESC) AS rank
  FROM public.profiles p
  LEFT JOIN public.score_events se
    ON se.user_id = p.id
    AND se.event_date >= date_trunc('week', CURRENT_DATE)::date
  GROUP BY p.id, p.username, p.display_name, p.avatar_url
  ORDER BY weekly_score DESC
  LIMIT 50;
$$;

-- All-time leaderboard RPC
CREATE OR REPLACE FUNCTION public.get_alltime_leaderboard()
RETURNS TABLE (
  id           uuid,
  username     text,
  display_name text,
  avatar_url   text,
  total_score  integer,
  rank         bigint
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    id,
    username,
    display_name,
    avatar_url,
    opposite_score AS total_score,
    RANK() OVER (ORDER BY opposite_score DESC) AS rank
  FROM public.profiles
  ORDER BY opposite_score DESC
  LIMIT 50;
$$;

-- Update profiles.updated_at on change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
