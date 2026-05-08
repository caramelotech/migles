-- Add username to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_format
  CHECK (username IS NULL OR username ~ '^[a-z0-9_]{3,30}$');

-- Add slug to communities
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.communities ADD CONSTRAINT communities_slug_key UNIQUE (slug);
ALTER TABLE public.communities ADD CONSTRAINT communities_slug_format
  CHECK (slug IS NULL OR slug ~ '^[a-z0-9-]{3,50}$');

-- ---------------------------------------------------------------
-- Trigger: auto-generate username on profile INSERT
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_username()
RETURNS TRIGGER AS $$
DECLARE
  base_name text;
  candidate text;
  counter   int := 0;
BEGIN
  IF NEW.username IS NOT NULL THEN
    RETURN NEW;
  END IF;

  base_name := lower(regexp_replace(coalesce(NEW.display_name, 'user'), '[^a-z0-9]', '_', 'g'));
  base_name := regexp_replace(base_name, '_+', '_', 'g');
  base_name := trim('_' FROM base_name);
  IF base_name = '' THEN base_name := 'user'; END IF;
  base_name := left(base_name, 25);

  candidate := base_name;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = candidate AND id != NEW.id) LOOP
    counter   := counter + 1;
    candidate := base_name || '_' || counter::text;
  END LOOP;

  NEW.username := candidate;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER profiles_username_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.generate_username();

-- ---------------------------------------------------------------
-- Trigger: auto-generate slug on community INSERT
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_community_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug text;
  candidate text;
  counter   int := 0;
BEGIN
  IF NEW.slug IS NOT NULL THEN
    RETURN NEW;
  END IF;

  base_slug := lower(regexp_replace(NEW.name, '[^a-z0-9]', '-', 'g'));
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim('-' FROM base_slug);
  IF base_slug = '' THEN base_slug := 'comunidade'; END IF;
  base_slug := left(base_slug, 45);

  candidate := base_slug;
  WHILE EXISTS (SELECT 1 FROM public.communities WHERE slug = candidate AND id != NEW.id) LOOP
    counter   := counter + 1;
    candidate := base_slug || '-' || counter::text;
  END LOOP;

  NEW.slug := candidate;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER communities_slug_trigger
  BEFORE INSERT ON public.communities
  FOR EACH ROW EXECUTE FUNCTION public.generate_community_slug();

-- ---------------------------------------------------------------
-- Backfill existing profiles
-- ---------------------------------------------------------------
DO $$
DECLARE
  rec       RECORD;
  base_name text;
  candidate text;
  counter   int;
BEGIN
  FOR rec IN SELECT id, display_name FROM public.profiles WHERE username IS NULL LOOP
    base_name := lower(regexp_replace(coalesce(rec.display_name, 'user'), '[^a-z0-9]', '_', 'g'));
    base_name := regexp_replace(base_name, '_+', '_', 'g');
    base_name := trim('_' FROM base_name);
    IF base_name = '' THEN base_name := 'user'; END IF;
    base_name := left(base_name, 25);

    counter   := 0;
    candidate := base_name;
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = candidate) LOOP
      counter   := counter + 1;
      candidate := base_name || '_' || counter::text;
    END LOOP;

    UPDATE public.profiles SET username = candidate WHERE id = rec.id;
  END LOOP;
END $$;

-- ---------------------------------------------------------------
-- Backfill existing communities
-- ---------------------------------------------------------------
DO $$
DECLARE
  rec       RECORD;
  base_slug text;
  candidate text;
  counter   int;
BEGIN
  FOR rec IN SELECT id, name FROM public.communities WHERE slug IS NULL LOOP
    base_slug := lower(regexp_replace(rec.name, '[^a-z0-9]', '-', 'g'));
    base_slug := regexp_replace(base_slug, '-+', '-', 'g');
    base_slug := trim('-' FROM base_slug);
    IF base_slug = '' THEN base_slug := 'comunidade'; END IF;
    base_slug := left(base_slug, 45);

    counter   := 0;
    candidate := base_slug;
    WHILE EXISTS (SELECT 1 FROM public.communities WHERE slug = candidate) LOOP
      counter   := counter + 1;
      candidate := base_slug || '-' || counter::text;
    END LOOP;

    UPDATE public.communities SET slug = candidate WHERE id = rec.id;
  END LOOP;
END $$;
