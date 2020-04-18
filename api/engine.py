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

def generatescorefromaddress(hono, street, businessType):
    returnable = []
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
            score = calculateNeighbooringBusinesses(housenumber, street, 5, businessType)

            returnable.append({"address": str(housenumber) + " " + street, "score": score})
        
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