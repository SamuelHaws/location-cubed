# location-cubed
Submission for https://www.43north.org/code-buffalo/ 

Installing the project:
=======================
API
1 Navigate to api folder
2 Create a virtual environment
 $ python3 -m venv env
 $ source env/bin/activate OR $ .\env\Scripts\activate
3 Install required pip packages
 $ pip install flask
 $ pip install sodapy
 $ pip install shapely
 $ pip install flask_cors
4 Install Geopandas
5 Add a file called "config.py" with required API keys
  APP_TOKEN = [OpenDataBuffalo]
  SECRET_TOKEN = [OpenDataBuffalo]
  GOOGLE_API_KEY = [Google Maps]
6 Run server
 $ python app.py

Client
1 Navigate to client folder
2 Install node packages
 $ npm install
3 Ensure angular build version is equal to the architect version
 $ npm i @angular-devkit/build-angular@0.801.3
4 Navigate to the src folder
5 Add a new folder called "environments"
6 In the environments folder, make a file called "environment.prod.ts" with the following code:
 export const environment = {
  production: true
 };
7 In the environments folder, make a file called "environment.ts" with the following code:
 export const environment = {
  production: false
 };
8 Run front-end
 $ ng serve
