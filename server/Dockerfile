FROM node:12.7-alpine
COPY package.json ./
RUN npm install

COPY --chown=node:node . .

EXPOSE 8000

CMD [ "node", "index.js" ]