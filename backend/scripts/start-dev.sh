#!/usr/bin/env bash
#start-dev.sh - Script for starting development server.

./wait-for-it.sh -h db -p 5432 -- \
    echo "Database live. Starting app";\
    python /code/bidsoup/manage.py runserver 0.0.0.0:8000
