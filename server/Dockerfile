FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && apt-get install -y make python3 python3-pip
RUN npm install

COPY . .

EXPOSE 3002
EXPOSE 2000-3000
EXPOSE 10000-10100
CMD ["npm", "start"]



