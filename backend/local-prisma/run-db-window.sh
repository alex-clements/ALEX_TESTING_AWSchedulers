#!/bin/bash
# Run this script locally to spin up and seed the database
# MAKE SURE DOCKER IS RUNNING

# dev > null is used to suppress the output of the commands
# dev 2> null is used to suppress the error output of the commands

# Check for docker
if ! docker stats --no-stream &> /dev/null; then
  echo 'Error: docker is not running.'
  exit 1
else 
  echo 'Docker is running'
fi

CONTAINER_NAME="AWSchedulersDB"
IMAGE="mysql:8.0.35"
IS_RUNNING="$(docker ps -q -f name=$CONTAINER_NAME)"
IS_CREATED="$(docker ps -a -q -f name=$CONTAINER_NAME)"
HAS_IMAGE="$(docker images -q mysql:8.0.35)" 

# Pull image from docker hub if not already installed
if [ "$HAS_IMAGE" ]; then
    echo "Image is already installed"
    else
    echo "Pulling Image"
    docker pull mysql:8.0.35
fi

# Run the container if not already running
if [ "$IS_RUNNING" ]; then
    echo "Container is already running"
    else
    if [ "$IS_CREATED" ]; then
      echo "Container is created but not running"
      echo "Removing container and starting a new one"
      docker rm $CONTAINER_NAME
    fi
    docker run --name $CONTAINER_NAME -e MYSQL_ROOT_PASSWORD=password -p 3307:3306 -d $IMAGE
    echo Starting container
    # Wait for the container to start
    WAIT=15
    echo "Waiting $WAIT seconds for the container to start"
    sleep $WAIT
fi

# Go to the prisma directory
cd ../layers/prisma 

# Run generate
echo "Running prisma generate"
npx prisma generate

# Deploy the migration
echo "Deploying the migration"
npx prisma migrate deploy

# Wait for the migration to finish
sleep 5

# Go to the seed file
cd ../../lambda/seedDB

# Seed the database
node -e "console.log(require('./seed').handler({}));"

# Go back to the prisma directory
cd ../../layers/prisma

echo "Starting prisma studio to show the database"

# Start prisma studio
npx prisma studio