from flask import Flask
from flask import request
from flask_cors import CORS

from sodapy import Socrata

import json
import config
import engine

app = Flask(__name__)
CORS(app)

client = Socrata("data.buffalony.gov", config.APP_TOKEN)

@app.route('/')
def index():
  return "Hello, World!"

@app.route('/test')
def test():
  return json.dumps(client.get("d6g9-xbgu", limit=200, content_type="json"))

# Get the unique descripts for business licenses
@app.route('/unique')
def unique():
  return json.dumps(client.get("qcyy-feh8", limit=200, content_type="json", select="distinct(descript)"))

@app.route('/getscorebyaddress')
def getscorebyaddress():
  housenumber = request.args.get('houseno', type = int)
  street = request.args.get('street', type = str)
  business = request.args.get('businessType', type = str)
  return str(engine.generatescorefromaddress(housenumber, street, business))

if __name__ == '__main__':
  app.run(debug=True)