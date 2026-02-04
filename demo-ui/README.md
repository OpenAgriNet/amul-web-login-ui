# Amul API Demo UI

A React + TypeScript demo application for testing and demonstrating Amul API integrations for a dairy farming chatbot.

## Tech Stack

- React 19.2.0 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Vercel (deployment with serverless functions)

## Development Setup

### Option 1: Using Docker Compose (Recommended for Containerized Development)

Run the application in Docker with a **two-service architecture** that protects secrets server-side (similar to Vercel):

```bash
# Create .env file with required variables (see ENVIRONMENT_VARIABLES.md)
cp .env.example .env
# Edit .env and add your values

# Start both services (API server + Frontend)
docker-compose up

# Or run in detached mode
docker-compose up -d
```

The application will be available at:
- **Frontend**: `http://localhost:5173`
- **API Server**: `http://localhost:3001`

**Architecture:**
- **API Server** (port 3001): Express backend handles all API endpoints server-side
  - Protects `JWT_PRIVATE_KEY` and `PASHUGPT_TOKEN` secrets
  - Never exposed to the browser
- **Frontend** (port 5173): Vite dev server proxies API requests to backend

**Pros:**
- ✅ **Secrets protected server-side** (like Vercel serverless functions)
- ✅ Consistent environment across different machines
- ✅ No need to install Node.js locally
- ✅ Hot reload with volume mounting
- ✅ Isolated dependencies
- ✅ Production-like architecture

**Cons:**
- ⚠️ Requires Docker and Docker Compose installed

### Option 2: Using Vercel Dev (Recommended - Matches Production)

This runs the actual Vercel serverless functions locally, matching production exactly:

```bash
npm install
npm run dev:vercel
```

**Pros:**
- ✅ Exact match with production environment
- ✅ Serverless functions run locally
- ✅ No code duplication between dev/prod

**Cons:**
- ⚠️ Requires Vercel CLI installed
- ⚠️ Slightly slower startup

### Option 3: Using Vite Dev (Quick Frontend Development)

For quick frontend-only development without serverless functions:

```bash
npm install
npm run dev
```

**Pros:**
- ✅ Fast HMR (Hot Module Replacement)
- ✅ Quick startup
- ✅ Good for UI-only changes

**Cons:**
- ⚠️ Uses Vite plugin to mock `/api/generate-token` (dev != production)
- ⚠️ Serverless functions not actually running

## Environment Variables

See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for complete documentation.

**Quick Setup:**

Create a `.env` file in the `demo-ui` directory:

```env
JWT_PRIVATE_KEY=your-private-key-in-pkcs8-format
VITE_CHAT_BASE_URL=https://dev-amulmitra.amul.com
PASHUGPT_TOKEN=your-pashugpt-bearer-token-here
```

**Required Variables:**
- `JWT_PRIVATE_KEY` - Private key for signing JWT tokens (PKCS#8 format)
- `PASHUGPT_TOKEN` - Bearer token for PashuGPT API authentication

**Optional Variables:**
- `VITE_CHAT_BASE_URL` - Base URL for chat application (default: `https://dev-amulmitra.amul.com`)

**Note:** `JWT_PRIVATE_KEY` should be in PKCS#8 format (starts with `-----BEGIN PRIVATE KEY-----`). If stored as an env var, ensure newlines are preserved (use `\n` or actual newlines).

## API Endpoints

### Serverless Functions (Vercel)

- `/api/generate-token` - Generates JWT token with farmer/animal data
- `/api/pashugpt/farmer` - Proxy to PashuGPT farmer API
- `/api/pashugpt/animal` - Proxy to PashuGPT animal API

### Proxied APIs (Vite Dev)

- `/api/amul/*` - Proxied to `https://farmer.amulamcs.com`

## Build & Deploy

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to Vercel.

### Docker Production Build

Build a production Docker image:

```bash
docker build -f Dockerfile -t demo-ui:latest .
```

Run the production container:

```bash
docker run -p 80:80 \
  -e JWT_PRIVATE_KEY="your-key" \
  -e VITE_CHAT_BASE_URL="https://dev-amulmitra.amul.com" \
  demo-ui:latest
```

## Project Structure

```
demo-ui/
├── api/                    # Vercel serverless functions (for Vercel deployment)
│   ├── generate-token.ts   # JWT token generation
│   └── pashugpt/           # PashuGPT API proxies
├── server/                 # Express backend server (for Docker/local dev)
│   ├── index.ts            # Express server entry point
│   └── handlers/           # API route handlers
│       ├── generate-token.ts
│       └── pashugpt/       # PashuGPT API handlers
├── src/
│   ├── components/         # React components
│   ├── api.ts              # API client functions
│   └── types.ts            # TypeScript types
├── vite.config.ts          # Vite configuration (proxies to API server)
├── vite-plugin-generate-token.ts  # Vite plugin (legacy - not used with Docker)
└── vercel.json             # Vercel configuration
```

## Development Modes Explained

### Docker Compose (Recommended)
- **API Server**: Express backend runs all API endpoints server-side
- **Frontend**: Vite dev server proxies requests to API server
- **Secrets**: Protected server-side, never exposed to browser
- **Architecture**: Matches Vercel's serverless function model

### Vercel Dev
- **Serverless Functions**: Vercel automatically runs files in `/api` as serverless functions
- **Exact Production Match**: Same runtime as production deployment
- **Secrets**: Protected via Vercel environment variables

### Vite Dev (Legacy)
- **Plugin Mock**: Uses `vite-plugin-generate-token` to mock `/api/generate-token`
- **Direct Proxy**: Proxies PashuGPT APIs directly (secrets in vite.config.ts - not recommended)
- **Use Case**: Quick frontend-only iterations

**Recommendation:** 
- Use **Docker Compose** for local development with proper secret protection
- Use **Vercel Dev** for testing exact production behavior
- Use **Vite Dev** only for quick UI-only changes
