from flask import Flask, request
from sodapy import Socrata
from flask_cors import CORS
import config
import json
import requests
import engine

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

@app.route('/getscoresbyaddresses')
def getscoresbyaddresses():
  addresses = json.loads(request.args.get('addresses', type = str))
  businessType = request.args.get('businessType', type = str)
  return json.dumps(engine.generatescoresfromaddresses(addresses, businessType))

# Get a list of places within a radius based on coords via Google Places API
@app.route('/places')
def places():
  lat = request.args.get('lat')
  lng = request.args.get('lng')
  rad = request.args.get('rad')
  return internalPlacesCall(lat, lng, rad)

def internalPlacesCall(lat, long, rad):
  url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + config.GOOGLE_API_KEY + "&location=" + lat + "," + lng + "&radius=" + rad
  return requests.get(url).json()

# Takes a latitude, longitude, radius, and business type and gives a list of addresses and there scores.
@app.route('/getscoresbycoordinate')
def getscoresbycoordinate():
  coordlat = request.args.get('lat')
  coordlong = request.args.get('long')
  businessType = request.args.get('businessType', type = str)
  radius = request.args.get('radius')
  mapInfo = internalPlacesCall(coordlat, coordlong)['results']
  sendable = []

  # builds the addresses to send to the engine.
  for location in mapInfo:
    addressParts = location['vicinity'].split(" ")
    i = 0
    while i < len(addressParts):
      try: 
        currentAddress = {
          "housenumber": int(addressParts[i]),
          "street": addressParts[i+1],
          "lat": location['geometry']['location']['lat'],
          "long": location['geometry']['location']['lng']
        }
        sendable.append(currentAddress)
        i+=1000
      except ValueError:
        i+=1
  
  return json.dumps(engine.generatescoresfromaddresses(sendable, businessType, (float(radius) / 111090.58224106459)))


if __name__ == '__main__':
  app.run(debug=True)