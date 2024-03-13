"""
Moosh Flask Server.
"""
import re
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
load_dotenv()

from model import query_openai
from decorators import retry
from spotify_api import SpotifyAPI

@app.route("/ping", methods=["GET"])
@retry()
def ping():
  """Ping for liveness tests."""
  return "all good"

@app.route("/recommendations", methods=["POST"])
@retry()
def get_recommendations_with_seeds():
  access_token = request.headers.get('Authorization')
  if access_token:
    access_token = access_token.replace('Bearer ', '')

  body = request.json
  seed_tracks = body.get('seedTracks', '')
  num_recs = int(body.get('numRecs', 20))
  blacklisted_songs = body.get('blacklistedSongs', [])

  spotify_api = SpotifyAPI(access_token=access_token)

  recommendations = spotify_api.make_recommendations_from_seed_tracks(len(blacklisted_songs) + num_recs, seed_tracks)
  
  filtered_recommendations = [rec for rec in recommendations if rec['id'] not in blacklisted_songs]

  return filtered_recommendations[:num_recs]

@app.route("/prompt", methods=["POST"])
@retry()
def prompt_openai():
  """
  Endpoint: /prompt
  Method: POST
  Returns: Spotify recommendations.
  Requires: Prompt string in body
  Optional: If authorization token provided in header, user's top songs will be factored in
  """
  access_token = request.headers.get('Authorization')
  if access_token:
    access_token = access_token.replace('Bearer ', '')
  
  body = request.json
  prompt = body.get('prompt', '')
  num_recs = int(body.get('num_recs', 20))

  spotify_api = SpotifyAPI(access_token=access_token)

  seeds = None

  # If access token is provided, obtain user data to prime seed generation algorithm
  if access_token:

    artist_names = []
    track_names = []
    genres = set()

    top_artists_response = spotify_api.get_user_top_artists()
    top_tracks_response = spotify_api.get_user_top_tracks()

    if top_artists_response and 'items' in top_artists_response:
      for item in top_artists_response['items']:
         artist_names.append(item['name'])
         genres.update(item['genres'])

    if top_tracks_response and 'items' in top_tracks_response:
      for item in top_tracks_response['items']:
         track_names.append(item['name'])

    seeds = json.loads(query_openai(prompt, artist_names, track_names, list(genres)))
  # If access token not provided, get generic seeds to use
  else:
    seeds = json.loads(query_openai(prompt))
  
  # Replace artist and track names with their respective spotify IDs
  if "seed_artists" in seeds:
    artist_ids = spotify_api.artist_search(artists=re.split(",|, ", seeds["seed_artists"]))
    seeds["seed_artists"] = artist_ids
  else:
    seeds["seed_artists"] = None

  if "seed_tracks" in seeds:
    track_ids = spotify_api.track_search(tracks=re.split(",|, ", seeds["seed_tracks"]))
    seeds["seed_tracks"] = track_ids
  else:
    seeds["seed_tracks"] = None

  if "seed_genres" in seeds:
    seeds["seed_genres"] = re.split(",|, ", seeds["seed_genres"])
  else:
    seeds["seed_genres"] = None

  recommendations = spotify_api.make_recommendations(num_recs, 
                                                      seed_artists=seeds["seed_artists"],
                                                      seed_genres=seeds["seed_genres"],
                                                      seed_tracks=seeds["seed_tracks"],
                                                      target_acousticness=seeds["target_acousticness"],
                                                      target_danceability=seeds["target_danceability"],
                                                      target_energy=seeds["target_energy"],
                                                      target_instrumentalness=seeds["target_instrumentalness"],
                                                      target_valence=seeds["target_valence"])
  
  return recommendations
  
@app.route('/profile')
def get_user_profile():
  """
  Endpoint: /profile
  Method: GET
  Returns: Spotify user profile information.
  Requires: User authorization token to Spotify
  Error: If no authorization token given, return 401 Unauthorized
  """
  access_token = request.headers.get('Authorization')
  if access_token:
      access_token = access_token.replace('Bearer ', '')  # Assuming the token is sent as a Bearer token
      spotify_api = SpotifyAPI(access_token=access_token)
      user_profile = spotify_api.get_user_profile()
      return jsonify(user_profile)
  else:
      return jsonify({"error": "Authorization token is missing"}), 401


@app.route('/top-tracks', methods=['GET'])
def get_top_tracks():
  """
  Endpoint: /top-tracks
  Method: GET
  Returns: The Spotify user's top tracks based on the provided access token.
  Requires: User authorization token to Spotify passed as a Bearer token in the Authorization header.
  Error: If no authorization token is provided, returns 401 Unauthorized.
  """
  access_token = request.headers.get('Authorization')
  if access_token:
      access_token = access_token.replace('Bearer ', '')
      spotify_api = SpotifyAPI(access_token=access_token)
      top_tracks = spotify_api.get_user_top_tracks()
      return jsonify(top_tracks)
  else:
      return jsonify({"error": "Authorization token is missing"}), 401

if __name__ == "__main__":
  app.run()