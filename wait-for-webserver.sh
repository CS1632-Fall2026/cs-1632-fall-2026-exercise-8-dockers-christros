#!/bin/sh

set -e
  
until curl http://127.0.0.1:8080/; do
  >&2 echo "Web service is unavailable - sleeping"
  sleep 1
done
  
>&2 echo "Webservice is up - continuing"