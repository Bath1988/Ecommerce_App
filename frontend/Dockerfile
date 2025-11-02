FROM node:18.16.1-alpine3.17 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps && npm cache clean --force
COPY . .
RUN npm run build

FROM nginx:1.25.1-alpine3.17
LABEL maintainer="Bathiya <your-email@example.com>" \
      description="Production-ready React app served via Nginx"
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
RUN { \
      echo 'gzip on;'; \
      echo 'gzip_types text/plain text/css application/javascript application/json image/svg+xml;'; \
      echo 'gzip_min_length 256;'; \
    } > /etc/nginx/conf.d/gzip.conf \
    && chown -R nginx:nginx /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
