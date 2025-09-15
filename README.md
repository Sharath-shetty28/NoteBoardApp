# <h1 align="center">📝 NotesBoardApp ✨</h1>

A lightweight, offline-capable notes application built with the **MERN** stack (MongoDB, Express, React, Node). The app is responsive, installable as a **PWA**, and supports offline note creation that syncs to the server when the device regains connectivity. It also protects the API with **rate limiting using Upstash Redis** and follows a clean, easy-to-follow folder structure.

---

## Key features

* Offline-first PWA: installable, small download size, and works offline.
* Offline note sync: notes created offline are stored locally and synced when online.
* Rate limiting via **Upstash Redis** to protect APIs.
* Responsive UI for desktop/tablet/mobile.
* Clean folder structure for maintainability and easy contribution.

---

## Demo

> Add a short demo GIF or screenshot here (recommended).

---

## Tech stack

* **Frontend:** React (Vite or Create React App), Service Worker (Workbox or native), localForage / IndexedDB for offline storage
* **Backend:** Node.js, Express
* **Database:** MongoDB (Atlas recommended)
* **Rate limiting & cache:** Upstash Redis (serverless Redis)
* **Deployment:** Render

---

## Prerequisites

* Node.js v16+
* npm 
* MongoDB connection string (Atlas or self-hosted)
* Upstash Redis REST/URL & token (for rate limiting)

---

## Quick start (development)

### 1. Clone repository

```bash
git clone https://github.com/<your-username>/NoteBoardApp.git
cd NoteBoardApp
```

### 2. Install dependencies

```bash
# from repo root (if repo has packages separated)
cd backend && npm install
cd frontend && npm install
```

### 3. Environment variables

Create `.env` files in `backend/` and `frontend/` as needed. Example variables for `backend/.env`:

```
PORT=5001
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/notesdb?retryWrites=true&w=majority
UPSTASH_REDIS_REST_URL=https://usX1-web-..../
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```


> **Security note:** Never commit `.env` files or secrets to git. Use repository secrets for CI/CD.

### 4. Run in development

```bash
# backend
cd backend
npm run dev

# frontend
cd frontend
npm run dev
```

Open `http://localhost:5173` (Vite default) or port shown by your dev server.

---

## Production build

* Build frontend: `cd frontend && npm run build` and deploy the `dist`/`build` folder to your static host.
* Deploy backend to your chosen provider, set environment variables and point frontend `VITE_API_URL` to the production backend.

---

## Important implementation notes

### Rate limiting with Upstash Redis

* The backend uses a middleware that uses Upstash Redis REST API to store counters per IP or per API key.
* A simple sliding-window or fixed-window algorithm is recommended:

  * increment the counter for `key = rate_limit:${ip}` on each request
  * set TTL to the window size (e.g., 60 seconds)
  * block requests when the counter exceeds the allowed requests
* Upstash has a simple REST endpoint; use the official client or plain HTTP fetch for serverless environments.

### PWA & offline sync

* Service worker caches static assets (app shell) and acts as a network-first or cache-first strategy for API responses depending on the route.
* Use IndexedDB (via a wrapper like `localForage`) to store offline notes.
* Use LocalStorage to store offline notes with a generated unique ID.
* When the app is back online, the user decides whether to sync:
* Manual sync button on each note to sync individually.
* Sync All button to push all offline notes at once.


---

## Folder structure (clean, suggested)

```text
notesboardapp/
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── server.js            # app entry            
│   │   ├── routes/
│   │   │   ├── notesRoutes.js
│   │   ├── controllers/
│   │   │   └── notesController.js
│   │   ├── models/
│   │   │   └── Note.js
│   │   ├── middleware/
│   │   │   ├── rateLimiter.js  # Upstash Redis integration
│   │   ├── config/
│   │   │   ├── db.js 
│   │   |   └── upstash.js
│   └── .env

├── frontend/
│   ├── package.json
│   ├── public/
│   │   ├── favicon.ico      # PWA manifest
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── noteServices.js
│   │   ├── idb.js   #localstorage
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   │   ├── NoteCard.jsx
│   │   │   └── NotesNotFound.jsx
│   │   │   └── RateLimitedUI.jsx  
│   │   ├── lib/
│   │   │   ├── axios.js
│   │   │   └── utils.js
│   │   ├── pages/
│   │   │   ├── CreatePage.jsx
│   │   │   └── HomePage.jsx
│   │   │   └── NoteDetailPage.jsx
├── README.md         # this file
└── .gitignore
```

---

## API endpoints (suggested)

* `POST /api/notes` - create note
* `GET /api/notes` - list notes for user
* `PUT /api/notes/:id` - update note
* `DELETE /api/notes/:id` - delete note

Each endpoint should be protected by rate-limiter middleware.

---

## Testing

* Unit test controllers, services,  and endpoints with Postman.
* Test offline behavior with browser devtools (simulate offline) and verify sync queue.

---

## Deployment tips

* Use environment secrets for DB and Upstash credentials.
* Use HTTPS for service worker and sync to function properly in production.

---

## Contributing

1. Fork the project
2. Create a feature branch `feature/your-feature`
3. Open a PR with a clear description

---




