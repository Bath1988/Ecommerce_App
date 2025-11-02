# ===== Stage 1: Build React app =====

# ===== Stage 1: Build React app =====
FROM node:18.16.1-alpine3.18 AS build

WORKDIR /app
# Copy only package.json and package-lock.json for better cache usage
COPY package*.json ./
# Use npm ci for faster, reliable installs in CI/CD and production
RUN npm ci --legacy-peer-deps
# Copy the rest of the source code
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

