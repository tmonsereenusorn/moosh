class Helpers:
  def parse_curator_settings(settings):
      """Parse the curator settings to abstract logic from recommendation endpoints"""
      num_recs = int(settings.get('numSongs', 20))
      danceability = settings.get('danceability')
      energy = settings.get('energy')
      acousticness = settings.get('acousticness')

      
      target_danceability = danceability.get('threshold', 5) / 10 if danceability.get('enabled', False) else None
      target_energy = energy.get('threshold', 5) / 10 if energy.get('enabled', False) else None
      target_acousticness = acousticness.get('threshold', 5) / 10 if acousticness.get('enabled', False) else None

      print(f"TARGET ENERGY: {target_energy}", flush=True)
      

      return num_recs, target_danceability, target_energy, target_acousticness