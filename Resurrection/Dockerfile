FROM node:10
# Create app directory
WORKDIR /usr/src

COPY . .
RUN npm ci
EXPOSE 8008

CMD [ "npm", "run", "start" ]
