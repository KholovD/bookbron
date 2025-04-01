#!/bin/bash

# Environment variables
source .env

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Functions
log() {
  echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
  echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
  exit 1
}

# Check requirements
command -v docker >/dev/null 2>&1 || error "Docker is required but not installed"
command -v docker-compose >/dev/null 2>&1 || error "Docker Compose is required but not installed"

# Build application
log "Building application..."
pnpm build || error "Build failed"

# Build Docker image
log "Building Docker image..."
docker build -t internetcafe:latest . || error "Docker build failed"

# Push to registry
if [ ! -z "$DOCKER_REGISTRY" ]; then
  log "Pushing to registry..."
  docker tag internetcafe:latest $DOCKER_REGISTRY/internetcafe:latest
  docker push $DOCKER_REGISTRY/internetcafe:latest || error "Push to registry failed"
fi

# Deploy
log "Deploying to server..."
ssh $DEPLOY_USER@$DEPLOY_HOST << 'ENDSSH'
  cd /opt/internetcafe
  docker-compose pull
  docker-compose up -d
  docker system prune -f
ENDSSH

# Check deployment
log "Checking deployment status..."
for i in {1..30}; do
  if curl -s https://internetcafe.uz/health | grep -q "ok"; then
    log "Deployment successful!"
    exit 0
  fi
  sleep 2
done

error "Deployment health check failed" 