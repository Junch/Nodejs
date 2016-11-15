# Dockerfile
# using debian:jessie for it's smaller size over ubuntu
FROM node:6.1

# Set the work directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN mkdir ./logs

# Add our package.json and install *before* adding our application files
ADD package.json ./
RUN npm i
RUN npm i webpack -g

# Add application files
ADD . /usr/src/app

# Generate the bundle.js
RUN npm run deploy

EXPOSE 9090
CMD ["npm", "start"]