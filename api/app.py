import config
import json
import requests
from flask import Flask, request
from sodapy import Socrata
from flask_cors import CORS
from shapely.geometry import Polygon
import geopandas as gpd

# length of a degree of latitude in meters for Buffalo
# http://www.csgnetwork.com/degreelenllavcalc.html
DEGREE_LAT_LENGTH = 111090.58224106459

app = Flask(__name__)
CORS(app)
openDataBuffalo = Socrata("data.buffalony.gov", config.APP_TOKEN)

# Get the unique descripts for business licenses via Buffalo OpenData API
@app.route('/businesstypes')
def businessTypes():
  return json.dumps(openDataBuffalo.get("qcyy-feh8", select="distinct(descript)"))

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
  zones = openDataBuffalo.get("4eg6-xiba", limit=60000, content_type="json", where=whereClause)

  # Generate polygons of zones
  zonesPolygons = [Polygon(zone['the_geom']['coordinates'][0][0]) for zone in zones]

  # Get coords of centers of zones
  centroids = [gpd.GeoSeries(zonePolygon).geometry.centroid for zonePolygon in zonesPolygons]
  
  # Convert centroid objects to coords
  centroidCoords = [{"lat": str(center[1]), "lng": str(center[0])} for center in [json.loads(centroid.to_json())['features'][0]['geometry']['coordinates'] for centroid in centroids]] 
  
  return json.dumps(centroidCoords)

# Get crime incidents within search space that occurred since 2015
@app.route('/crimes')
def crimes():
  lat = float(request.args.get('lat'))
  lng = float(request.args.get('lng'))
  rad = float(request.args.get('rad'))
  adjustedRadius = rad / DEGREE_LAT_LENGTH
  
  crimes = openDataBuffalo.get(
    "d6g9-xbgu",
    limit = '60000', 
    where = "incident_datetime > '2015-01-01T00:00:00.000' AND latitude BETWEEN '"+ str(lat - adjustedRadius) + "' AND '" + str(lat + adjustedRadius) + "' AND longitude BETWEEN '" + str(lng - adjustedRadius) + "' AND '"+ str(lng + adjustedRadius) + "'")

  return json.dumps([{"lat": crime["latitude"], "lng": crime["longitude"]} for crime in crimes])

# Get business license data for businesses of same type within search space
@app.route('/businesses')
def businesses():
  lat = float(request.args.get('lat'))
  lng = float(request.args.get('lng'))
  rad = float(request.args.get('rad'))
  adjustedRadius = rad / DEGREE_LAT_LENGTH
  businessType = request.args.get('businessType')

  businesses = openDataBuffalo.get(
    "qcyy-feh8", 
    descript = businessType, 
    limit = 60000,
    where = "licstatus='Active' AND latitude BETWEEN '"+ str(lat - adjustedRadius) + "' AND '" + str(lat + adjustedRadius) + "' AND longitude BETWEEN '" + str(lng - adjustedRadius) + "' AND '"+ str(lng + adjustedRadius) + "'")
  
  return json.dumps([{"lat": business["latitude"], "lng": business["longitude"]} for business in businesses])

# Get annual average daily traffic data within search space since 2015
@app.route('/traffic')
def traffic():
  lat = request.args.get('lat')
  lng = request.args.get('lng')
  rad = request.args.get('rad')

  whereClause = "within_circle(location_1," + lat + "," + lng + "," + rad + ") AND aadt_year > '2015-01-01T00:00:00.000'"

  return json.dumps([{"lat": traffic['location_1']['latitude'], "lng": traffic['location_1']['longitude'], "aadt": traffic['aadt']} for traffic in openDataBuffalo.get("y93c-u65y", where=whereClause)])
  
# See https://stackoverflow.com/a/30329547, important to note that API is still accessible at localhost:5000
if __name__ == '__main__':
  app.run(host='0.0.0.0', debug=True)