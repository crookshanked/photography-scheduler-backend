# Need to take the linuxserver swag image and compile it with the gettext application package which includes envsubst
# EXAMPLE:
# FROM nginx:latest
# RUN apt-get update && apt-get install -y gettext-base
# COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template
# EXPOSE 80
# CMD ["/bin/bash", "-c", "envsubst < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

# Stage 1: Build the React application
# FROM node:lts-alpine as build-stage
# WORKDIR /photography-scheduler
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# Stage 1: Build the React application
FROM node:lts-alpine AS build-stage
WORKDIR /packaged
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# # Stage 2: Serve the React application with Nginx
# FROM nginx:stable-alpine
# COPY --from=build-stage /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
