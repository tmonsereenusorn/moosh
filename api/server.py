"""
Moosh Flask Server.
"""
from flask import Flask, request
from model import query_openai

app = Flask(__name__)

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
  

if __name__ == "__main__":
  app.run()