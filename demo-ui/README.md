# Amul API Demo UI

A React + TypeScript demo application for testing and demonstrating Amul API integrations for a dairy farming chatbot.

## Tech Stack

- React 19.2.0 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Vercel (deployment with serverless functions)

## Development Setup

### Option 1: Using Vercel Dev (Recommended - Matches Production)

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

### Option 2: Using Vite Dev (Quick Frontend Development)

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

Create a `.env` file in the `demo-ui` directory:

```env
JWT_PRIVATE_KEY=your-private-key-in-pkcs8-format
VITE_CHAT_BASE_URL=https://dev-amulmitra.amul.com
```

**Note:** `JWT_PRIVATE_KEY` should be in PKCS#8 format (starts with `-----BEGIN PRIVATE KEY-----`). If stored as an env var, ensure newlines are preserved (use `\n` or actual newlines).

## API Endpoints

### Serverless Functions (Vercel)

- `/api/generate-token` - Generates JWT token with farmer/animal data
- `/api/pashugpt/farmer` - Proxy to PashuGPT farmer API
- `/api/pashugpt/animal` - Proxy to PashuGPT animal API

### Proxied APIs (Vite Dev)

- `/api/amul/*` - Proxied to `https://farmer.amulamcs.com`

## Build & Deploy

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to Vercel.

## Project Structure

```
demo-ui/
├── api/                    # Vercel serverless functions
│   ├── generate-token.ts   # JWT token generation
│   └── pashugpt/           # PashuGPT API proxies
├── src/
│   ├── components/         # React components
│   ├── api.ts              # API client functions
│   └── types.ts            # TypeScript types
├── vite.config.ts          # Vite configuration
├── vite-plugin-generate-token.ts  # Vite plugin for local dev
└── vercel.json             # Vercel configuration
```

## Why Two Dev Modes?

**The Problem:** Vite doesn't understand Vercel serverless functions. The `/api` directory files are only executed by Vercel.

**The Solution:** 
- **Production/Vercel Dev**: Vercel automatically runs files in `/api` as serverless functions
- **Vite Dev**: We use a plugin to mock the `/api/generate-token` endpoint locally

**Recommendation:** Use `vercel dev` for full-stack testing, and `vite dev` for quick frontend iterations.
