# ============================================================
# Stage 1: DEPENDENCY INSTALLATION
# Separates dependency install from app copy for cache efficiency
# ============================================================

FROM node:22-alpine AS dependencies

# Install OS packages needed for native npm modules
# python3, make, g++: required to compile native addons
# dumb-init: proper PID 1 init system
RUN apk add --no-cache python3 make g++ dumb-init

WORKDIR /app

# Copy only package files to leverage Docker layer caching
COPY server/package.json server/package-lock.json ./

# Install dependencies using the exact package-lock.json
RUN npm ci


# ============================================================
# Stage 2: PRODUCTION IMAGE
# ============================================================

FROM node:22-alpine AS production

# Install dumb-init in the production image
# dumb-init correctly handles PID 1 responsibilities
# and forwards signals for graceful shutdown
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs

WORKDIR /app

# Copy node_modules from dependency stage
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy backend application source
COPY --chown=nodejs:nodejs server/ .

# Run the application as a non-root user
USER nodejs

# Backend listens on port 5000
EXPOSE 5000

# Image metadata
LABEL maintainer="devops-team"
LABEL version="1.0"
LABEL description="DocuVault - Backend API"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/api/health || exit 1

# Proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start backend directly with Node.js
CMD ["node", "server.js"]