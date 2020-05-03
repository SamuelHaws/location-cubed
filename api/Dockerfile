FROM python:3.6-slim
COPY . /api 
WORKDIR /api

# See https://github.com/tiangolo/uwsgi-nginx-flask-docker/issues/22#issuecomment-332304298
# COPY requirements.txt requirements.txt
# RUN pip install -r requirements.txt 

RUN pip install requests flask flask_cors sodapy shapely geopandas
CMD python app.py