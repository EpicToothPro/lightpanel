#!/usr/bin/env bg-sh
# ============================================================================
# LightPanel Automated Installer & Bootstrap Script
# Production-Ready Setup Script for Ubuntu / Debian Linux Servers
# ============================================================================

set -e

echo "⚡ LightPanel Private Infrastructure Control Panel Installer"
echo "=========================================================="

# Check for root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Error: Please run as root (sudo ./install.sh)"
  exit 1
fi

echo "🔍 Checking system dependencies..."
apt-get update -qq
apt-get install -y -qq curl git docker.io docker-compose-plugin nginx certbot postgresql redis-server

echo "📦 Setting up LightPanel directory..."
INSTALL_DIR="/opt/lightpanel"
mkdir -p "$INSTALL_DIR"
cp -r . "$INSTALL_DIR"

echo "⚙️ Initializing environment configuration..."
if [ ! -f "$INSTALL_DIR/.env" ]; then
  cp "$INSTALL_DIR/.env.example" "$INSTALL_DIR/.env"
  echo "✅ Created $INSTALL_DIR/.env from template"
fi

echo "🚀 Building LightPanel Backend & Frontend..."
cd "$INSTALL_DIR/backend" && npm install --quiet && npm run build
cd "$INSTALL_DIR/frontend" && npm install --quiet && npm run build

echo "🎉 LightPanel Installation Complete!"
echo "=========================================================="
echo "To start the panel:"
echo "  docker compose up -d"
echo "  OR run systemd service: systemctl start lightpanel"
echo ""
echo "Access the First-Run Setup Wizard at: http://<your-server-ip>:3000/setup"
