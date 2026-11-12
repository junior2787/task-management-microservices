# Task Management Microservices

A beginner-friendly microservices architecture demonstrating communication between Java (Spring Boot) and TypeScript/Node.js services.

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────────┐     ┌────────────────────────┐
│   API Gateway   │────▶│    Task Service      │     │  Notification Service  │
│  (TypeScript)   │     │    (Java/Spring)     │     │    (TypeScript)      │
│   Port: 3000    │     │    Port: 8081        │     │    Port: 3001        │
└─────────────────┘     └──────────────────────┘     └────────────────────────┘
         │                       │                            │
         └───────────────────────┴────────────────────────────┘
                              │
                        ┌───────────────┐
                        │   Docker      │
                        │   Network     │
                        └───────────────┘
```

## Services

### 1. API Gateway (TypeScript/Node.js)
- **Port**: 3000
- **Tech**: Express.js, http-proxy-middleware, TypeScript
- **Features**: Request routing, rate limiting, health aggregation, CORS, Helmet security

### 2. Task Service (Java/Spring Boot)
- **Port**: 8081
- **Tech**: Spring Boot 3.2, Spring Data JPA, H2 Database, OpenAPI/Swagger
- **Features**: Full CRUD for tasks, pagination, search, validation, global exception handling

### 3. Notification Service (TypeScript/Node.js)
- **Port**: 3001
- **Tech**: Express.js, TypeScript, Winston logging
- **Features**: Multi-channel notifications (email, SMS, push, in-app), async processing, status tracking

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Java 17+ (for local Java development)
- Node.js 20+ (for local TypeScript development)
- Maven 3.9+ (for Java builds)

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd task-management-microservices

# Start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Local Development

#### Task Service (Java)
```bash
cd task-service-java
./mvnw spring-boot:run
# Access Swagger UI at http://localhost:8081/swagger-ui.html
# H2 Console at http://localhost:8081/h2-console
```

#### Notification Service (TypeScript)
```bash
cd notification-service-ts
npm install
npm run dev
# Service runs at http://localhost:3001
```

#### API Gateway (TypeScript)
```bash
cd gateway-ts
npm install
npm run dev
# Gateway runs at http://localhost:3000
```

## API Endpoints

### Task Service (via Gateway: `http://localhost:3000/api/tasks`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks` | List all tasks (paginated) |
| GET | `/api/tasks/{id}` | Get task by ID |
| GET | `/api/tasks/status/{status}` | Get tasks by status |
| GET | `/api/tasks/search?keyword=...` | Search tasks |
| PUT | `/api/tasks/{id}` | Update a task |
| PATCH | `/api/tasks/{id}/status?status=...` | Update task status |
| DELETE | `/api/tasks/{id}` | Delete a task |

**Task Status Values**: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`

### Notification Service (via Gateway: `http://localhost:3000/api/notifications`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notifications` | Create a notification |
| GET | `/api/notifications` | List all notifications |
| GET | `/api/notifications?status=...` | Filter by status |
| GET | `/api/notifications?type=...` | Filter by type |
| GET | `/api/notifications/{id}` | Get notification by ID |

**Notification Types**: `EMAIL`, `SMS`, `PUSH`, `IN_APP`

**Notification Status**: `PENDING`, `SENT`, `FAILED`

### Gateway Health & Info

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Aggregated health check |
| GET | `/info` | Service information |

## Example Usage

### Create a Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Microservices",
    "description": "Build a sample microservices architecture",
    "status": "PENDING"
  }'
```

### Get All Tasks
```bash
curl http://localhost:3000/api/tasks
```

### Create a Notification
```bash
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "EMAIL",
    "recipient": "user@example.com",
    "subject": "Task Created",
    "message": "Your task has been created successfully"
  }'
```

### Check System Health
```bash
curl http://localhost:3000/health
```

## Project Structure

```
task-management-microservices/
├── docker-compose.yml
├── README.md
├── task-service-java/
│   ├── src/main/java/com/example/taskservice/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   └── exception/
│   ├── src/main/resources/application.yml
│   ├── pom.xml
│   └── Dockerfile
├── notification-service-ts/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
└── gateway-ts/
    ├── src/
    │   ├── config/
    │   ├── utils/
    │   └── index.ts
    ├── package.json
    ├── tsconfig.json
    └── Dockerfile
```

## Technologies Used

### Java Service
- Spring Boot 3.2.5
- Spring Data JPA
- Spring Validation
- Spring Actuator
- H2 Database (in-memory)
- SpringDoc OpenAPI (Swagger UI)
- Maven

### TypeScript Services
- Node.js 20
- Express.js 4.18
- TypeScript 5.3
- Winston (logging)
- express-rate-limit
- express-validator
- http-proxy-middleware (gateway)
- Helmet (security)
- Jest (testing)

## Testing

### Run Tests
```bash
# Java service
cd task-service-java
./mvnw test

# TypeScript services
cd notification-service-ts && npm test
cd gateway-ts && npm test
```

## Environment Variables

### Task Service
| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_PROFILES_ACTIVE` | `default` | Spring profile |

### Notification Service
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment |
| `TASK_SERVICE_URL` | `http://localhost:8081` | Task service URL |
| `LOG_LEVEL` | `info` | Log level |

### API Gateway
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment |
| `TASK_SERVICE_URL` | `http://localhost:8081` | Task service URL |
| `NOTIFICATION_SERVICE_URL` | `http://localhost:3001` | Notification service URL |
| `LOG_LEVEL` | `info` | Log level |

## Learning Outcomes

This project demonstrates:
- ✅ Microservices communication via API Gateway
- ✅ Polyglot microservices (Java + TypeScript)
- ✅ Docker containerization
- ✅ Service discovery via Docker networking
- ✅ Health checks and graceful shutdown
- ✅ Rate limiting and security best practices
- ✅ Structured logging
- ✅ Input validation
- ✅ Global error handling
- ✅ OpenAPI documentation (Java service)

## License

MIT License - feel free to use this for learning or as a starter template!