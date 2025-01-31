FROM golang:1.23.5

# set working directory
WORKDIR /app/server

# copies local files to the docker container
COPY . .

RUN go mod tidy

EXPOSE 3000