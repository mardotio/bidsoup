#!/usr/bin/env bash
#start-dev.sh - Script for starting development server.

service cron start

./wait-for-it.sh -h db -p 5432 -- \
    echo "Database live. Starting app";\
    python -Wall /code/bidsoup/manage.py runserver --ptvsd 0.0.0.0:8000
