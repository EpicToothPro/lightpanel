#!/usr/bin/env bash

# ============================================================================
# LightPanel Automated Installer & DevOps Bootstrap Script
# Supports: Debian 11/12, Ubuntu 20.04/22.04/24.04 LTS, RHEL/AlmaLinux/Rocky 9
# ============================================================================

set -e

echo "⚡ LightPanel Private Infrastructure Control Panel Installer"
echo "=========================================================="

# 1. Require root or sudo privileges
if [ "$EUID" -ne 0 ]; then
  echo "❌ Error: Please run this installer as root (e.g. sudo ./install.sh)"
  exit 1
fi

REPO_URL="https://github.com/EpicToothPro/lightpanel.git"
TARGET_DIR="/opt/lightpanel"
CURRENT_DIR="$(pwd -P 2>/dev/null || echo '')"

# 2. Smart Repository Acquisition (Clone or Update)
if [ ! -d "$TARGET_DIR/.git" ]; then
  echo "📥 Cloning LightPanel repository from GitHub to $TARGET_DIR..."
  mkdir -p "$TARGET_DIR"
  git clone "$REPO_URL" "$TARGET_DIR"
  cd "$TARGET_DIR"
else
  REAL_TARGET_DIR="$(cd "$TARGET_DIR" && pwd -P)"
  if [ "$CURRENT_DIR" != "$REAL_TARGET_DIR" ]; then
    echo "📦 Copying files to $TARGET_DIR..."
    cp -r . "$TARGET_DIR/"
    cd "$TARGET_DIR"
  else
    echo "📂 Running inside $TARGET_DIR"
  fi
fi

# 3. Handle Git Submodules Automatically
if [ -d ".git" ] || [ -f ".gitmodules" ]; then
  echo "🔄 Syncing Git submodules..."
  git submodule update --init --recursive || true
fi

# 4. Environment File (.env) Handling
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    echo "✅ Generated .env from .env.example"
  else
    echo "JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo 'default_jwt_secret_key_32_bytes_long')" > .env
    echo "POSTGRES_PASSWORD=$(openssl rand -hex 16 2>/dev/null || echo 'postgres_secure_pass')" >> .env
    echo "✅ Generated default .env file"
  fi
fi

# 5. Robust Docker & Docker Compose Installation
echo "🔍 Checking Docker installation..."
if ! command -v docker &> /dev/null; then
  echo "🚀 Docker not detected. Installing Docker via official script (https://get.docker.com)..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker || true
else
  echo "✅ Docker is already installed."
fi

# Determine Docker Compose Command
DOCKER_COMPOSE_CMD=""
if docker compose version &> /dev/null; then
  DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
  DOCKER_COMPOSE_CMD="docker-compose"
else
  echo "🚀 Installing Docker Compose plugin..."
  apt-get update -qq && apt-get install -y -qq docker-compose-plugin 2>/dev/null || \
  curl -fsSL "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose
  
  if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
  else
    DOCKER_COMPOSE_CMD="docker-compose"
  fi
fi

echo "✅ Docker Compose command: '$DOCKER_COMPOSE_CMD'"

# 6. Build and Launch Containers
echo "🚀 Building and starting LightPanel containers..."
$DOCKER_COMPOSE_CMD up -d --build

SERVER_IP="$(hostname -I 2>/dev/null | awk '{print $1}' || echo 'your-server-ip')"

echo ""
echo "🎉 LightPanel Installation Successfully Completed!"
echo "=========================================================="
echo "Access the First-Run Setup Wizard at:"
echo " 👉 http://${SERVER_IP}:3000/setup"
echo ""
echo "Useful Commands:"
echo "  View status:  cd $TARGET_DIR && $DOCKER_COMPOSE_CMD ps"
echo "  View logs:    cd $TARGET_DIR && $DOCKER_COMPOSE_CMD logs -f"
echo "  Restart:      cd $TARGET_DIR && $DOCKER_COMPOSE_CMD restart"
echo "=========================================================="
