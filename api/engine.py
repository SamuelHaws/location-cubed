from sodapy import Socrata
import config
opendatabuffalo = Socrata("data.buffalony.gov", config.APP_TOKEN)

def checkifzonedforcommercial(codetocheck):
    commercialzonecodes = [
        "N-1C",
        "N-1D",
        "N-2C",
        "N-2E",
        "N-3C",
        "N-3E",
        "D-S",
        "D-C"
    ]
    if(codetocheck in commercialzonecodes):
        return True
    else:
        return False

# Main engine function. Takes a list of addresses, a business type, and a radius for the the region to be searched, and sends back the list of addresses and their scores.
def generatescoresfromaddresses(addresses, businessType, radius):
    returnable = []

    for address in addresses:
        hono = address['housenumber']
        street = address['street']

        addressInfo = opendatabuffalo.get(
            "4eg6-xiba",
            content_type="json",
            hsenofr = hono,
            where = "starts_with(street, upper('"+street+"'))"
        )
        if len(addressInfo) > 0: # TODO: Find better way. Currently, this takes the first address that comes back from the search and checks its zone. This is bad because the first address may not necessarily be the address that the coordinates are for. Should add logic to check if the coordinates are in the geo fence for this address.
            location = addressInfo[0]
            zoneCode = location['plctypfut3']
            lat = address['lat']
            lng = address['lng']

            # The actual algorithm part.
            # Only goes through the algorithm if the address is zoned for commercial.
            if checkifzonedforcommercial(zoneCode):
                housenumber = int(location['hsenofr'])
                street = location['street']
                singlelineAddress = str(housenumber) + " " + street
                
                # Grab data set stuff
                surroundingBusinesses = calculateNeighbooringBusinesses(lat, lng, radius, businessType)
                crimeReports = len(opendatabuffalo.get(
                    "d6g9-xbgu",
                    where = "latitude between '"+ str(lat - radius) + "' and '" + str(lat + radius) + "' AND longitude between '" + str(lng - radius) + "' and '"+ str(lng + radius) + "'"
                ))

                # Score generation algorithm
                score = ((.5 * surroundingBusinesses)+(.5* crimeReports))/100

                returnable.append({"lat": lat, "lng": lng, "address": singlelineAddress, "score": score})
            
            # If the address is not zoned for commercial.
            else:
                returnable.append({"lat": lat, "lng": lng, "address": location['hsenofr']+" "+location['street'], "score": 0})

    return returnable
    

def calculateNeighbooringBusinesses(lat, lng, spread, businessType):
    
    similarBusinesses = 0

    existingBusiness = opendatabuffalo.get(
        "qcyy-feh8",
        descript = businessType,
        where = "latitude between '"+ str(lat - spread) + "' and '" + str(lat + spread) + "' AND longitude between '" + str(lng - spread) + "' and '"+ str(lng + spread) + "'"
    )
    similarBusinesses += len(existingBusiness)
    
    return similarBusinesses