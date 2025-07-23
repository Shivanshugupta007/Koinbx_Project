# Koinbx Project Backend

This is a NestJS-based backend for a cryptocurrency order processing system supporting BUY and SELL operations, with Kafka-based event streaming and real-time balance tracking powered by MSSQL.

---

## Tech Stack

- NestJS
- MSSQL Server (via Docker)
- TypeORM
- Kafka (via Docker + KafkaJS)
- Zookeeper
- Swagger (API Docs)
- KafkaJS for producers/consumers

---

## Setup Instructions

### 1. ENV Variables in .env File

- PORT
- DB_HOST
- DB_PORT
- DB_USERNAME
- DB_PASSWORD
- DB_DATABASE
- KAFKA_BROKERS
- KAFKA_CLIENT_ID
- KAFKA_GROUP_ID

### 2. Clone the Repository

```bash
git clone https://github.com/Shivanshugupta007/Koinbx_Project.git
cd Koinbx_Project

npm install   // Install Packages

docker-compose up -d  // Run Docker Compose file

docker exec -it mssql bash

/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YOUR-PASSWORD" -C -Q "CREATE DATABASE YOUR_DB_NAME"

nest start   // Start Application

