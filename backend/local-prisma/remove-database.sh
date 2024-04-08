#!/bin/bash

# dev > null is used to suppress the output of the commands

CONTAINER_NAME="AWSchedulersDB"
IS_CREATED="$(docker ps -a -q -f name=$CONTAINER_NAME)"
IMAGE="mysql:8.0.35"
# Check if container is running and delete it
if [ $IS_CREATED ]; then
    echo "Container found"
    docker stop $CONTAINER_NAME > /dev/null
    docker rm $CONTAINER_NAME > /dev/null
    echo "Container removed"
    else
    echo "Container not found"
fi

# Check if image is installed and delete it
if [ "$1" == "del-img" ]; then
    echo "Removing image"
    if [ "$(docker images -q $IMAGE)" ]; then
        echo "Image found"
        docker rmi mysql:8.0.35
        echo "Image removed"
        else
        echo "Image is not installed"
    fi
fi
