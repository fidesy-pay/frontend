FROM node:latest

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

RUN ls /usr/src/app
RUN ls /usr/src/app/public

CMD ["npm", "start"]