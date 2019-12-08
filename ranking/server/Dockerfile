FROM node:10.16.0

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

CMD ["yarn", "start" ]