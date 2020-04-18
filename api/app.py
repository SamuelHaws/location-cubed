from flask import Flask, request
from sodapy import Socrata
from flask_cors import CORS
import config
import json
import requests

app = Flask(__name__)
CORS(app)

client = Socrata("data.buffalony.gov", config.APP_TOKEN)

@app.route('/crimedata')
def test():
  return json.dumps(client.get("d6g9-xbgu", limit=200, content_type="json"))

# Get the unique descripts for business licenses via Buffalo OpenData API
@app.route('/businesstypes')
def unique():
  return json.dumps(client.get("qcyy-feh8", limit=200, content_type="json", select="distinct(descript)"))

# Get a list of places within a radius based on coords via Google Places API
@app.route('/places')
def places():
  coordlat = request.args.get('lat')
  coordlong = request.args.get('long')
  url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + config.GOOGLE_API_KEY + "&location=" + coordlat + "," + coordlong + "&radius=100"
  return requests.get(url).json()

if __name__ == '__main__':
  app.run(debug=True)