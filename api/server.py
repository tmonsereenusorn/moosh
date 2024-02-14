"""
Moosh Flask Server.
"""
import re
import json
import requests
from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

app = Flask(__name__)
cors = CORS(app)
load_dotenv()

from model import query_openai
from spotify_api import get_user, make_recommendations, mass_search
from db import connect
from decorators import retry

@app.route("/ping", methods=["GET"])
def ping():
  """Ping for liveness tests."""
  return "all good"

@retry(max_retries=5, backoff=1)
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
  seed = json.loads(query_openai(prompt))

  spotify_ids = mass_search(artists=re.split(",|, ", seed["seed_artists"]), track=seed["seed_tracks"])
  seed["seed_artists"] = spotify_ids.get("artist_ids")
  seed["seed_tracks"] = [spotify_ids.get("track_id")]
  seed["seed_genres"] = re.split(",|, ", seed["seed_genres"])

  return make_recommendations(**seed)
    
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
  
  return get_user(user)



if __name__ == "__main__":
  app.run()