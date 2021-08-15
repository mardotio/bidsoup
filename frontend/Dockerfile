FROM node:latest
RUN mkdir /usr/app
WORKDIR /usr/app
COPY bidsoup/package.json /usr/app/
COPY bidsoup/.yarnclean /usr/app/
COPY bidsoup/yarn.lock /usr/app/
RUN yarn install
COPY ["bidsoup/tsconfig.json", "bidsoup/tslint.json", "bidsoup/base-tsconfig.json", "bidsoup/config-overrides.js", "/usr/app/"]
COPY bidsoup/src/ src
COPY bidsoup/public/ public
ARG env=DEV
ENV CI=true
RUN if [ "$env" = "PROD" ]; then yarn build; fi
CMD ["npm", "start"]
EXPOSE 3000
