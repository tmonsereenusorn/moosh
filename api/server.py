from flask import Flask

app = Flask(__name__)

@app.route("/", methods=["GET"])
def init():
    return "Hello, World!"

if __name__ == "__main__":
  app.run()