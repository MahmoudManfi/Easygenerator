# Frontend Dockerfile - Using React Dev Server
FROM node:18-alpine

WORKDIR /app

# Install wget for healthchecks
RUN apk add --no-cache wget

# Copy package files
COPY package.json ./

# Remove package-lock.json if it exists to ensure clean install
RUN rm -f package-lock.json

# Install dependencies with legacy peer deps to handle conflicts
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build arguments for environment variables (passed from docker-compose.yml)
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Expose port (React dev server default is 3000)
EXPOSE 3000

# Start React development server
CMD ["npm", "start"]
