FROM node:14-alpine as node-ts-base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=4321
ENV REDIS_IP=${REDIS_IP}
ENV REDIS_PORT=14471
ENV REDIS_PASSWORD=${REDIS_PASSWORD}
ENV DB_CONN_STRING=${DB_CONN_STRING}
ENV DB_LOCAL_CONN_STRING=mongodb://localhost:27017/db_andresjordan_betest
ENV DB_NAME=db_andresjordan_betest
ENV DB_COLLECTION_NAME=users
ENV JWT_SECRET_KEY=${JWT_SECRET_KEY}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}

RUN npm run build

CMD ["npm", "run", "start"]