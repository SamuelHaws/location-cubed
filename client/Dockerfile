FROM node:12.2.0
WORKDIR /client
COPY package.json /client/package.json
RUN npm install
RUN npm install -g @angular/cli@7.3.9
COPY . /client
CMD ng serve --host 0.0.0.0