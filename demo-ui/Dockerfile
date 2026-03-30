# Multi-stage build for demo-ui frontend (React + Vite -> nginx)
FROM node:20-alpine AS builder

# VITE_CHAT_BASE_URL is baked into the JS bundle at build time
ARG VITE_CHAT_BASE_URL=https://dev-amulmitra.amul.com
ENV VITE_CHAT_BASE_URL=$VITE_CHAT_BASE_URL

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application (Vite reads VITE_* env vars)
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration (optional - for SPA routing)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
