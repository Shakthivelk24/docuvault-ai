# ============================================================
# Stage 1: DEPENDENCY INSTALLATION
# ============================================================

FROM node:22-alpine AS dependencies

# Update Alpine package index and upgrade installed OS packages
RUN apk update && \
    apk upgrade

# Install OS packages needed for native npm modules
RUN apk add --no-cache python3 make g++ dumb-init

WORKDIR /app

COPY server/package.json server/package-lock.json ./

# Install application dependencies
RUN npm ci


# ============================================================
# Stage 2: PRODUCTION IMAGE
# ============================================================

FROM node:22-alpine AS production

# Update Alpine package index and upgrade installed OS packages
RUN apk update && \
    apk upgrade

# Install dumb-init
RUN apk add --no-cache dumb-init

# Remove npm and npx from the production image.
# The application runs directly with Node.js.
RUN rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/bin/npm \
           /usr/local/bin/npx

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs

WORKDIR /app

# Copy application dependencies
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy backend source
COPY --chown=nodejs:nodejs server/ .

# Run as non-root
USER nodejs

EXPOSE 5000

LABEL maintainer="devops-team"
LABEL version="1.0"
LABEL description="DocuVault - Backend API"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/api/health || exit 1

# Proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start application directly with Node.js
CMD ["node", "server.js"]