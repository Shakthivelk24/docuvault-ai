# ============================================================
# Stage 1: BUILD STAGE
# Uses Node.js to compile the React application
# ============================================================


# Alpine = minimal Linux image (~5MB vs ~100MB for full Debian)
# This reduces attack surface and build time
FROM node:22 AS builder

# Set working directory inside the container
# All subsequent commands run from this directory
WORKDIR /app

# Copy package files FIRST (before source code)
# Docker caches each layer. If package.json doesn't change,
# the npm install layer is reused - dramatically speeds up builds
COPY client/package.json client/package-lock.json ./

# Install dependencies
# --ci: uses package-lock.json exactly (reproducible builds)
# --only=production would skip devDependencies, but we need them for build
RUN npm ci

# Copy the rest of the frontend source code
# Done AFTER npm install so code changes don't invalidate the npm cache layer
COPY client/ .

# Set build-time environment variable for API URL
# This bakes the backend URL into the React bundle at compile time
# Override this in docker-compose or CI/CD for different environments
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the React application for production
# Vite compiles, minifies, and outputs to the /app/dist directory
RUN npm run build

# ============================================================
# Stage 2: PRODUCTION STAGE
# Uses lightweight Nginx to serve the compiled static files
# The builder stage artifacts are NOT included in this image
# ============================================================

# Nginx Alpine is extremely small (~23MB) and production-hardened
FROM nginx:alpine AS production

# Copy custom Nginx configuration
# Controls how Nginx serves the React SPA (Single Page App)
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled React assets from the builder stage
# ONLY the /app/dist files are copied - not node_modules, source code, etc.
# This is the key security benefit of multi-stage builds
COPY --from=builder /app/dist /usr/share/nginx/html

# Add labels for image metadata and traceability
LABEL maintainer="devops-team"
LABEL version="1.0"
LABEL description="Docuvault - Frontend"

# Document that Nginx serves on port 80
# This is metadata only - port mapping happens in docker-compose/kubernetes
EXPOSE 80

# Health check - Docker will periodically test if the container is healthy
# --interval: check every 30 seconds
# --timeout: fail after 5 seconds of no response
# --start-period: wait 10 seconds before first check (startup time)
# --retries: mark unhealthy after 3 consecutive failures
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

# Run Nginx in foreground (required for Docker - containers need a foreground process)
# 'daemon off' prevents Nginx from forking to background (which would cause container to exit)
CMD ["nginx", "-g", "daemon off;"]