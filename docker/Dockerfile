FROM docker:latest

COPY ./backend ./backend
COPY ./docker/deploy.sh ./backend/deploy.sh

RUN apk update
RUN apk add curl
RUN apk add nodejs
RUN apk add npm
RUN npm install -g aws-cdk
WORKDIR /backend
RUN npm run install-deps-docker
RUN mkdir ~/.aws
RUN echo "[default]" > ~/.aws/credentials
RUN cat .env | grep access >> ~/.aws/credentials
RUN echo "[default]" > ~/.aws/config
RUN cat .env | grep region >> ~/.aws/config
RUN chmod +x deploy.sh
# Run the aws commands from inside a running container
