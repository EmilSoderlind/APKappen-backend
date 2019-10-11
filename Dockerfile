FROM node:10
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

COPY ./server/package*.json ./
COPY ./server/documentation.md ./
#COPY ./server/secret.js ./

RUN npm install
# If you are building your code for production
RUN npm ci --only=production

COPY ./server .
EXPOSE 1337

CMD [ "node", "index.js" ]
