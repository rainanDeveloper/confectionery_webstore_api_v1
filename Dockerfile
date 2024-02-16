FROM node:21.5.0-alpine

WORKDIR /home/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8080

CMD "npm run start:prod"