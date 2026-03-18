FROM node:24

WORKDIR /build

COPY package.json ./

COPY package-lock.json ./ 

RUN npm install

COPY . .
WORKDIR /build/app
RUN npm run build

CMD ["npm", "run", "start"]