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

## 2. Setup 
- **laravel react starter kit** : https://laravel.com/docs/12.x/starter-kits#react
-    It will give signup, login and dashboard using react immidiately 
- **Run migration command** :  php artisan migrate
- **Install & Configure  Redis**  :  sudo apt install redis-server
    - *Enable Redis*:  sudo systemctl enable redis-server
    - *Start Redis  Server* : sudo systemctl start redis-server
    - *Check Redis* : redis-cli ping (it will give output as pong)

- **Install Laravel Pusher** : npm install laravel-echo pusher-js
- **Install Brodcast** :  php artisan install:brodcasting
- **Migration Message Table**: php artisan make:migration create_messages_table
- **Create Message Model**: php artisan make:model Message
- **Install Api**: php artisan install:api
- **Make Message API Controller**: php artisan make:controller Api/MessageController
- **Create Validation Request(Form Validate)**: php artisan make:request StoreMessageRequest
- **Create Message Event** : php artisan make:event MessageReceived
- **Create Job** : php artisan make:job ProcessMessageJob
- **Make Web MessageController** : php artisan make:controller MessagesPageController

## 3. Run Server 
- **Run Web vite and local server**: composer run dev



## 4. Clone th Project  repository

```bash
git clone <your-repo-url> realtime-notify
cd realtime-notify
