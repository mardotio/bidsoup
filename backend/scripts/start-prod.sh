#!/usr/bin/env bash
#start-prod.sh - Script for starting production/test servers.

service cron start

./wait-for-it.sh -h db -p 5432 -- \
    echo "Database live. Starting app";\
    python /code/bidsoup/manage.py migrate --noinput;\
    python /code/bidsoup/manage.py collectstatic --noinput --clear;\
    uwsgi /code/bidsoup_uwsgi.ini
