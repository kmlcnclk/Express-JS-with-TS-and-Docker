FROM node:16.15
WORKDIR /node/home/app
COPY package.json  ./
RUN npm install

COPY . .   

RUN npm run build

EXPOSE 5000
CMD ["npm","start"]
