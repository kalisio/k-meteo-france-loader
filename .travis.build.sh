#!/bin/bash
source .travis.env.sh

docker login -u="$DOCKER_USER" -p="$DOCKER_PASSWORD"
docker build -f dockerfile.arpege-world -t $IMAGE_NAME:arpege-world-$VERSION .
docker push $IMAGE_NAME:arpege-world-$VERSION
docker build -f dockerfile.arpege-europe -t $IMAGE_NAME:arpege-europe-$VERSION .
docker push $IMAGE_NAME:arpege-europe-$VERSION
docker build -f dockerfile.arome-france -t $IMAGE_NAME:arome-france-$VERSION .
docker push $IMAGE_NAME:arome-france-$VERSION
