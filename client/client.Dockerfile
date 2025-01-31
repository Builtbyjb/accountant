FROM node:23

# set working directory
WORKDIR /app/client

# copies local files to the docker container
COPY . . 

RUN npm ci --include=optional

# work around npm optional dependencies bug
RUN rm -rf node_modules && rm -rf package-lock.json

RUN npm install

EXPOSE 5173