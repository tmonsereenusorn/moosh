import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

sp = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())

def get_user(user):
    try:
        response = sp.user(user)
        return response
    except spotipy.SpotifyException as e:
        print(f"Exception: {e}")
        return {}
    
def spotify_search(item, type):
    """Use Spotify API search with given query and type. Return item id."""
    try:
        resp = sp.search(q=f"{type}:{item}", type=type, limit=1)
        spotify_id = resp.get(f"{type}s").get("items")[0].get("id")
        return spotify_id
    except spotipy.SpotifyException as e:
        print(f"Exception: {e}")
        return ""

def mass_search(artists, track):
    """Search for multiple artists and tracks, returning their Spotify ids."""
    artist_ids = []
    track_id = ""

    for artist in artists:
        artist_ids.append(spotify_search(item=artist, type="artist"))
    
    track_id = spotify_search(item=track, type="track")

    return { "artist_ids": artist_ids, "track_id": track_id }

def make_recommendations(seed_artists, seed_genres, seed_tracks, target_acousticness, 
                         target_danceability, target_energy, target_instrumentalness, target_valence):
    """Make recommendations using Spotify's Recommendation API based on GPT's seeds."""
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
        data = sp.recommendations(
            seed_artists,
            seed_genres,
            seed_tracks, # only gives one track
            limit,
            country,
            **kwargs
        )
        return data
    except spotipy.SpotifyException as e:
        print(f"Exception: {e}")
        return {}
