FROM nikolaik/python-nodejs:python3.8-nodejs13-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 4545
CMD [ "node", "index.js" ]
