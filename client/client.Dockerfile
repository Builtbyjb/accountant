FROM node:23

# set working directory
WORKDIR /app/client

# copies local files to the docker container
COPY . . 

RUN npm ci --include=optional

EXPOSE 5173