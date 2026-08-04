# LightPanel — Private Self-Hosted Web-Hosting Control Panel

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14%2F16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-red)](https://redis.io/)

**LightPanel** is a production-ready, security-first private web-hosting control panel designed for infrastructure management on self-hosted Linux VPS servers and bare-metal nodes.

> **Note**: LightPanel is strictly for personal infrastructure management. It is not a game panel, public SaaS, or customer billing system.

---

## 🌟 Key Architecture & Features

### Core Infrastructure & App Management
- **Universal Runtime Support**:
  - Node.js (v18, v20, v22)
  - Next.js (SSR & Static)
  - PHP (v7.4, v8.1, v8.2, v8.3) via PHP-FPM
  - Python (WSGI / FastAPI / Django)
  - Java & Kotlin (JVM / Spring Boot)
  - .NET (v8.0)
  - Ruby (Rails / Puma)
  - Perl & Static HTML/CSS/JS
- **One-Click SSL/TLS**: Automatic Let's Encrypt certificates via Certbot (`HTTP-01` and `DNS-01` challenges) for root domains, `www` aliases, subdomains, and wildcard domains.
- **Database Engine Provisioning**: PostgreSQL, MariaDB/MySQL, MongoDB, and Redis instances with password toggles, storage monitoring, and link bindings.
- **File Manager & Danger-Zone Terminal**: Integrated browser file manager with path traversal protections and safe shell allowlist validation.
- **Deployments & Rollbacks**: Git-based automated builds, duration metrics, live build log streaming, and instant rollback capabilities.

### Complete Email Hosting Suite & Integrated Webmail
- **Email Domains & Mailboxes**: Manage email accounts, multi-domain routing, catch-all addresses, and group distribution lists.
- **Browser-Based Webmail Client (`/email/webmail`)**: Full IMAP/SMTP browser mail client featuring Inbox, Sent, Drafts, Spam, Trash, Archive, Address Book, Compose modal, and attachment support.
- **Spam & Anti-Abuse Controls**: SpamAssassin score threshold tuning, Greylisting bot mitigation, Bayesian ML filter, and interactive Blacklist/Whitelist domain/IP rules.
- **DNS & Mail Auth Helpers**: Auto-generated MX, SPF, DKIM, DMARC, and A records with copy-to-clipboard buttons and verification badges.

### Security, Sharing & Quota System
- **Role-Based Access Control (RBAC)**: Owner, Administrator, Standard User, and Read-Only roles.
- **Project & Resource Sharing**: Share individual websites, apps, databases, or mailboxes with specific team members without granting full root access.
- **Configurable Quotas**: Default behavior is **Unlimited** (clearly displayed in UI), with optional per-user or per-service overrides.
- **Privacy-Conscious Analytics (`/analytics`)**: Lightweight per-site, per-app, per-domain traffic analytics (pageviews, unique visitors, top referrers, device/country breakdown) with a global and per-domain enable/disable toggle.
- **10-Step Setup Wizard (`/setup`)**: Seamless first-run onboarding flow.

---

## 📁 Repository Structure

```text
lightpanel/
├── backend/                  # Node.js + TypeScript Express REST API & Worker Engine
│   ├── src/
│   │   ├── index.ts          # Main Express server & WebSocket log stream
│   │   ├── config.ts         # Environment variables & default quotas
│   │   ├── db/
│   │   │   └── schema.sql    # Complete PostgreSQL database schema
│   │   ├── middleware/
│   │   │   └── auth.ts       # JWT Auth, RBAC, Path Traversal & Security Allowlist
│   │   ├── controllers/      # Auth, Setup, Resources, Email & Analytics APIs
│   │   ├── workers/          # Redis background job queue runner
│   │   └── tests/            # Security & unit test suite
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # Next.js 14/16 App Router Control Panel Dashboard
│   ├── src/
│   │   ├── app/              # 34 Complete UI pages (Dashboard, Email, Webmail, etc.)
│   │   ├── components/       # Layout shell, Sidebar, Topbar, StatCards, Badges, Dialogs
│   │   ├── lib/              # API client, Mock data provider, Utility helpers
│   │   └── types/            # Complete TypeScript interface definitions
│   ├── package.json
│   └── globals.css           # Premium Dark Theme Design System
├── docker-compose.yml        # Docker Compose orchestration
├── install.sh                # One-command automated Linux installer script
└── .env.example              # Template environment configuration
```

---

## 🚀 Quick Start & Installation

### Option A: Automated One-Command Installer (Linux VPS)
```bash
sudo ./install.sh
```

### Option B: Docker Compose Local/Production Deployment
```bash
# 1. Clone repository
git clone https://github.com/your-username/lightpanel.git
cd lightpanel

# 2. Configure environment
cp .env.example .env

# 3. Start services with Docker Compose
docker compose up -d
```

---

## ⚡ First-Run Setup Wizard

Once the services are running, open your browser and navigate to:
```text
http://<your-server-ip>:3000/setup
```

Follow the 10-step wizard:
1. **Server Identity** (Hostname configuration)
2. **Admin Account Creation** (Master credentials)
3. **PostgreSQL Database** (Panel database connection)
4. **Redis Cache & Queue** (Task runner setup)
5. **Mail Server Config** (Postfix / Dovecot setup)
6. **Domain & SSL Settings** (Auto Let's Encrypt toggle)
7. **Storage & Quota Defaults** (Unlimited default validation)
8. **Runtime Engine Defaults** (Node, Next, PHP, Python, Java, etc.)
9. **Analytics Toggle** (Privacy mode configuration)
10. **Review & Provision** (Complete setup and launch panel)

---

## 🧪 Testing & Verification

Run backend security and allowlist tests:
```bash
cd backend
npm test
```

Run Next.js build verification:
```bash
cd frontend
npm run build
```

---

## 📄 License
Released under the [MIT License](LICENSE).
