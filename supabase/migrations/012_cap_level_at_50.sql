-- Plafonne level_from_xp à 50. Au-delà, le système Maîtrises prend le relais.
CREATE OR REPLACE FUNCTION public.level_from_xp(xp INTEGER)
RETURNS INTEGER AS $$
  SELECT LEAST(50, GREATEST(1, FLOOR(1 + SQRT(GREATEST(0, xp)::numeric / 100))::integer));
$$ LANGUAGE SQL IMMUTABLE;

-- Recorrige les lignes user_xp qui auraient un level > 50
UPDATE public.user_xp
SET level = 50
WHERE level > 50;
