"""
Moosh Flask Server.
"""
import re
import json
from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
cors = CORS(app)
load_dotenv()

from model import query_openai
from spotify_api import get_user, make_recommendations, mass_search
from db import connect

@app.route("/ping", methods=["GET"])
def ping():
  """Ping for liveness tests."""
  return "all good"

@app.route("/prompt", methods=["POST"])
def prompt_openai():
  """
  Prompt OpenAI API for track seeds.
  Headers:
    Content-Type: application/json
  Request Body:
    prompt: str
  """
  body = request.json
  prompt = body.get('prompt', '')
  try:
    seed = json.loads(query_openai(prompt))
  
    spotify_ids = mass_search(artists=re.split(",|, ", seed["seed_artists"]), track=seed["seed_tracks"])
    seed["seed_artists"] = spotify_ids.get("artist_ids")
    seed["seed_tracks"] = [spotify_ids.get("track_id")]
    seed["seed_genres"] = re.split(",|, ", seed["seed_genres"])

    return make_recommendations(**seed)
  except Exception as e:
    return f"Exception: {e}", 500
  
@app.route("/user", methods=["GET"])
def get_spotify_user():
  """
  Get basic info about a spotify account
  Headers:
    Content-Type: application/json
  Request Body:
    user_id: str
  """
  body = request.json
  user = body.get('user_id','')
  try:
    return get_user(user)
  except:
    return "Error querying Spotify", 500



if __name__ == "__main__":
  app.run()