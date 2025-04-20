FROM node:20.19.0

WORKDIR /supplements-api

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 3000

CMD ["npm", "run", "dev"]
