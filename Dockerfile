FROM node:14.16.1-alpine

WORKDIR /home/todo

COPY package.json .
COPY yarn-lock . 

RUN yarn install

CMD yarn run start:dev