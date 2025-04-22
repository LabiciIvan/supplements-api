FROM node:20.19.0

WORKDIR /supplements-api

# Install MySQL client
RUN apt-get update && apt-get install -y default-mysql-client

COPY package*.json ./

COPY . .

RUN npm install

# Run the build to compile TypeScript into JavaScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
