# Quick Start Guide

## Docker Setup (Recommended)

### 1. Create Environment File
```bash
cp .env.example .env
```

### 2. Edit `.env` File
Add your secrets:
```env
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
PASHUGPT_TOKEN="your-token-here"
VITE_CHAT_BASE_URL="https://dev-amulmitra.amul.com"
```

### 3. Start Services
```bash
docker-compose up
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **API Server**: http://localhost:3001/health

## Local Development (Without Docker)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env` File
Same as Docker setup above.

### 3. Start Services

**Terminal 1 - API Server:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **API Server**: http://localhost:3001/health

## Key Points

✅ **Secrets Protected**: `JWT_PRIVATE_KEY` and `PASHUGPT_TOKEN` only exist server-side
✅ **Two Services**: API server (port 3001) + Frontend (port 5173)
✅ **Production-Like**: Matches Vercel's serverless function architecture

## Troubleshooting

**Port already in use?**
- Change ports in `docker-compose.yml` or stop conflicting services

**API server not starting?**
- Check `.env` file exists and has required variables
- Check logs: `docker-compose logs api-server`

**Frontend can't reach API?**
- Ensure API server is running first
- Check `VITE_API_SERVER` environment variable

## More Information

- **Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Environment Variables**: See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)
- **Docker Details**: See [DOCKER_SETUP.md](./DOCKER_SETUP.md)
