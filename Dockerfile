FROM node:latest
MAINTAINER Henrique Mariano
COPY . /var/www
WORKDIR /var/www
RUN npm install
ENTRYPOINT npm start
EXPOSE 3000