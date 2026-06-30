# Collaborative Code Editor

A real-time collaborative code editor where multiple users can write and edit code simultaneously in the same shared workspace — like Google Docs, but for code.

**Live Demo:** [docker-aws-yt-ALB-29765385.ap-northeast-1.elb.amazonaws.com](http://docker-aws-yt-ALB-29765385.ap-northeast-1.elb.amazonaws.com)

---

## Features

- **Real-time collaboration** — changes sync instantly across all connected clients using Yjs CRDTs
- **Monaco Editor** — the same editor that powers VS Code
- **Live user presence** — sidebar shows all users currently connected to the session
- **Username persistence** — username is stored in the URL so it survives page reloads
- **Single Docker image** — Frontend is built and served statically by the Express backend

---

## Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 19 + Vite | UI framework and dev server |
| Monaco Editor (`@monaco-editor/react`) | Code editor |
| Yjs | CRDT-based real-time sync |
| y-monaco | Yjs binding for Monaco |
| y-socket.io | Yjs Socket.IO transport provider |
| TailwindCSS v4 | Styling |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express | HTTP server |
| Socket.IO | WebSocket transport |
| y-socket.io (server) | Yjs document sync over Socket.IO |

### Infrastructure
| Tech | Purpose |
|---|---|
| Docker | Multi-stage build (builds frontend, serves via backend) |
| AWS ECS (Fargate) | Container hosting |
| AWS ALB | Load balancer / public entry point |

---

## Architecture

```
Browser (React + Monaco + Yjs)
        │  WebSocket (Socket.IO)
        ▼
Express Server (Node.js)
  ├── Serves built Frontend as static files (/public)
  └── y-socket.io syncs Yjs documents between all connected clients
```

The Docker image uses a **multi-stage build**:
1. Stage 1 — builds the React frontend (`npm run build` → `dist/`)
2. Stage 2 — copies the backend, installs deps, copies `dist/` into `backend/public/`, and runs `node server.js`

---

## Running Locally

### Prerequisites
- Node.js 20+
- Docker (optional, for containerized run)

### Without Docker

**Backend:**
```bash
cd Backend
npm install
npm run dev
```

**Frontend** (in a separate terminal):
```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173` in multiple tabs/browsers, enter different usernames, and start collaborating.

### With Docker

```bash
# Build the image
docker build -t collaborative-editor .

# Run the container
docker run -p 4000:3000 collaborative-editor
```

Open `http://localhost:4000` in multiple tabs.

---

## Project Structure

```
.
├── dockerfile
├── Frontend/
│   └── src/
│       └── app/
│           └── App.jsx        # Main React component
└── Backend/
    └── server.js              # Express + Socket.IO + y-socket.io server
```

---

## Deployment

Deployed on **AWS ECS (Fargate)** behind an **Application Load Balancer**.

- Docker image pushed to **AWS ECR**
- ECS Task Definition runs the container on port `3000`
- ALB forwards public traffic on port `80` → container port `3000`
