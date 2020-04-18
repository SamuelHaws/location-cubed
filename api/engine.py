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
    addressInfo = opendatabuffalo.get(
        "4eg6-xiba",
        content_type="json",
        hsenofr = hono,
        street = street
    )
    if(len(addressInfo) == 1):
        zoneCode = addressInfo[0]['plctypfut3']
        if checkifzonedforcommercial(zoneCode):

            return calculateNeighbooringBusinesses(hono, street, 5, businessType)
        
        else:
            return 0
    else: # If this is not a valid address
        return -1

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