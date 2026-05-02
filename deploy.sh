#!/bin/bash
docker build -t portfolio . && \
docker stop portfolio && \
docker rm portfolio && \
docker run -d --name portfolio --restart unless-stopped -p 3010:80 portfolio