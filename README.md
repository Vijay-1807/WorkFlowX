# WorkFlowX — Full-Stack Project Management Application

A premium, production-ready project management tool built with **React**, **Node.js/Express**, and **MongoDB Atlas**. Features real-time task tracking, role-based access control, file attachments via Cloudinary, and SMTP-based password recovery.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, React Router v7, Recharts, Lucide Icons |
| **Backend** | Node.js, Express 5, Mongoose (MongoDB ODM) |
| **Database** | MongoDB Atlas (Cloud) |
| **Auth** | JWT (jsonwebtoken) + bcryptjs password hashing |
| **File Storage** | Cloudinary (via multer-storage-cloudinary) |
| **Email** | Nodemailer (Gmail SMTP) |
| **Styling** | Vanilla CSS with CSS Variables, Dark/Light Theme |

---

## ✨ Features

### Authentication & Security
- JWT-based login/registration with token persistence
- SMTP Forgot/Reset Password flow (real emails via Gmail)
- Role-Based Access Control (ADMIN / MEMBER)
- Password hashing with bcryptjs (salt rounds: 10)

### Project & Task Management
- Full CRUD for Projects and Tasks
- Kanban-style task board (TODO → IN_PROGRESS → DONE)
- Priority system (LOW / MEDIUM / HIGH) with color indicators
- Due date scheduling with Calendar integration
- Task reminders toggle
- File attachments via Cloudinary upload
- Search & filter tasks (by status, priority, keyword)

### Dashboard & Analytics
- Overview stats (Total Projects, Tasks, Completed, Overdue)
- Recharts Pie Chart — Task Status Distribution
- Recharts Bar Charts — Priority & Project Status
- SVG Completion Ring with animated transitions
- Calendar view showing all tasks with due dates

### UI/UX Polish
- Animated character illustrations on login (desktop only)
- Full Dark/Light mode with smooth transitions
- Responsive design — Bottom nav on mobile, sidebar on desktop
- Glass-morphism panels throughout
- Toast notifications (react-hot-toast)
- Inline field validation with red borders
- Google Font Inter typography
- Settings page (Edit Profile, Change Password, Theme, Notifications)
- Notes section with full MongoDB persistence and debounced auto-save

---

## 📁 Project Structure

```
Ethara Ai/
├── client/                    # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/          # AuthForms, ForgotPassword, ResetPassword, AnimatedCharacters
│   │   │   ├── Dashboard/     # Dashboard, ProjectList, ProjectDetails, CalendarView,
│   │   │   │                  # MyTasks, Analytics, Settings, Notes
│   │   │   ├── Skeleton.jsx   # Loading skeletons
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── ThemeToggle.css
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # JWT auth + axios interceptor
│   │   │   └── ThemeContext.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css          # Design system (CSS variables, themes)
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── server/                    # Node.js Backend (Express)
│   ├── src/
│   │   ├── controllers/       # authController, projectController, taskController, userController
│   │   ├── middleware/        # authMiddleware (protect, adminOnly)
│   │   ├── models/            # User, Project, Task, Note (Mongoose schemas)
│   │   ├── routes/            # authRoutes, projectRoutes, taskRoutes, userRoutes, noteRoutes
│   │   ├── lib/               # db.js (MongoDB), cloudinary.js (file upload config)
│   │   ├── utils/             # sendEmail.js (Nodemailer)
│   │   └── index.js           # Express server entry
│   ├── .env
│   └── package.json
```

---

## 🔌 API Endpoints (16+)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| POST | `/api/auth/forgot-password` | ❌ | Send reset email |
| PUT | `/api/auth/reset-password/:token` | ❌ | Reset password |
| GET | `/api/users/me` | ✅ | Get current user |
| PUT | `/api/users/me` | ✅ | Update profile/password |
| GET | `/api/users` | ✅ | List all users |
| GET | `/api/users/my-tasks` | ✅ | Get user's tasks (cross-project) |
| GET | `/api/users/analytics` | ✅ | Dashboard analytics data |
| GET | `/api/users/calendar-tasks` | ✅ | Tasks with due dates |
| GET | `/api/projects` | ✅ | List projects (RBAC filtered) |
| POST | `/api/projects` | ✅ | Create project |
| PUT | `/api/projects/:id` | ✅ | Update project (owner/admin) |
| DELETE | `/api/projects/:id` | ✅ | Delete project + cascade tasks |
| GET | `/api/tasks/project/:projectId` | ✅ | Get project tasks (filterable) |
| POST | `/api/tasks` | ✅ | Create task |
| PUT | `/api/tasks/:id` | ✅ | Update task |
| DELETE | `/api/tasks/:id` | ✅ | Delete task |
| POST | `/api/tasks/:id/attachment` | ✅ | Upload file to Cloudinary |
| GET | `/api/notes` | ✅ | List user's notes |
| POST | `/api/notes` | ✅ | Create new note |
| PUT | `/api/notes/:id` | ✅ | Update note (auto-save) |
| DELETE | `/api/notes/:id` | ✅ | Delete note |

---

## 🛠 Local Development Setup

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (free tier works)
- Gmail account with App Password enabled

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd "Ethara Ai"

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create `server/.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/workflowx
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Visit `http://localhost:5173`

---

## 🌐 Deployment Guide

### Backend → Render.com (Free)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: `20`
5. Add **Environment Variables** (same as your `.env`):
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `EMAIL_USER`, `EMAIL_PASS`
6. Deploy → Copy the URL (e.g., `https://workflowx-api.onrender.com`)

### Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → Import Project
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable**:
   - `VITE_API_URL` = `https://workflowx-api.onrender.com/api`
5. Deploy → Your live URL (e.g., `https://workflowx.vercel.app`)

### ⚠️ Important Post-Deploy Steps

1. **Update CORS** in `server/src/index.js`:
   ```js
   app.use(cors({ origin: 'https://workflowx.vercel.app' }));
   ```

2. **Update Reset URL** in `server/src/controllers/authController.js`:
   ```js
   const resetUrl = `https://workflowx.vercel.app/reset-password/${resetToken}`;
   ```

3. **Redeploy** the backend after these changes.

---

## 👤 Author

**Vijay Bontha**
- Email: bonthavijay18@gmail.com

---

## 📄 License

This project is built for the Ethara.AI Full-Stack Application Assessment (Round 1).
