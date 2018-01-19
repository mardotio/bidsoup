FROM node:latest
RUN mkdir /usr/app
WORKDIR /usr/app
COPY bidsoup/package.json /usr/app/
COPY bidsoup/yarn.lock /usr/app/
RUN yarn install
COPY bidsoup/src/ src
COPY bidsoup/public/ public
CMD ["npm", "start"]
EXPOSE 3000