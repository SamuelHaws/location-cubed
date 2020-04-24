from flask import Flask, request
from sodapy import Socrata
from flask_cors import CORS
import config
import json
import requests
import engine

#TODO: Remove these imports, fix /zones code
from shapely.geometry import Point, Polygon
import geopandas as gpd

app = Flask(__name__)
CORS(app)
openDataBuffalo = Socrata("data.buffalony.gov", config.APP_TOKEN)

# Get the unique descripts for business licenses via Buffalo OpenData API
@app.route('/businesstypes')
def unique():
  return json.dumps(openDataBuffalo.get("qcyy-feh8", content_type="json", select="distinct(descript)"))


  # if(codetocheck in commercialzonecodes):
  #     return True
  # else:
  #     return False

# Get coords of centers of commercial zones within search space
@app.route('/zones')
def zones():
  lat = request.args.get('lat')
  lng = request.args.get('lng')
  rad = request.args.get('rad')

  commercialZoneCodes = ["N-1C","N-1D","N-2C","N-2E","N-3C","N-3E","D-S","D-C"]

  # Restrict results to commercial zones within search space
  whereClause = "within_circle(the_geom," + lat + "," + lng + "," + rad + ") AND plctypfut3 IN (" + str(commercialZoneCodes).strip('[]') + ")"

  # Fetch zone data
  zones = openDataBuffalo.get("4eg6-xiba", limit=200, content_type="json", where=whereClause)

  # Generate polygons of zones
  zonesPolygons = [zone['the_geom']['coordinates'][0][0] for zone in zones]

  # Get coords of centers of zones
  centroids = []
  for zonePolygon in zonesPolygons:
    polygon = Polygon(zonePolygon)
    centroids.append(gpd.GeoSeries(polygon).geometry.centroid) # Store centroid of zone polygon
  
  # Convert centroid object to coords
  centersCoords = [json.loads(centroid.to_json())['features'][0]['geometry']['coordinates'] for centroid in centroids]
  return json.dumps(centersCoords)

@app.route('/scores')
def scores():
  lat = request.args.get('lat')
  lng = request.args.get('lng')
  rad = request.args.get('rad')
  businessType = request.args.get('businessType')
  return json.dumps(engine.generateScoresFromCoords(lat, lng, rad, businessType))

if __name__ == '__main__':
  app.run(debug=True)