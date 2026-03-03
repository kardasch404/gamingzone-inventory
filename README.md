# Inventory Microservice

Gaming Zone Inventory Management Microservice built with NestJS following Clean Architecture principles.

## Architecture

This service follows **Clean Architecture** with clear separation of concerns:

```
src/
├── application/       # Use cases, DTOs, ports
├── domain/           # Business entities, value objects, aggregates
├── infrastructure/   # External implementations (DB, messaging, cache)
├── presentation/     # Controllers, resolvers, guards, interceptors
└── shared/          # Common utilities, config, exceptions
```

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Messaging**: Apache Kafka
- **RPC**: gRPC
- **Language**: TypeScript

## Prerequisites

- Node.js >= 18
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7
- Apache Kafka

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env.development
```

### 3. Start Infrastructure

```bash
docker-compose up -d
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Start Development Server

```bash
npm run start:dev
```

## Available Scripts

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Testing
npm run test
npm run test:e2e
npm run test:cov

# Database
npx prisma migrate dev
npx prisma studio
```

## Project Structure

### Application Layer
- **DTOs**: Request/Response data transfer objects
- **Use Cases**: Business logic implementation (Commands & Queries)
- **Ports**: Interfaces for external dependencies

### Domain Layer
- **Entities**: Core business entities
- **Value Objects**: Immutable domain objects
- **Aggregates**: Domain-driven design aggregates
- **Events**: Domain events

### Infrastructure Layer
- **Database**: Prisma client and repositories
- **Messaging**: Kafka producers/consumers
- **Cache**: Redis implementation
- **gRPC**: Protocol buffer services

### Presentation Layer
- **REST**: HTTP controllers
- **GraphQL**: Resolvers and schemas
- **gRPC**: gRPC controllers
- **Guards**: Authentication and authorization
- **Interceptors**: Logging, transformation, caching
- **Filters**: Exception handling

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | HTTP port | 3000 |
| DATABASE_URL | PostgreSQL connection | - |
| REDIS_HOST | Redis host | localhost |
| REDIS_PORT | Redis port | 6379 |
| KAFKA_BROKERS | Kafka brokers | localhost:9092 |
| GRPC_PORT | gRPC port | 50051 |

## Docker Support

```bash
# Development
docker-compose up -d

# Production
docker build -t inventory-service .
docker run -p 3000:3000 inventory-service
```

## API Documentation

Once running, access:
- Swagger UI: http://localhost:3000/api
- Health Check: http://localhost:3000/health

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Contributing

1. Create feature branch: `git checkout -b feature/INVENTORY-XXX-description`
2. Commit changes: `git commit -m "type(scope): message"`
3. Push branch: `git push origin feature/INVENTORY-XXX-description`
4. Create Pull Request

## License

MIT
