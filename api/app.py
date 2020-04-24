import config
import json
import requests
from flask import Flask, request
from sodapy import Socrata
from flask_cors import CORS
from shapely.geometry import Polygon
import geopandas as gpd

app = Flask(__name__)
CORS(app)
openDataBuffalo = Socrata("data.buffalony.gov", config.APP_TOKEN)

# Get the unique descripts for business licenses via Buffalo OpenData API
@app.route('/businesstypes')
def unique():
  return json.dumps(openDataBuffalo.get("qcyy-feh8", content_type="json", select="distinct(descript)"))

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
  zonesPolygons = [Polygon(zone['the_geom']['coordinates'][0][0]) for zone in zones]

  # Get coords of centers of zones
  centroids = [gpd.GeoSeries(zonePolygon).geometry.centroid for zonePolygon in zonesPolygons]
  
  # Convert centroid object to coords
  centroidCoords = [{"lat": str(center[1]), "lng": str(center[0])} for center in [json.loads(centroid.to_json())['features'][0]['geometry']['coordinates'] for centroid in centroids]] 
  
  return json.dumps(centroidCoords)

# Get crime incidents within search space that occurred since 2015
@app.route('/crimes')
def crimes():
  lat = float(request.args.get('lat'))
  lng = float(request.args.get('lng'))
  rad = float(request.args.get('rad'))
  adjustedRadius = rad / config.DEGREE_LAT_LENGTH
  
  crimes = openDataBuffalo.get(
    "d6g9-xbgu",
    limit = '50000', 
    where = "incident_datetime > '2015-01-01T00:00:00.000' AND latitude BETWEEN '"+ str(lat - adjustedRadius) + "' AND '" + str(lat + adjustedRadius) + "' AND longitude BETWEEN '" + str(lng - adjustedRadius) + "' AND '"+ str(lng + adjustedRadius) + "'")

  return json.dumps([{"lat": crime["latitude"], "lng": crime["longitude"]} for crime in crimes])

# Get business license data for businesses of same type within search space
@app.route('/businesses')
def businesses():
  lat = float(request.args.get('lat'))
  lng = float(request.args.get('lng'))
  rad = float(request.args.get('rad'))
  adjustedRadius = rad / config.DEGREE_LAT_LENGTH
  businessType = request.args.get('businessType')

  businesses = openDataBuffalo.get(
    "qcyy-feh8", 
    descript = businessType, 
    where = "licstatus='Active' AND latitude BETWEEN '"+ str(lat - adjustedRadius) + "' AND '" + str(lat + adjustedRadius) + "' AND longitude BETWEEN '" + str(lng - adjustedRadius) + "' AND '"+ str(lng + adjustedRadius) + "'")
  

  return json.dumps([{"lat": business["latitude"], "lng": business["longitude"]} for business in businesses])

if __name__ == '__main__':
  app.run(debug=True)