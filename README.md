# Demo Ecommerce App

This is a full-stack demo ecommerce application with a Node.js/Express backend and a React frontend, containerized using Docker and served with Nginx.

## Features
- Product, Category, Order, and Review management
- User authentication (customer, employee)
- Shopping cart functionality
- RESTful API
- Responsive frontend UI
- Dockerized for easy deployment

## Project Structure
```
api/         # Node.js backend (Express, Sequelize)
frontend/    # React frontend
nginx/       # Nginx config for reverse proxy
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for local development)

### Running with Docker Compose
```
docker-compose up --build
```

- API: http://localhost:5000
- Frontend: http://localhost:3000

### Running Locally (Dev)

#### Backend
```
cd api
npm install
npm run dev
```

#### Frontend
```
cd frontend
npm install
npm start
```

## Recent Updates
- Merged changes from the `buggy-code` branch into `main`.

## License
MIT
