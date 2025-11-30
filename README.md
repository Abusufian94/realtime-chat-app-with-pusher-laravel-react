# Real-Time Notification System (Laravel 12 + Inertia React + Pusher)

This project is a **real-time notification / chat-style system** built with:

- **Laravel 12** (API, queues, events, broadcasting)
- **Inertia + React** (SPA-like frontend)
- **Redis** (queue driver)
- **Pusher** (real-time WebSocket broadcasting)

Users can send messages, which are:

1. Stored in the database
2. Processed in the background by a queued job
3. Broadcast in real-time to all other connected clients via Pusher
4. Shown in a chat UI with:
   - Left/right chat bubbles
   - Sender name
   - Human-readable timestamps
   - Simple read indicator (single/double tick)
   - Notification sound for receivers
   - Toast with unread message counter when not scrolled to bottom

---

## 1. Requirements

Make sure you have:

- **PHP** ≥ 8.2
- **Composer**
- **Node.js** ≥ 18 and **npm**
- **MySQL** / Postgres / SQLite (any Laravel-supported DB)
- **Redis** server (for queues)
- A **Pusher** account + app (for WebSockets)

Optional but recommended:

- Git (for workflow & versioning)

---

## 2. Installation

### 2.1. Clone the repository

```bash
git clone <your-repo-url> realtime-notify
cd realtime-notify
