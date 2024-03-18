# Specify a base image
FROM node:21-alpine

WORKDIR /usr/app

# Install some depenendencies
COPY ./package.json ./

RUN npm install
RUN npm install -g parcel


COPY ./ ./

# Default command
CMD ["npm", "run", "start.ts"]