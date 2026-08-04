#!/usr/bin/env bash

# ============================================================================
# LightPanel Enterprise Installer & Setup Script
# Target Systems: Debian 11/12, Ubuntu 20.04/22.04/24.04 LTS, RHEL/AlmaLinux/Rocky 9
# ============================================================================

set -e

echo "------------------------------------------------------------"
echo " LightPanel Infrastructure Control Panel Installer"
echo "------------------------------------------------------------"

# 1. Require root privileges
if [ "$EUID" -ne 0 ]; then
  echo "[ERROR] Installation requires root privileges. Please run with sudo."
  exit 1
fi

REPO_URL="https://github.com/EpicToothPro/lightpanel.git"
TARGET_DIR="/opt/lightpanel"

# 2. Ensure git is installed
if ! command -v git &> /dev/null; then
  echo "[INFO] Installing Git package..."
  if command -v apt-get &> /dev/null; then
    apt-get update -qq && apt-get install -y -qq git
  elif command -v dnf &> /dev/null; then
    dnf install -y -q git
  elif command -v yum &> /dev/null; then
    yum install -y -q git
  fi
fi

# 3. Clone or pull repository to /opt/lightpanel
if [ ! -d "$TARGET_DIR/.git" ]; then
  echo "[INFO] Cloning LightPanel repository to $TARGET_DIR..."
  rm -rf "$TARGET_DIR"
  git clone "$REPO_URL" "$TARGET_DIR"
else
  echo "[INFO] Existing repository detected in $TARGET_DIR. Updating code..."
fi

cd "$TARGET_DIR"

# 4. Sync Git submodules
if [ -f ".gitmodules" ]; then
  echo "[INFO] Initializing Git submodules..."
  git submodule update --init --recursive || true
fi

# 5. Environment configuration (.env)
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    echo "[OK] Generated .env configuration from template."
  else
    JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "default_jwt_secret_key_32_bytes_long")
    DB_PASS=$(openssl rand -hex 16 2>/dev/null || echo "postgres_secure_pass")
    cat <<EOF > .env
PORT=3001
NODE_ENV=production
JWT_SECRET=${JWT_SECRET}
POSTGRES_PASSWORD=${DB_PASS}
DATABASE_URL=postgres://postgres:${DB_PASS}@postgres:5432/lightpanel
REDIS_URL=redis://redis:6379
EOF
    echo "[OK] Created default .env environment configuration."
  fi
fi

# 6. Verify docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
  echo "[ERROR] Configuration file 'docker-compose.yml' not found in $TARGET_DIR."
  exit 1
fi

# 7. Check Docker installation
echo "[INFO] Verifying Docker environment..."
if ! command -v docker &> /dev/null; then
  echo "[INFO] Docker not detected. Installing Docker engine via official script..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker || true
else
  echo "[OK] Docker engine verified."
fi

# Determine Docker Compose Command
DOCKER_COMPOSE_CMD=""
if docker compose version &> /dev/null; then
  DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
  DOCKER_COMPOSE_CMD="docker-compose"
else
  echo "[INFO] Installing Docker Compose plugin..."
  if command -v apt-get &> /dev/null; then
    apt-get update -qq && apt-get install -y -qq docker-compose-plugin 2>/dev/null || true
  fi
  if ! docker compose version &> /dev/null; then
    curl -fsSL "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    DOCKER_COMPOSE_CMD="docker-compose"
  else
    DOCKER_COMPOSE_CMD="docker compose"
  fi
fi

echo "[OK] Using Compose engine: '$DOCKER_COMPOSE_CMD'"

# 8. Build and start containers
echo "[INFO] Building and launching LightPanel service containers..."
$DOCKER_COMPOSE_CMD up -d --build

SERVER_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "server-ip")

echo "------------------------------------------------------------"
echo " LightPanel Installation Completed Successfully"
echo "------------------------------------------------------------"
echo " Access the First-Run Setup Wizard at:"
echo "   http://${SERVER_IP}:3000/setup"
echo ""
echo " Service Controls:"
echo "   View Status:  cd $TARGET_DIR && $DOCKER_COMPOSE_CMD ps"
echo "   View Logs:    cd $TARGET_DIR && $DOCKER_COMPOSE_CMD logs -f"
echo "   Restart:      cd $TARGET_DIR && $DOCKER_COMPOSE_CMD restart"
echo "------------------------------------------------------------"
