# Stuck - Backend API

A RESTful API built with NestJS and TypeScript, developed during an internship program as a learning project. This backend provides authentication, user management, and real-time websocket communication with PostgreSQL database integration.

The front-end that consumes this API is in a separate repository, which can be found [here](https://github.com/elsatafilajj/react-internship-project).

## 🚀 Features

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT-based authentication
- **File Upload**: Multer integration for file handling
- **Email Notifications**: Nodemailer & Mailtrap for email services
- **Validation**: Class-validator for request validation
- **Testing**: Jest unit and e2e testing
- **Code Quality**: Biome.js, and Commitlint
- **Git Hooks**: Husky for pre-commit validation
- **Logging**: Winston logger with environment-based configuration
- **Websockets**: Real-time communication using Socket.IO
- **Documentation**: OpenAPI (Swagger) for API documentation with Scalar UI

## 🛠️ Prerequisites

- Node.js 18.13.0 (use `.nvmrc` for version management)
- PostgreSQL 15.1 or higher
- pnpm package manager (recommended for version consistency)

## 📦 Installation

1. **Clone the repository**
 ```bash
 git clone https://github.com/gjonhajdari/nestjs-internship-project
 cd nestjs-internship-project
 ```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up Git hooks**
```bash
pnpm run prepare
```

## 🔧 Environment Configuration

Create a `.env` file based on `.env.example`

```bash
cp .env.example .env
```

And configure the following:

- **Database**: Set `TYPEORM_HOST=localhost` for local development (change from `pgsql` if not using Docker)
- **JWT**: Configure JWT secrets and expiration times
- **Mail**: Set SMTP credentials for email notifications
- **File Upload**: Set upload paths and limits
- **Logging**: Configure log levels and output destinations

## 🚀 Getting Started

### Development

```bash
# Start in development mode
pnpm run start:dev

# Start in production mode
pnpm run start:prod
```

The API will be available at `http://localhost:3000` (or the URL specified in your `.env` file).

### Database Setup

```bash
# Run database migrations (auto runs on start:dev)
pnpm run migration:run

# Seed the database for local development
pnpm run seed
```

#### Creating Migrations

**Linux/MacOS:**
```bash
npm run migration:create --name=[filename]
# Example: npm run migration:create --name=UpdatePost
```

**Windows:**
```bash
npx typeorm migration:create ./src/common/db/migrations/[filename]
# Example: npx typeorm migration:create ./src/common/db/migrations/UpdatePost
```

## 🧪 Testing

```bash
# Run unit tests
pnpm run test

# Run e2e tests
pnpm run test:e2e

# Generate test coverage
pnpm run test:cov
```

## 📝 Development Guidelines

### Commit Messages
This project uses [Conventional Commits](https://www.conventionalcommits.org/). Valid commit types:
- `feature`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `build`: Build system changes
- `ci`: Continuous integration changes
- `perf`: Performance improvements
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions or modifications
- `chore`: Maintenance tasks

### Code Quality
- Pre-commit hooks run linting and formatting
- Biome.js configured for code consistency
- Husky manages Git hooks for quality assurance

## 📊 Logging

- **Development** (`NODE_ENV=localhost`): Logs printed to terminal
- **Production**: Logs saved to `application_logs.log`

*Note: For production, consider integrating with log management services like Logtail or implementing log rotation with S3 storage.*

## 📄 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient and scalable server-side applications.