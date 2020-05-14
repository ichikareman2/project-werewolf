### STAGE 1: Build ###
FROM node:12.16-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install
RUN npm install -g @angular/cli

ENV PATH="./node_modules/.bin:$PATH" 

COPY . ./
RUN npm run build --prod

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /app/dist/client /usr/share/nginx/html