# Project Architecture

```
		  ┌──────────────┐
		  │   Browser    │
		  └──────┬───────┘
			  │
			  ▼
		  ┌──────────────┐
		  │   Nginx      │
		  │ (Frontend)   │
		  └──────┬───────┘
	  ┌──────────────┼──────────────┐
	  │              │              │
	  ▼              ▼              ▼
   ┌──────────┐   ┌────────────┐   ┌───────────┐
   │  API     │   │ Chatbot    │   │  Static   │
   │ (Node.js │   │  API       │   │  Assets   │
   │  /api)   │   │ (Flask,    │   │ (React)   │
   └────┬─────┘   │  /chat)    │   └───────────┘
	 │         └─────┬──────┘
	 │               │
	 ▼               ▼
   ┌──────────┐    ┌────────────┐
   │Database  │    │  OpenAI/   │
   │(Postgres)│    │  Pinecone  │
   └──────────┘    └────────────┘
```

**Legend:**
- Nginx serves the React frontend and proxies `/api` to the Node.js backend and `/chat` to the chatbot API.
- The backend API connects to the Postgres database.
- The chatbot API connects to OpenAI and Pinecone for AI features.


# Demo Ecommerce App

This is a full-stack demo ecommerce application featuring:
- Node.js/Express backend (API)
- React frontend (served by Nginx)
- Integrated Chatbot API (Flask, OpenAI, Pinecone)
- Dockerized microservices architecture for easy deployment

## Features
- Product, Category, Order, and Review management
- User authentication (customer, employee)
- Shopping cart functionality
- RESTful API
- Responsive frontend UI
- AI-powered chatbot assistant
- Docker Compose multi-service orchestration

## Project Structure
```
api/           # Node.js backend (Express, Sequelize)
frontend/      # React frontend (served by Nginx)
chatbot_api/   # Python Flask chatbot API (OpenAI, Pinecone)
aws/           # AWS/EC2 deployment keys
docker-compose.yml                # Main services (web, api, db)
docker-compose.chatbot.yml        # Chatbot API service
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for local development)
- Python 3.10+ (for chatbot local dev)

### Running with Docker Compose (All Services)
Build and start all services (frontend, backend, chatbot, db) in a single network:
```
docker compose -f docker-compose.yml -f docker-compose.chatbot.yml up --build -d

you may need to run docker-compose instead of docker compose depending on the docker compose version.
```
### Running Services Individually (for debugging)
You can build and run each service separately:
```
# Build only
docker compose -f docker-compose.yml build web
docker compose -f docker-compose.yml build api
docker compose -f docker-compose.chatbot.yml build chatbot_api

# Run only one service
docker compose -f docker-compose.yml up web
docker compose -f docker-compose.yml up api
docker compose -f docker-compose.chatbot.yml up chatbot_api
recommended 
docker-compose -f docker compose.yml docker-compose -f docker-compose.chatbot.yml up chatbot_api
```

> **Note:** For full functionality, run all services together as shown above.

### Running Locally (Dev, without Docker)

#### Backend (API)
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

#### Chatbot API
```
cd chatbot_api
pip install -r requirements.txt
python app.py
```


## EC2 Deployment Guide

Follow these steps to deploy the app on an AWS EC2 instance:

### 1. Launch EC2 Instance
- Use Amazon Linux 2 or Ubuntu (t2.medium or larger recommended for builds)
- Open ports 22 (SSH), 80 (HTTP), and any others you need in the security group

### 2. Connect to EC2 via SSH
```
ssh -i /path/to/EC2-docker.pem ec2-user@<EC2_PUBLIC_IP>
```
For Ubuntu, use `ubuntu@<EC2_PUBLIC_IP>`


### 3. Install Docker & Docker Compose (Amazon Linux 2)
```
sudo yum update -y
sudo amazon-linux-extras install docker
sudo service docker start
sudo usermod -a -G docker ec2-user
exit
# Reconnect to apply group changes
```

### 4. Clone Your Repository
```
git clone https://github.com/Bath1988/Ecommerce_App
cd Ecommerce_App
```

### 5. Add Environment Files & Keys
- Place your `.env` files (openai and pinecone credentials) in the correct locations (e.g., `chatbot_api/.env`)
- Place your private key  in the `aws/` folder

### 6. Build and Start All Services
```
docker compose -f docker-compose.yml -f docker-compose.chatbot.yml up --build -d
```

### 7. Check Services
```
docker compose ps
docker compose logs web
docker compose logs api
docker compose logs chatbot_api
```

### 8. Access the App
- Frontend: `http://<EC2_PUBLIC_IP>`
- API: `http://<EC2_PUBLIC_IP>/api`
- Chatbot: `http://<EC2_PUBLIC_IP>/chat`

### 9. (Optional) Auto-Start on Reboot
Add to crontab:
```
crontab -e
# Add this line (adjust path as needed):
@reboot cd /home/ec2-user/Ecommerce_App && docker compose -f docker-compose.yml -f docker-compose.chatbot.yml up -d
```

---

## Troubleshooting
- If builds are slow or freeze, check EC2 resources (CPU/RAM/disk).
- Use `docker compose logs <service>` to view logs for any service.
- Make sure to use the correct service names: `web` (frontend), `api` (backend), `chatbot_api` (chatbot), `db` (Postgres).
- For inter-service communication, always start all services together with both compose files.

## Recent Updates
- Added chatbot API and multi-compose setup.
- Updated Docker Compose usage and service names.

## License
MIT
