#!/bin/bash

yarn build
cp -r /usr/app/build/. /var/www/static/
