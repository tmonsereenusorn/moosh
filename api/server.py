from flask import Flask

app = Flask(__name__)

@app.route("/ping", methods=["GET"])
def ping():
  """Ping for liveness tests."""
  return "all good"

if __name__ == "__main__":
  app.run()