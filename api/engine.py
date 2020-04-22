from sodapy import Socrata
import config

openDataBuffalo = Socrata("data.buffalony.gov", config.APP_TOKEN)

def generateScoresFromCoords(lat, lng, rad, businessType):
  adjustedRadius = float(rad) / config.DEGREE_LAT_LENGTH
  lat = float(lat)
  lng = float(lng)

  # Fetch crime data within radius from last five years
  crimeIncidents = openDataBuffalo.get(
    "d6g9-xbgu",
    limit = '50000', 
    where = "incident_datetime > '2015-01-01T00:00:00.000' AND latitude BETWEEN '"+ str(lat - adjustedRadius) + "' AND '" + str(lat + adjustedRadius) + "' AND longitude BETWEEN '" + str(lng - adjustedRadius) + "' AND '"+ str(lng + adjustedRadius) + "'")

  # Fetch businesses within radius of same type
  surroundingBusinesses = openDataBuffalo.get(
    "qcyy-feh8", 
    descript = businessType, 
    where = "licstatus='Active' AND latitude BETWEEN '"+ str(lat - adjustedRadius) + "' AND '" + str(lat + adjustedRadius) + "' AND longitude BETWEEN '" + str(lng - adjustedRadius) + "' AND '"+ str(lng + adjustedRadius) + "'")

  return [crimeIncidents, surroundingBusinesses]

  # Generate score
