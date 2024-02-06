import spotipy

sp = spotipy.Spotify()

def spotipy_search(query, type):
    try:
        response = sp.search(q=query, type=type)
        return response
    except Exception as e:
        print("Unable to search Spotify")
        print(f"Exception: {e}")
        return e