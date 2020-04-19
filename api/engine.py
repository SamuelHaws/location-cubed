from sodapy import Socrata
import config
opendatabuffalo = Socrata("data.buffalony.gov", config.APP_TOKEN)

def checkifzonedforcommercial(codetocheck):
    commercialzonecodes = [
        "N-1C",
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

def generatescoresfromaddresses(addresses, businessType):
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
        for location in addressInfo:
            zoneCode = location['plctypfut3']
            if checkifzonedforcommercial(zoneCode):
                housenumber = int(location['hsenofr'])
                street = location['street']
                singlelineAddress = str(housenumber) + " " + street
                
                surroundingBusinesses = calculateNeighbooringBusinesses(housenumber, street, 5, businessType)
                crimeReports = len(opendatabuffalo.get(
                    "d6g9-xbgu",
                    where = "address_1 like '" + singlelineAddress + "'"
                ))

                score = ((.5 * surroundingBusinesses)+(.5* crimeReports))/100

                returnable.append({"address": singlelineAddress, "score": score})
            
            else:
                returnable.append({"address": location['hsenofr']+" "+location['street'], "score": 0})

    return returnable
    

def calculateNeighbooringBusinesses(no, street, spread, businessType):
    similarBusinesses = 0
    for hono in range((no-spread), (no+spread+1)):
        existingBusiness = opendatabuffalo.get(
            "qcyy-feh8",
            address = str(hono) + " " + street,
            descript = businessType
        )
        similarBusinesses += len(existingBusiness)
    
    return similarBusinesses