# Realtime Notes

A realtime collaborative note-taking application built with modern full-stack technologies including Next.js, FastAPI, PostgreSQL, Docker, and WebSockets.

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

### Database
- PostgreSQL

### Infrastructure
- Docker
- Docker Compose

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