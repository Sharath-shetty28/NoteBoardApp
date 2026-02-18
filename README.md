# <h1 align="center">📝 KnowledgeFlow AI ✨</h1>

A lightweight full-stack notes application built with PERN(React, Express, Node.js, and PostgreSQL), designed to be responsive and installable as a Progressive Web App (PWA). The application features JWT-based authentication, SSO login, and automatically sends a welcome email when users sign in.

The backend API is secured with rate limiting powered by Upstash Redis, ensuring reliability and protection against abuse. The project follows a clean, well-structured folder architecture to support scalability and long-term maintainability.

A CI/CD pipeline is integrated to automatically build, test, and deploy the application on every push, enabling fast and reliable releases with minimal manual intervention.

---

## Key features

* PERN Stack: Full-stack application using PostgreSQL, Express, React, and Node.js.
* Responsive Design: Optimized for 100% of screen sizes, including mobile, tablet, and desktop.
* PWA Installable: Progressive Web App installable with <1s load time for quick access.
* JWT Authentication: Secures 100% of API endpoints with JSON Web Tokens.
* SSO Login: Supports Google Sign-in  for quick user sign-in.
* Welcome Email: Automatically sends emails to 100% of new users upon signup.
* API Rate Limiting: Limits API calls to 100 requests per 15 minutes per user using Upstash Redis.
* Clean Folder Structure: Organized into <10 main folders, ensuring maintainable and scalable code.
* CI/CD pipeline is integrated to automatically build, test, and deploy the application.

---

## Demo

<img width="1456" height="827" alt="image" src="https://github.com/user-attachments/assets/be5b7527-be48-4101-b813-f6e8d9023d95" />
<img width="1356" height="837" alt="image" src="https://github.com/user-attachments/assets/1bba395e-5d83-4523-b6e7-e9cc9fe9546c" />




---

## Tech stack

* **Frontend:** React (Vite) 
* **Backend:** Node.js, Express
* **Database:**  PostgreSQL(Neon DB)
* **Rate limiting & cache:** Upstash Redis (serverless Redis)
* **Email Sending:** Resend
* **CI/CD:** Github Actions 
* **Deployment:** Render

---

## Prerequisites

* Node.js v16+
* npm 
* Neon DB connection
* Upstash Redis REST/URL & token (for rate limiting)

---

## Quick start (development)

### 1. Clone repository

```bash
git clone https://github.com/<your-username>/KnowledgeFlowAI.git
cd KnowledgeFlowAI
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
DATABASE_URL="url_of_noen_db"
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
│   ├── prisma/
│   │   │   ├── migrations/
│   │   |   └── schema.prisma
│   ├── src/
│   │   ├── server.js
│   │   ├── app.js           # app entry            
│   │   ├── routes/
│   │   │   ├── note.route.js
│   │   |   └── user.route.js
│   │   ├── controllers/
│   │   │   ├── note.controller.js
│   │   |   └── user.controller.js
│   │   ├── emails/
│   │   │   └── emailHandlers.js
│   │   ├── services/
│   │   │   ├── note.service.js
│   │   |   └── User.service.js
│   │   ├── repositories/
│   │   │   ├── note.repo.js
│   │   |   └── User.repo.js
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




