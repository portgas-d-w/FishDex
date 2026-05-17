-- Rendements décroissants invisibles : réduit le XP de base selon le nombre de captures du jour.
-- La capture courante est déjà insérée quand cette fonction est appelée, d'où le seuil <=1.
CREATE OR REPLACE FUNCTION public.apply_diminishing_returns(
  base_xp INTEGER,
  user_id_param UUID,
  capture_date DATE
) RETURNS INTEGER AS $$
DECLARE
  captures_today INTEGER;
  multiplier NUMERIC;
BEGIN
  SELECT COUNT(*) INTO captures_today
  FROM public.catches
  WHERE user_id = user_id_param
    AND DATE(date_capture) = capture_date;

  multiplier := CASE
    WHEN captures_today <= 1 THEN 1.0   -- 1re capture du jour
    WHEN captures_today = 2  THEN 0.8
    WHEN captures_today = 3  THEN 0.6
    ELSE 0.4
  END;

  RETURN FLOOR(base_xp * multiplier);
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.apply_diminishing_returns(integer, uuid, date) TO authenticated;
