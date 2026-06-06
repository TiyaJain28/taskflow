# ✦ TaskFlow

> A full-stack Task Management Web Application built with the MERN stack — MongoDB, Express.js, React.js, and Node.js.

**Live Demo:** [taskflow-six-chi.vercel.app](https://taskflow-six-chi.vercel.app)  
**Backend API:** [taskflow-utat.onrender.com](https://taskflow-utat.onrender.com/api/health)  
**GitHub:** [github.com/TiyaJain28/taskflow](https://github.com/TiyaJain28/taskflow)

---

## 📌 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schemas](#database-schemas)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## ✨ Features

### Core
- 🔐 User Registration and Login with JWT Authentication
- ✅ Create, Read, Update, Delete Tasks
- 🔄 Toggle task status (Pending / In Progress / Completed)
- 🛡️ Protected routes — only authenticated users can access tasks

### Bonus
- 🔍 Real-time Search — search tasks by title or description
- 🎯 Filter by Status and Priority
- 📄 Server-side Pagination (9 tasks per page)
- 📊 Dashboard stats with completion ring chart
- 📅 Due date tracking with overdue indicators
- 🌙 Dark UI with responsive design (mobile + desktop)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Styling | Custom CSS with CSS Variables |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Authentication | JWT (jsonwebtoken), bcryptjs |
| Validation | express-validator (server) + custom hooks (client) |
| Notifications | react-hot-toast |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

---

## 🗂 Project Structure

```
taskflow/
├── backend/
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, GetMe
│   │   └── taskController.js     # CRUD + Toggle + Search/Filter/Pagination
│   ├── middleware/
│   │   └── auth.js               # JWT protect middleware
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt pre-save hook
│   │   └── Task.js               # Task schema with indexes
│   ├── routes/
│   │   ├── auth.js               # /api/auth routes
│   │   └── tasks.js              # /api/tasks routes
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── TaskCard.js        # Task card with badges, actions, toggle
        │   └── TaskModal.js       # Create/Edit modal with validation
        ├── context/
        │   └── AuthContext.js     # Global auth state (login/logout/register)
        ├── hooks/
        │   └── useTasks.js        # Task operations + debounced search
        ├── pages/
        │   ├── Login.js           # Login page with form validation
        │   ├── Register.js        # Register page with password strength meter
        │   └── Dashboard.js       # Main dashboard with filters + pagination
        ├── utils/
        │   └── api.js             # Axios instance with token interceptors
        ├── App.js                 # Router with public/private route guards
        └── index.css              # Global CSS design system
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas account
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/TiyaJain28/taskflow.git
cd taskflow
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables) below), then:

```bash
npm run dev
```

Backend runs at **http://localhost:5000**

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs at **http://localhost:3000**

---

## 🔐 Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### Frontend — `frontend/.env` (optional)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

> ⚠️ Never commit `.env` files to GitHub. They are already excluded via `.gitignore`.

---

## 🔌 API Reference

### Auth Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `GET` | `/api/auth/me` | Private | Get current user info |

### Task Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/tasks` | Private | Get all tasks (supports filters) |
| `GET` | `/api/tasks/:id` | Private | Get a single task |
| `POST` | `/api/tasks` | Private | Create a new task |
| `PUT` | `/api/tasks/:id` | Private | Update a task |
| `PATCH` | `/api/tasks/:id/toggle` | Private | Toggle task status |
| `DELETE` | `/api/tasks/:id` | Private | Delete a task |

### GET /api/tasks — Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search in title and description |
| `status` | string | `pending` / `in-progress` / `completed` |
| `priority` | string | `low` / `medium` / `high` |
| `page` | number | Page number (default: `1`) |
| `limit` | number | Results per page (default: `10`, max: `50`) |
| `sortBy` | string | Sort field (default: `createdAt`) |
| `order` | string | `asc` or `desc` (default: `desc`) |

**Example Request:**
```
GET /api/tasks?status=pending&priority=high&search=design&page=1&limit=9
Authorization: Bearer <token>
```

---

## 🗃 Database Schemas

### User Schema

```js
{
  name:      String   // required, 2–50 chars
  email:     String   // required, unique, lowercase
  password:  String   // hashed with bcrypt (12 rounds), not returned in queries
  createdAt: Date
  updatedAt: Date
}
```

### Task Schema

```js
{
  title:       String   // required, 3–100 chars
  description: String   // optional, max 500 chars
  status:      String   // 'pending' | 'in-progress' | 'completed' (default: 'pending')
  priority:    String   // 'low' | 'medium' | 'high' (default: 'medium')
  dueDate:     Date     // optional
  userId:      ObjectId // ref: User (auto-assigned from JWT)
  createdAt:   Date
  updatedAt:   Date
}
```

---

## 🚢 Deployment

This app is deployed across three free-tier services:

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [taskflow-six-chi.vercel.app](https://taskflow-six-chi.vercel.app) |
| Backend | Render | [taskflow-utat.onrender.com](https://taskflow-utat.onrender.com) |
| Database | MongoDB Atlas | Cloud hosted (M0 free tier) |

### Deploy Backend (Render)

1. Connect GitHub repo to Render
2. Set **Root Directory** to `backend`
3. Set **Build Command** to `npm install`
4. Set **Start Command** to `node server.js`
5. Add environment variables in Render dashboard

### Deploy Frontend (Vercel)

1. Connect GitHub repo to Vercel
2. Set **Root Directory** to `frontend`
3. Set **Framework Preset** to `Create React App`
4. Add environment variable: `REACT_APP_API_URL=https://your-render-url.onrender.com/api`

---



## 👩‍💻 Author

**Tiya Jain**  
GitHub: [@TiyaJain28](https://github.com/TiyaJain28)
