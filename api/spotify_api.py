import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

sp = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())

def get_user(user):
    try:
        response = sp.user(user)
        return response
    except Exception as e:
        print("Unable to get user from Spotify")
        print(f"Exception: {e}")
        return e

def spotipy_search(query, type, limit=1):
    try:
        response = sp.search(q=query, type=type, limit=limit)
        return response
    except Exception as e:
        print("Unable to search Spotify")
        print(f"Exception: {e}")
        return e