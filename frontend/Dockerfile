# ===== Stage 1: Build React app =====
FROM node:18.16.1-alpine3.18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ===== Stage 2: Serve with Nginx =====
FROM nginx:1.25.1-alpine3.17

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy your optimized nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy React build files to Nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

