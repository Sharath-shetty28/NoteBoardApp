<h1 align="center">📝 MERN Stack Note Taking App ✨</h1>



Highlights:

- 🧱 Full-Stack App Built with the MERN Stack (MongoDB, Express, React, Node)
- ✨ Create, Update, and Delete Notes with Title Description
- 🛠️ Build and Test a Fully Functional REST API
- ⚙️ Rate Limiting with Upstash Redis 
- 🚀 Completely Responsive UI


---

## 🧪 .env Setup

### Backend (`/backend`)

```
MONGO_URI=<your_mongo_uri>

UPSTASH_REDIS_REST_URL=<your_redis_rest_url>
UPSTASH_REDIS_REST_TOKEN=<your_redis_rest_token>

NODE_ENV=development
```

## 🔧 Run the Backend

```
cd backend
npm install
npm run dev
```

## 💻 Run the Frontend

```
cd frontend
npm install
npm run dev
```


# NotesBoardApp

A lightweight, offline-capable notes application built with the **MERN** stack (MongoDB, Express, React, Node). The app is responsive, installable as a **PWA**, and supports offline note creation that syncs to the server when the device regains connectivity. It also protects the API with **rate limiting using Upstash Redis** and follows a clean, easy-to-follow folder structure.

---

## Key features

* Offline-first PWA: installable, small download size, and works offline.
* Offline note sync: notes created offline are stored locally and synced when online.
* Rate limiting via **Upstash Redis** to protect APIs.
* Responsive UI for desktop/tablet/mobile.
* Clean folder structure for maintainability and easy contribution.
* Auth-ready scaffold (can be extended to JWT/OAuth).

---

## Demo

> Add a short demo GIF or screenshot here (recommended).

---

## Tech stack

* **Frontend:** React (Vite or Create React App), Service Worker (Workbox or native), localForage / IndexedDB for offline storage
* **Backend:** Node.js, Express
* **Database:** MongoDB (Atlas recommended)
* **Rate limiting & cache:** Upstash Redis (serverless Redis)
* **Deployment:** Vercel / Netlify for frontend, Render / Railway / Heroku for backend (or a simple VPS)

---

## Prerequisites

* Node.js v16+
* npm or yarn
* MongoDB connection string (Atlas or self-hosted)
* Upstash Redis REST/URL & token (for rate limiting)

---

## Quick start (development)

### 1. Clone repository

```bash
git clone https://github.com/<your-username>/notesboardapp.git
cd notesboardapp
```

### 2. Install dependencies

```bash
# from repo root (if repo has packages separated)
cd backend && npm install
cd ../frontend && npm install
```

### 3. Environment variables

Create `.env` files in `backend/` and `frontend/` as needed. Example variables for `backend/.env`:

```
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/notesdb?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret (optional)
UPSTASH_REDIS_REST_URL=https://usX1-web-..../
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

Frontend `.env` (if used):

```
VITE_API_URL=http://localhost:4000/api
```

> **Security note:** Never commit `.env` files or secrets to git. Use repository secrets for CI/CD.

### 4. Run in development

```bash
# backend
cd backend
npm run dev

# frontend
cd ../frontend
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
  * block requests when counter exceeds the allowed requests
* Upstash has a simple REST endpoint; use the official client or plain HTTP fetch for serverless environments.

### PWA & offline sync

* Service worker caches static assets (app shell) and acts as a network-first or cache-first strategy for API responses depending on the route.
* Use IndexedDB (via a wrapper like `localForage`) to store offline notes.
* When the app returns online, a background sync (or a simple connectivity watcher) reads queued notes from IndexedDB and POSTs them to the API with retry logic.
* Resolve conflicts by timestamp or by prompting the user.

### Data flow (offline)

1. User creates a note while offline → saved to IndexedDB with `status: pending` and a `clientId`.
2. App detects connectivity → attempts to sync pending notes to `/api/notes/sync` endpoint.
3. Backend deduplicates by `clientId` and writes to MongoDB; returns authoritative `id` and timestamp.
4. App updates local note status to `synced` and replaces `clientId` with backend `id` if necessary.

---

## Folder structure (clean, suggested)

```text
notesboardapp/
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── index.js            # app entry
│   │   ├── app.js              # express app, middleware
│   │   ├── routes/
│   │   │   ├── notes.js
│   │   │   └── auth.js
│   │   ├── controllers/
│   │   │   └── notesController.js
│   │   ├── models/
│   │   │   └── Note.js
│   │   ├── middleware/
│   │   │   ├── rateLimiter.js  # Upstash Redis integration
│   │   │   └── errorHandler.js
│   │   ├── services/
│   │   │   └── upstashClient.js
│   │   └── utils/
│   └── .env.example

├── frontend/
│   ├── package.json
│   ├── public/
│   │   ├── manifest.json      # PWA manifest
│   │   └── icons/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── service-worker.js  # or generated by Workbox
│   │   ├── api/
│   │   │   └── apiClient.js
│   │   ├── hooks/
│   │   │   └── useSync.js     # offline sync logic
│   │   ├── components/
│   │   │   ├── NoteEditor/
│   │   │   └── NoteList/
│   │   ├── contexts/
│   │   └── utils/
│   └── .env.example

├── README.md         # this file
└── .gitignore
```

---

## API endpoints (suggested)

* `POST /api/notes` - create note
* `GET /api/notes` - list notes for user
* `POST /api/notes/sync` - accept multiple notes for bulk sync (idempotent using `clientId`)
* `PUT /api/notes/:id` - update note
* `DELETE /api/notes/:id` - delete note

Each endpoint should be protected by rate-limiter middleware.

---

## Testing

* Unit test controllers and services with Jest.
* Test offline behavior with browser devtools (simulate offline) and verify sync queue.

---

## Deployment tips

* Use environment secrets for DB and Upstash credentials.
* For PWA, ensure `manifest.json` and service worker are served from the root of your deployed site.
* Use HTTPS for service worker and sync to function properly in production.

---

## Contributing

1. Fork the project
2. Create a feature branch `feature/your-feature`
3. Open a PR with a clear description

---

## License

MIT

---

## Contact

Created by **<your name>** — replace with your GitHub profile link or email.

If you want, I can:

* add badges (build/test/coverage)
* create a shorter README for the GitHub repo home
* generate a CI workflow example (`.github/workflows/ci.yml`) to run tests and build

Tell me which one you want next.
