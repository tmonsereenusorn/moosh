import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials

class SpotifyAPI:
    def __init__(self, access_token=None):
        self.client_credentials_manager = SpotifyClientCredentials()
        self.access_token = access_token
        self.sp = self._init_spotipy_client(access_token)
    
    def _init_spotipy_client(self, access_token):
        if access_token:
            # Initialize with user's access token for personalized queries
            return spotipy.Spotify(auth=access_token)
        else:
            # Fallback to client credentials for non-personalized queries
            return spotipy.Spotify(client_credentials_manager=self.client_credentials_manager)
        
    # Checks to see if class was initialized with an access token
    def _ensure_access_token(self):
        if not self.access_token:
            raise Exception("An access token is required for this operation.")
    
    # Returns user profile from access token
    def get_user_profile(self):
        self._ensure_access_token()

        return self.sp.current_user()
    
    # Returns user's top tracks
    def get_user_top_tracks(self, time_range='medium_term', limit=60):
        self._ensure_access_token()

        try:
            return self.sp.current_user_top_tracks(limit=limit, time_range=time_range)
        except spotipy.SpotifyException as e:
            print(f"Could not retrieve user's top tracks with error: {e}")
            return None
    
    # Returns user's top artists
    def get_user_top_artists(self, time_range='medium_term', limit=60):
        self._ensure_access_token()

        try:
            return self.sp.current_user_top_artists(limit=limit, time_range=time_range)
        except spotipy.SpotifyException as e:
            print(f"Could not retrieve user's top artists with error: {e}")
            return None
    
    # Search for multiple artists and tracks, returning their Spotify ids.
    def mass_search(self, artists, track):
        artist_ids = []
        track_id = ""

        for artist in artists:
            artist_ids.append(self.spotify_search(item=artist, type="artist"))

        track_id = self.spotify_search(item=track, type="track")

        return { "artist_ids": artist_ids, "track_id": track_id }
    
    #Use Spotify API search with given query and type. Return item id.
    def spotify_search(self, item, type):
        try:
            resp = self.sp.search(q=f"{type}:{item}", type=type, limit=1)
            spotify_id = resp.get(f"{type}s").get("items")[0].get("id")
            return spotify_id
        except spotipy.SpotifyException as e:
            print(f"Exception: {e}")
            return ""

    # Make recommendations using Spotify's Recommendation API based on GPT's seeds.
    def make_recommendations(self, seed_artists, seed_genres, seed_tracks, target_acousticness, 
                         target_danceability, target_energy, target_instrumentalness, target_valence):
        limit = 20
        country = "US"
        kwargs = {
            "target_acousticness": target_acousticness,
            "target_danceability": target_danceability,
            "target_energy": target_energy,
            "target_instrumentalness": target_instrumentalness,
            "target_valence": target_valence
        }
        try:
            data = self.sp.recommendations(
                seed_artists,
                seed_genres,
                seed_tracks, # only gives one track
                limit,
                country,
                **kwargs
            )
            resp = [
                {
                    "uri": track.get("uri"),
                    "artist": track.get('artists')[0].get("name"),
                    "title": track.get("name"),
                    "url": track.get("external_urls").get("spotify"),
                    "preview": track.get("preview_url"),
                    "duration": track.get("duration_ms"),
                } for track in data.get("tracks")
            ]
            return resp
        except spotipy.SpotifyException as e:
            print(f"Exception: {e}")
            return {}

    



