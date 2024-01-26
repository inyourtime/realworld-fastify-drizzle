# Use a multi-stage build for efficiency
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml first to leverage caching
COPY package*.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy remaining project files
COPY . .

# Compile TypeScript code
RUN pnpm run build

# Create a production-ready image with minimal dependencies
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

RUN npm install -g pnpm

# Copy compiled code from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Install only production dependencies using pnpm
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Expose the port your application runs on
EXPOSE 5000

# Start the application
CMD ["pnpm", "start"]
