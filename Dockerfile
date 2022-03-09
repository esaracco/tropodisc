#
# PRODUCTION Docker file for TopoDisc app
#
FROM node:alpine

# All the stuff will be in /app
WORKDIR /app
COPY . ./

# Install modules and build the app
RUN npm ci --production --silent
RUN npm run build

# Install "serve" to run the app
RUN npm i serve -g --silent

# By default, serve listen to the port 3000
EXPOSE 3000
CMD serve -s -n /app/build > /dev/null
