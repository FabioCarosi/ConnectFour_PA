FROM node:lts-stretch-slim

WORKDIR /usr/src/app
COPY . .
ENV TZ=Europe/Rome
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN npm i
RUN npm install -g typescript
RUN tsc index.ts
CMD ["node", "index.js"]
