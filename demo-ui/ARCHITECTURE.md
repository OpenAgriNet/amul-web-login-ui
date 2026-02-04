# Architecture: Server-Side Secret Protection

## Problem Statement

When deploying to Vercel, API endpoints run as serverless functions, keeping secrets (`JWT_PRIVATE_KEY`, `PASHUGPT_TOKEN`) safe on the server. However, in local Docker development, we need a similar architecture to protect secrets.

## Solution: Two-Service Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network                           │
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐        │
│  │   Frontend       │         │   API Server     │        │
│  │   (Vite)         │────────▶│   (Express)      │        │
│  │   Port: 5173     │  Proxy  │   Port: 3001     │        │
│  │                  │         │                  │        │
│  │  Public Config:  │         │  Secrets:        │        │
│  │  - VITE_CHAT_    │         │  - JWT_PRIVATE_  │        │
│  │    BASE_URL      │         │    KEY           │        │
│  │                  │         │  - PASHUGPT_     │        │
│  │                  │         │    TOKEN         │        │
│  └──────────────────┘         └──────────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         │                              │
         │                              │
         ▼                              ▼
    Browser (Client)              External APIs
                                  (PashuGPT, Amul)
```

## How It Works

### 1. API Server (Express Backend)
- **Port**: 3001
- **Purpose**: Handles all API endpoints server-side
- **Secrets**: Contains `JWT_PRIVATE_KEY` and `PASHUGPT_TOKEN`
- **Endpoints**:
  - `POST /api/generate-token` - Generates JWT tokens
  - `GET /api/pashugpt/farmer` - Fetches farmer data
  - `GET /api/pashugpt/animal` - Fetches animal data
  - `GET /api/pashugpt/combined` - Combined data fetch
  - `POST /api/pashugpt/cvcc` - CVCC data
  - `* /api/amul/*` - Proxies to Amul APIs

### 2. Frontend (Vite Dev Server)
- **Port**: 5173
- **Purpose**: Serves React application
- **Configuration**: Only has access to `VITE_CHAT_BASE_URL` (public)
- **Proxy**: All `/api/*` requests are proxied to the API server

### 3. Request Flow

```
Browser Request: /api/generate-token
    │
    ▼
Vite Dev Server (port 5173)
    │
    │ Proxy configured in vite.config.ts
    ▼
API Server (port 3001)
    │
    │ Uses JWT_PRIVATE_KEY (server-side only)
    ▼
Response: { token: "..." }
    │
    ▼
Browser receives token (no secrets exposed)
```

## Security Benefits

✅ **Secrets Never Exposed**: `JWT_PRIVATE_KEY` and `PASHUGPT_TOKEN` only exist in the API server container
✅ **Server-Side Execution**: All API logic runs on the server, never in the browser
✅ **Network Isolation**: Services communicate via Docker internal network
✅ **Vercel-Compatible**: Same architecture pattern as Vercel serverless functions

## Comparison: Docker vs Vercel

| Aspect | Docker (Local) | Vercel (Production) |
|--------|---------------|---------------------|
| API Runtime | Express server | Serverless functions |
| Secret Storage | Environment variables | Environment variables |
| Request Handling | Express routes | Vercel API routes |
| Architecture | Two containers | Serverless functions |
| Secret Protection | ✅ Server-side | ✅ Server-side |

## Environment Variables

### API Server Container
- `JWT_PRIVATE_KEY` - ✅ **Secret** (server-side only)
- `PASHUGPT_TOKEN` - ✅ **Secret** (server-side only)
- `PASHUGPT_TOKEN_2` - ✅ **Secret** (server-side only)
- `PORT` - Configuration (default: 3001)

### Frontend Container
- `VITE_CHAT_BASE_URL` - Public configuration (exposed to browser)
- `VITE_API_SERVER` - Internal Docker network URL

## Running Locally (Without Docker)

If you want to run locally without Docker:

```bash
# Terminal 1: Start API server
npm run dev:server

# Terminal 2: Start frontend
npm run dev
```

The frontend will proxy API requests to `http://localhost:3001` (configured in `vite.config.ts`).

## Migration from Vite Plugin

Previously, the app used `vite-plugin-generate-token` to mock API endpoints. This had security issues:
- ❌ Secrets could be exposed in `vite.config.ts`
- ❌ API logic ran in Vite's Node process (not truly server-side)
- ❌ Not production-like

The new architecture:
- ✅ Secrets only in API server
- ✅ True server-side execution
- ✅ Matches production (Vercel) architecture
