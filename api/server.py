"""
Moosh Flask Server.
"""
import re
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
cors = CORS(app)
load_dotenv()

from model import query_openai
from decorators import retry
from spotify_api import SpotifyAPI

@app.route("/ping", methods=["GET"])
def ping():
  """Ping for liveness tests."""
  return "all good"

@retry(max_retries=5, backoff=1)
@app.route("/prompt", methods=["POST"])
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
  
  
  try:
    spotify_ids = spotify_api.mass_search(artists=re.split(",|, ", seeds["seed_artists"]), track=seeds["seed_tracks"])
    seeds["seed_artists"] = spotify_ids.get("artist_ids")
    seeds["seed_tracks"] = [spotify_ids.get("track_id")]
    seeds["seed_genres"] = re.split(",|, ", seeds["seed_genres"])

    return spotify_api.make_recommendations(**seeds)
  except Exception as e:
    return f"Exception: {e}", 500
  
"""
Endpoint: /profile
Method: GET
Returns: Spotify user profile information.
Requires: User authorization token to Spotify
Error: If no authorization token given, return 401 Unauthorized
"""
@app.route('/profile')
def get_user_profile():
  access_token = request.headers.get('Authorization')
  if access_token:
      access_token = access_token.replace('Bearer ', '')  # Assuming the token is sent as a Bearer token
      spotify_api = SpotifyAPI(access_token=access_token)
      user_profile = spotify_api.get_user_profile()
      return jsonify(user_profile)
  else:
      return jsonify({"error": "Authorization token is missing"}), 401

"""
Endpoint: /top-tracks
Method: GET
Returns: The Spotify user's top tracks based on the provided access token.
Requires: User authorization token to Spotify passed as a Bearer token in the Authorization header.
Error: If no authorization token is provided, returns 401 Unauthorized.
"""
@app.route('/top-tracks', methods=['GET'])
def get_top_tracks():
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