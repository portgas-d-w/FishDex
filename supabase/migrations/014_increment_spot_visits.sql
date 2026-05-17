-- Fonction RPC pour incrémenter nb_visites d'un spot
-- Utilisée par les server actions lors du démarrage d'une session.

CREATE OR REPLACE FUNCTION public.increment_spot_visits(spot_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.spots
  SET nb_visites = nb_visites + 1
  WHERE id = spot_id_param
    AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.increment_spot_visits(UUID) TO authenticated;
