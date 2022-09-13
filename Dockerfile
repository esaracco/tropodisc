#
# PRODUCTION Docker file for TropoDisc app
#
FROM node:alpine

# All the stuff will be in /app
WORKDIR /app
COPY . ./

# Install modules and build the app
RUN yarn --silent
RUN yarn --silent build

# Install "serve" to run the app
RUN yarn --silent global add serve

# By default, serve listen to the port 3000
EXPOSE 3000
CMD serve -s -n /app/build > /dev/null
