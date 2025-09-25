# <h1 align="center">📝 NotesBoardApp ✨</h1>

A lightweight MERN stack (MongoDB, Express, React, Node) notes application that is responsive and installable as a PWA. The app now includes JWT-based authentication, SSO login, and sends a welcome email to users upon signing in. The API is secured with rate limiting using Upstash Redis, and the project maintains a clean, well-structured folder organization for easy navigation and scalability.

---

## Key features

* MERN Stack: Full-stack application using MongoDB, Express, React, and Node.js.
* Responsive Design: Optimized for 100% of screen sizes, including mobile, tablet, and desktop.
* PWA Installable: Progressive Web App installable with <1s load time for quick access.
* JWT Authentication: Secures 100% of API endpoints with JSON Web Tokens.
* SSO Login: Supports Google Sign-in  for quick user sign-in.
* Welcome Email: Automatically sends emails to 100% of new users upon signup.
* API Rate Limiting: Limits API calls to 100 requests per 15 minutes per user using Upstash Redis.
* Clean Folder Structure: Organized into <10 main folders, ensuring maintainable and scalable code.

---

## Demo

<img width="1456" height="827" alt="image" src="https://github.com/user-attachments/assets/be5b7527-be48-4101-b813-f6e8d9023d95" />
<img width="1919" height="876" alt="image" src="https://github.com/user-attachments/assets/77f60de0-9156-4000-8c79-332b4e1df647" />


---

## Tech stack

* **Frontend:** React (Vite or Create React App), Service Worker (Workbox or native), localForage / IndexedDB for offline storage
* **Backend:** Node.js, Express
* **Database:** MongoDB (Atlas recommended)
* **Rate limiting & cache:** Upstash Redis (serverless Redis)
* **Email Sending:** Brevo
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
│   │   |   └── authRoutes.js
│   │   ├── controllers/
│   │   │   ├── notesController.js
│   │   |   └── userController
│   │   ├── emails/
│   │   │   └── emailHandlers.js
│   │   ├── models/
│   │   │   ├── Note.js
│   │   |   └── User.js
│   │   ├── middleware/
│   │   │   ├── rateLimiter.js  # Upstash Redis integration
│   │   |   └── authUser.js
│   │   ├── config/
│   │   │   ├── db.js 
│   │   |   └── upstash.js
│   │   ├── utils/
│   │   │   └── generateToken.js
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
│   │   │   ├──  Navbar.jsx
│   │   │   └──  NoteCard.jsx
│   │   │   └── NotesNotFound.jsx
│   │   │   └── RateLimitedUI.jsx
│   │   │   └── GoogleSignInButton.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── lib/
│   │   │   ├── axios.js
│   │   │   └── utils.js
│   │   ├── pages/
│   │   │   ├── CreatePage.jsx
│   │   │   └── HomePage.jsx
│   │   │   └── NoteDetailPage.jsx
│   │   │   └── LoginPage.jsx
│   │   │   └── SignUppage.jsx
│   └── .env
├── README.md       
└── .gitignore
```

---

## API endpoints (suggested)

* `POST /api/auth/signup` - create a new user
* `POST /api/auth/login` - login to existing account
* `POST /api/auth/google-login` - login using a Google account
* `GET /api/auth/is-auth` - validating a user
* `POST /api/auth/logout` - user logout

* `POST /api/notes` - create note
* `GET /api/notes` - list notes for user
* `PUT /api/notes/:id` - update note
* `DELETE /api/notes/:id` - delete note

Each endpoint should be protected by rate-limiter middleware.

---

## Testing
* Tested all controllers, services, and API endpoints using Postman to ensure correct functionality and responses.
* Verified authentication flows, including JWT and SSO, and ensured API rate limits were properly enforced.
* Checked email notifications for welcome emails on signup.

---

## Deployment tips

* Use environment secrets for DB, Upstash, and Brevo credentials.
* Use HTTPS for the service worker and sync to function properly in production.

---

## Contributing

1. Fork the project
2. Create a feature branch `feature/your-feature`
3. Open a PR with a clear description

---




