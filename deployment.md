# Deployment Guide

This document explains how to deploy the COD Mobile FPS project using **Docker**, **Render**, and **Vercel**.

---

## 1. Docker Deployment

### Prerequisites
- Docker & Docker Compose installed

### Files Created
- `Dockerfile`
- `docker-compose.yml`

### Build & Run Locally

```bash
# Build the Docker image
docker build -t cod-mobile .

# Run with docker-compose
docker-compose up --build
```

### Production Docker

```bash
docker build -t cod-mobile:latest .
docker run -p 3000:3000 cod-mobile:latest
```

---

## 2. Render Deployment (Recommended)

### Steps

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New +** → **Web Service**
4. Connect your repository (`productionsaiinc-lgtm/COD`)
5. Use these settings:

| Setting              | Value                                      |
|----------------------|--------------------------------------------|
| **Environment**      | `Node`                                     |
| **Build Command**    | `pnpm install && pnpm run build`           |
| **Start Command**    | `node dist/index.js`                       |
| **Plan**             | Starter (or higher)                        |

### `render.yaml` (Recommended)

A `render.yaml` file has been added to your repo:

```yaml
services:
  - type: web
    name: cod-mobile
    env: node
    region: oregon
    plan: starter
    buildCommand: pnpm install && pnpm run build
    startCommand: node dist/index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

Render will automatically detect this file.

---

## 3. Vercel Deployment

> **Note**: Vercel is better suited for frontend-only apps. For full-stack apps with a backend, **Render** is recommended.

### Steps

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Login:
   ```bash
   vercel login
   ```
3. Deploy:
   ```bash
   vercel
   ```

### `vercel.json` Configuration

A `vercel.json` file has been added:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/dist/index.js"
    }
  ]
}
```

---

## Summary Recommendation

| Platform     | Recommended?     | Difficulty | Notes                                   |
|--------------|------------------|------------|-----------------------------------------|
| **Render**   | ✅ Yes           | Easy       | Best for full-stack Node.js apps        |
| **Docker**   | ✅ Yes           | Medium     | Good for self-hosting or VPS            |
| **Vercel**   | ⚠️ Partial       | Medium     | Better for frontend-only projects       |

---

## Environment Variables

Make sure these are set:

- `NODE_ENV=production`
- `PORT=10000` (Render sets this automatically)

---

Need help with any specific platform? Just ask!