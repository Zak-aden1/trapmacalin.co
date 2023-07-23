FROM node:19-alpine3.16

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json .

USER node:node

RUN npm ci

COPY --chown=node:node . .

EXPOSE 3000

CMD ["node", "app.js"]

