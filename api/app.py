from flask import Flask
from sodapy import Socrata
import config
import json

app = Flask(__name__)

client = Socrata("data.buffalony.gov", config.APP_TOKEN)

@app.route('/')
def index():
  return "Hello, World!"

@app.route('/test')
def test():
  return json.dumps(client.get("d6g9-xbgu", limit=200, content_type="json"))

# Get the unique descripts for business licenses
@app.route('/unique')
def unique():
  return json.dumps(client.get("qcyy-feh8", limit=200, content_type="json", select="distinct(descript)"))

if __name__ == '__main__':
  app.run(debug=True)