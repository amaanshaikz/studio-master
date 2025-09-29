# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Set dummy environment variables for build (to prevent build failures)
ENV NEXTAUTH_SECRET=dummy-secret-for-build
ENV NEXTAUTH_URL=http://localhost:8080
ENV DATABASE_URL=dummy-database-url
ENV SUPABASE_URL=https://example.supabase.co
ENV SUPABASE_ANON_KEY=dummy-supabase-key
ENV NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy-supabase-key
ENV SUPABASE_SERVICE_ROLE_KEY=dummy-service-role-key
ENV ENCRYPTION_KEY=1234567890abcdef1234567890abcdef
ENV GOOGLE_CLIENT_ID=dummy-google-client-id
ENV GOOGLE_CLIENT_SECRET=dummy-google-client-secret
ENV INSTAGRAM_CLIENT_ID=dummy-instagram-client-id
ENV INSTAGRAM_CLIENT_SECRET=dummy-instagram-client-secret
ENV LINKEDIN_CLIENT_ID=dummy-linkedin-client-id
ENV LINKEDIN_CLIENT_SECRET=dummy-linkedin-client-secret

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Cloud Run expects port 8080
EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
