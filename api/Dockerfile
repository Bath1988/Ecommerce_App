# Stage 1 — Install dependencies
FROM node:18.16.1-alpine3.18 AS build

WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Stage 2 — Run the app
FROM node:18.16.1-alpine3.18

WORKDIR /app

# Copy dependencies from build stage
COPY --from=build /app/node_modules ./node_modules

# Copy the rest of the code
COPY . .

EXPOSE 5000

CMD ["node", "app.js"]
