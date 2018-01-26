#!/bin/bash
source ~/.mainsite_settings

if [ -z ${1+x} ]; then
	echo "What environment are we deploying?"
elif [ $1 == "master" ]; then
	(cd /var/www/site && \
	 sudo -E docker-compose -f docker-compose.yml -f production.yml up -d --build)
elif [ $1 == "test" ]; then
	(cd /var/www/test && \
	 sudo -E docker-compose -f docker-compose.yml -f test.yml up -d --build)
fi

