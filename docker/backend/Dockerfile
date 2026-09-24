# ============================================================
# Stage 1: DEPENDENCY INSTALLATION
# Separates dependency install from app copy for cache efficiency
# ============================================================

FROM node:22-alpine AS dependencies

# Update npm to the latest version
RUN npm install -g npm@latest

# Install OS packages needed for native npm modules
# python3, make, g++: required to compile native addons (bcrypt, canvas, etc.)
# dumb-init: proper PID 1 init system for containers
RUN apk add --no-cache python3 make g++ dumb-init

WORKDIR /app

# Copy only package files to leverage Docker layer caching
COPY server/package.json server/package-lock.json ./

# Install ALL dependencies (including devDependencies for now)
# --ci: strict mode using package-lock.json
RUN npm ci

# ============================================================
# Stage 2: PRODUCTION IMAGE
# ============================================================

FROM node:22-alpine AS production

# Update npm to the latest version
RUN npm install -g npm@latest

# Install dumb-init in the production image
# dumb-init correctly handles PID 1 responsibilities:
# - Forwards signals (SIGTERM for graceful shutdown)
# - Reaps zombie processes
RUN apk add --no-cache dumb-init

# Create non-root user for security
# Running as root in containers is a security risk
# 'nodejs' user and 'nodejs' group with fixed IDs for consistency
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs

WORKDIR /app

# Copy node_modules from the dependencies stage
# This avoids reinstalling packages in the production stage
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application source code
# --chown: sets ownership to nodejs user (not root)
COPY --chown=nodejs:nodejs server/ .

# Switch to non-root user
# All subsequent commands and the final process run as 'nodejs'
USER nodejs

# Document the port the backend listens on
EXPOSE 5000

# Image metadata labels
LABEL maintainer="devops-team"
LABEL version="1.0"
LABEL description="DocuVault - Backend API"

# Health check for the backend API
# Checks the /api/health endpoint every 30 seconds
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/api/health || exit 1

# Use dumb-init as the entry point wrapper
# dumb-init then executes node as its child process
# This ensures proper signal handling and process management
ENTRYPOINT ["dumb-init", "--"]

# Start the Node.js application
# Using node directly instead of npm for production
# (npm adds unnecessary overhead and signal handling issues)
CMD ["node", "server.js"]