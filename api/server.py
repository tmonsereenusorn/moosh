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
from helpers import Helpers

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
  
  # Parse curator settings
  settings = body.get('settings', { 'numSongs': 20 })
  num_recs, _, _, _, _ = Helpers.parse_curator_settings(settings)

  blacklisted_songs = body.get('blacklistedSongs', [])

  spotify_api = SpotifyAPI(access_token=access_token)
  stock_synopsis = "This is a new playlist replacing the deselected tracks with tracks similar to the ones remaining in the playlist."
  response = spotify_api.make_recommendations(len(blacklisted_songs) + num_recs, stock_synopsis, seed_tracks)
  recommendations = response['tracks']
  
  filtered_recommendations = [rec for rec in recommendations if rec['id'] not in blacklisted_songs][:num_recs]
  response = {
    "recommendations": filtered_recommendations,
    "synopsis": stock_synopsis
  }

  return response

@app.route("/prompt", methods=["POST"])
@retry()
def prompt_openai():
  """
  Endpoint: /prompt
  Method: POST
  Returns: Spotify recommendations.
  Requires: Prompt string in body
  Optional: If authorization token provided in header, user's top songs will be factored in.
  """
  access_token = request.headers.get('Authorization')
  if access_token:
    access_token = access_token.replace('Bearer ', '')
  
  body = request.json
  prompt = body.get('prompt', '')
  curr_conversation = body.get('currConversation', None)

  # Parse curator settings
  settings = body.get('settings', { 'numSongs': 20 })
  num_recs, gpt4, target_danceability, target_energy, target_acousticness = Helpers.parse_curator_settings(settings)

  model_choice = "gpt-4-turbo" if gpt4 else None
  
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

    seeds_string, conversation = query_openai(prompt, curr_conversation, model_chosen=model_choice, top_artists=artist_names, top_tracks=track_names, top_genres=list(genres))
    seeds = json.loads(seeds_string)
  # If access token not provided, get generic seeds to use
  else:
    seeds_string, conversation = query_openai(prompt, curr_conversation, model_chosen=model_choice)
    seeds = json.loads(seeds_string)
  
  # Replace artist and track names with their respective spotify IDs
  if "seed_artists" in seeds and len(seeds["seed_artists"]) > 0:
    artist_ids = spotify_api.artist_search(artists=re.split(",|, ", seeds["seed_artists"]))
    seeds["seed_artists"] = artist_ids
  else:
    seeds["seed_artists"] = None

  if "seed_tracks" in seeds and len(seeds["seed_tracks"]) > 0:
    track_ids = spotify_api.track_search(tracks=re.split(",|, ", seeds["seed_tracks"]))
    seeds["seed_tracks"] = track_ids
  else:
    seeds["seed_tracks"] = None

  if "seed_genres" in seeds and len(seeds["seed_genres"]) > 0:
    seeds["seed_genres"] = re.split(",|, ", seeds["seed_genres"])
  else:
    seeds["seed_genres"] = None

  recommendations = spotify_api.make_recommendations(num_recs=num_recs,
                                                     synopsis=seeds["synopsis"],
                                                     seed_tracks=seeds["seed_tracks"],
                                                     seed_artists=seeds["seed_artists"],
                                                     seed_genres=seeds["seed_genres"],
                                                     target_acousticness=target_acousticness or seeds["target_acousticness"],
                                                     target_danceability=target_danceability or seeds["target_danceability"],
                                                     target_energy=target_energy or seeds["target_energy"],
                                                     target_instrumentalness=seeds["target_instrumentalness"],
                                                     target_valence=seeds["target_valence"])
  
  response = {
    "recommendations": recommendations,
    "conversation": conversation
  }
  
  return jsonify(response)
  
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