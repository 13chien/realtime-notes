# Realtime Notes

A realtime collaborative note-taking application built with modern full-stack technologies including Next.js, FastAPI, PostgreSQL, Docker, and WebSockets.

---

## Live Demo

https://realtime-notes-eta.vercel.app

---

## Features

- Realtime collaborative editing using WebSockets
- Workspace-based note isolation
- Autosave with debounced synchronization
- Persistent PostgreSQL storage
- Dynamic workspace routing
- Component-based frontend architecture
- REST API + WebSocket hybrid architecture
- Dockerized local database setup
- Loading and error state handling
- Cloud deployment with distributed services

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- TailwindCSS

### Backend
- FastAPI
- SQLAlchemy ORM
- WebSockets
- Uvicorn

### Database
- PostgreSQL

### Infrastructure
- Docker
- Docker Compose
- Vercel
- Render
- Neon

---

## Architecture

```text
Browser
↓
Next.js Frontend
↓ REST API + WebSocket
FastAPI Backend
↓
PostgreSQL
```

### Realtime Synchronization Flow

```text
User A edits note
↓
Frontend sends WebSocket update
↓
FastAPI broadcasts update
↓
User B receives live update instantly
```

---

## Deployment

The application is deployed using a modern cloud-based architecture.

### Frontend
- Hosted on Vercel
- Next.js production deployment
- Environment-based API configuration

### Backend
- Hosted on Render
- FastAPI application served with Uvicorn
- REST API + WebSocket support

### Database
- Hosted on Neon
- Serverless PostgreSQL database
- Cloud-managed persistence layer

### Infrastructure Flow

```text
User Browser
↓
Vercel (Next.js Frontend)
↓ REST API + WebSocket
Render (FastAPI Backend)
↓
Neon PostgreSQL
```

---

## Project Structure

```text
realtime-notes/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│
├── docker-compose.yml
└── README.md
```

---

## Workspaces

Each workspace has isolated notes using dynamic routes.

Examples:

```text
/workspace/breandon
/workspace/demo
/workspace/team-a
```

Workspace-specific WebSocket rooms enable realtime collaboration scoped to individual workspaces.

---

## Local Development

### 1. Start PostgreSQL

```bash
docker compose up -d
```

---

### 2. Start Backend

```bash
cd backend

source venv/bin/activate

uvicorn main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

---

### 3. Start Frontend

```bash
cd frontend

npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Environment Variables

### Frontend

```env
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_WS_BASE_URL=
```

### Backend

```env
DATABASE_URL=
```

---

## Current Limitations

- Workspace authentication is not implemented yet
- WebSocket synchronization is optimized for learning/demo purposes
- Conflict resolution for simultaneous editing is simplified

---

## Future Improvements

- Workspace authentication and passwords
- Online presence indicators
- Rich text editing
- Markdown support
- Redis Pub/Sub for scalable realtime broadcasting
- CRDT/Yjs conflict resolution
- Mobile responsiveness
- Presence and typing indicators
- Shareable invite links

---

## Learning Goals

This project was built to explore:

- Modern full-stack architecture
- Realtime systems using WebSockets
- Component-driven frontend design
- Database persistence and ORM usage
- Dockerized local development
- REST + realtime hybrid communication patterns
- Cloud deployment workflows
- Distributed application architecture

---

## Screenshots

_Add screenshots and demo GIFs here._

---

## License

MIT License