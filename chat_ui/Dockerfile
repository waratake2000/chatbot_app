FROM node:latest as build-stage

RUN apt-get update
RUN apt-get upgrade -y

WORKDIR /root

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build



FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /root/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
