from flask import Flask, request
from sodapy import Socrata
from flask_cors import CORS
import config
import json
import requests
import engine

app = Flask(__name__)
CORS(app)
openDataBuffalo = Socrata("data.buffalony.gov", config.APP_TOKEN)

# Get the unique descripts for business licenses via Buffalo OpenData API
@app.route('/businesstypes')
def unique():
  return json.dumps(openDataBuffalo.get("qcyy-feh8", limit=200, content_type="json", select="distinct(descript)"))

@app.route('/scores')
def scores():
  lat = request.args.get('lat')
  lng = request.args.get('lng')
  rad = request.args.get('rad')
  businessType = request.args.get('businessType')
  return json.dumps(engine.generateScoresFromCoords(lat, lng, rad, businessType))

if __name__ == '__main__':
  app.run(debug=True)