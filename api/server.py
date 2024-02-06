"""
Moosh Flask Server.
"""
from flask import Flask, request
from dotenv import load_dotenv
from model import query_openai
from spotify_api import spotipy_search, get_user

app = Flask(__name__)
load_dotenv()

from model import query_openai
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
    return query_openai(prompt)
  except:
    return "Error prompting OpenAI", 500
  
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
  
@app.route("/search", methods=["GET"])
def search_spotify():
  """
  Search spotify for item ids.
  Headers:
    Content-Type: application/json
  Request Body:
    q: str
    type: List[str]
  """  
  body = request.json
  # expecting a well-formed query
  q = body.get('q','')
  search_type = body.get('type','')

  try:
    return spotipy_search(q, search_type)
  except:
    return "Error searching Spotify", 500



if __name__ == "__main__":
  app.run()