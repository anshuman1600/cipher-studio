# 🚀 CipherStudio - Full-Stack Browser IDE

A professional, full-stack browser-based React IDE with cloud storage, authentication, and real-time preview capabilities.

## 🌐 Live Demo

> **� Note:** Add your deployment URLs here after deploying!

- **Live Application:** `https://cipherstudio.vercel.app` _(Replace with your Vercel URL)_
- **Backend API:** `https://cipherstudio-backend.onrender.com` _(Replace with your Render URL)_
- **GitHub Repository:** `https://github.com/YOUR_USERNAME/cipher-studio` _(Replace with your repo URL)_

## �📚 Documentation

- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Step-by-step deployment to Vercel & Render
- **[Architecture Guide](./ARCHITECTURE.md)** - High-level system design, database schemas, and component structure
- **[Design Decisions](./DESIGN_DECISIONS.md)** - Detailed technical choices and trade-offs
- **[API Documentation](#-api-documentation)** - Complete REST API reference (see below)

## ✨ Features

### Core Features
- ✅ **File Management** - Create, delete, rename files and folders with nested structure
- ✅ **Monaco Code Editor** - VS Code editor with syntax highlighting and IntelliSense
- ✅ **Live Preview** - Real-time React code execution using Sandpack
- ✅ **User Authentication** - Secure login/register system with JWT tokens
- ✅ **Cloud Storage** - Save and load projects to MongoDB with user-specific isolation
- ✅ **Local Storage** - Auto-save projects to browser localStorage
- ✅ **Theme Switcher** - Dark/Light mode toggle
- ✅ **Custom Project Names** - Create projects with custom names
- ✅ **Empty State UI** - Professional empty states for all panels
- ✅ **Responsive Design** - Works on desktop and tablet screens

### Security Features
- � **Password Hashing** - bcrypt encryption (10 rounds)
- 🔒 **JWT Authentication** - 30-day token expiration
- 🔒 **Protected Routes** - Middleware for backend route protection
- 🔒 **User-Specific Projects** - Each user can only access their own projects
- 🔒 **Token Persistence** - Auto-login on page refresh

## �🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** - Modern React with fast HMR
- **Monaco Editor** - VS Code's editor component
- **Sandpack** - CodeSandbox's browser-based bundler
- **Lucide React** - Beautiful icon library
- **CSS3** - Custom styling with dark/light themes

### Backend
- **Node.js** + **Express.js** - RESTful API server
- **MongoDB** + **Mongoose** - NoSQL database with ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and verification
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- **Node.js 16+** installed
- **MongoDB** account (free tier on MongoDB Atlas)

### Installation Steps

1. **Clone the repository:**
\`\`\`powershell
git clone <your-repo-url>
cd CipherStudio
\`\`\`

2. **Setup Backend:**
\`\`\`powershell
cd backend
npm install

# Create .env file
echo "MONGO_URI=your_mongodb_connection_string" > .env
echo "JWT_SECRET=your_secret_key_here" >> .env

# Start backend server
npm run dev
\`\`\`
Backend runs on: **http://localhost:5000**

3. **Setup Frontend:**
\`\`\`powershell
cd frontend
npm install

# Start frontend server
npm run dev
\`\`\`
Frontend runs on: **http://localhost:3000**

4. **Open Browser:**
Navigate to **http://localhost:3000** and start coding!

## 📁 Project Structure

\`\`\`
CipherStudio/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Toolbar/           # Top navigation bar
│   │   │   ├── FileExplorer/      # File tree sidebar
│   │   │   ├── CodeEditor/        # Monaco code editor
│   │   │   ├── Preview/           # Sandpack live preview
│   │   │   └── AuthModal/         # Login/Register modal
│   │   ├── services/
│   │   │   └── api.js             # API service layer
│   │   ├── App.jsx                # Main application
│   │   ├── App.css                # App styles
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── index.html                 # HTML template
│   ├── vite.config.js             # Vite config
│   └── package.json               # Dependencies
│
├── backend/
│   ├── config/
│   │   └── database.js            # MongoDB connection
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Project.js             # Project schema
│   ├── controllers/
│   │   ├── authController.js      # Auth logic
│   │   └── projectController.js   # Project CRUD logic
│   ├── middleware/
│   │   └── auth.js                # JWT verification
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   └── projectRoutes.js       # Project endpoints
│   ├── server.js                  # Express server
│   └── package.json               # Dependencies
│
└── README.md                      # This file
\`\`\`

## 🏗️ Architecture

\`\`\`
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   React App     │────────▶│  Express API    │────────▶│   MongoDB       │
│  (Port 3000)    │◀────────│  (Port 5000)    │◀────────│   (Atlas)       │
│                 │         │                 │         │                 │
│ • File Manager  │         │ • Auth Routes   │         │ • Users Coll.   │
│ • Code Editor   │         │ • Project Routes│         │ • Projects Coll.│
│ • Live Preview  │         │ • JWT Middleware│         │                 │
│ • Auth Modal    │         │ • CORS Enabled  │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
\`\`\`

## 📡 API Endpoints

### Authentication Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Project Routes (All require authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create/save project |
| GET | `/api/projects` | Get all user projects |
| GET | `/api/projects/:id` | Get specific project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### File Routes (All require authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/files` | Create a new file or folder |
| GET | `/api/files/:id` | Get file/folder details by ID |
| PUT | `/api/files/:id` | Update file content or rename |
| DELETE | `/api/files/:id` | Delete a file or folder |

## 🎯 How to Use

### 1. **Register/Login**
- Click **"Login"** button in toolbar
- Register with username, email, password
- Or login with existing credentials
- Your username appears in toolbar after login

### 2. **Create New Project**
- Click **"New Project"** button
- Enter custom project name (or use default)
- Start with empty project or starter template

### 3. **Manage Files**
- Click **+** button in file explorer to create files/folders
- Click **✏️** (pencil) icon to rename files/folders
- Click **🗑️** (trash) icon to delete files/folders
- Click file name to open in editor

### 4. **Write Code**
- Select file from file explorer
- Write code in Monaco Editor (supports React, JS, CSS, HTML)
- Auto-completion and syntax highlighting included

### 5. **Live Preview**
- See changes in real-time in preview panel
- Preview automatically updates as you type
- Supports full React applications with components

### 6. **Save Projects**
- **Save Local** - Saves to browser localStorage (persists on refresh)
- **Save Cloud** - Saves to MongoDB (requires login, accessible anywhere)
  - **Smart Save:** Automatically detects if project is new or existing
  - **New Project:** First save creates new project in MongoDB
  - **Loaded Project:** Subsequent saves UPDATE the same project (no duplicates)
  - **After Refresh:** ProjectId is maintained, updates work correctly

### 7. **Load Projects**
- Click **"Load"** button to see all your saved projects
- Select project from list to load it
- Only your own projects are visible (user-specific isolation)

### 8. **Theme Toggle**
- Click **🌙/☀️** icon to switch between dark/light mode
- Theme preference is saved automatically

## 💾 Data Models

### User Schema
\`\`\`javascript
{
  username: String (unique, required, min 3 chars),
  email: String (unique, required, valid email),
  password: String (hashed with bcrypt, min 6 chars),
  createdAt: Date
}
\`\`\`

### Project Schema
\`\`\`javascript
{
  name: String (required),
  userId: ObjectId (ref: 'User', required),
  files: Object (file structure),
  activeFile: String (current open file),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### File Schema (Optional - For Individual File Storage)
\`\`\`javascript
{
  projectId: ObjectId (ref: 'Project', required),
  parentId: ObjectId (ref: 'File', for nested folders),
  name: String (required),
  type: String ('file' or 'folder'),
  content: String (file content),
  size: Number (file size in bytes),
  s3Key: String (for S3 storage integration),
  language: String (file language/extension),
  path: String (full path from root),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

**Note:** Currently, files are stored in the `Project.files` object. The File model is available for future S3/cloud storage integration where each file can be stored separately.

## 🔒 Security Implementation

### Password Security
- Passwords hashed with **bcrypt** (10 salt rounds)
- Never stored in plain text
- Verified using bcrypt.compare()

### JWT Authentication
- Token expiration: **30 days**
- Stored in **localStorage** (key: `authToken`)
- Sent in **Authorization header** (Bearer token)
- Verified in backend middleware

### User Isolation
- All project queries filtered by **userId**
- Users can only CRUD their own projects
- Backend validates ownership before operations

### Protected Routes
- All `/api/projects/*` routes require authentication
- JWT middleware verifies token before access
- Invalid tokens return 401 Unauthorized

## 🧪 Testing the Application

### Test Authentication Flow:
1. **Register** new account (username: test, email: test@example.com, password: test123)
2. **Verify** username appears in toolbar
3. **Logout** and verify username disappears
4. **Login** again with same credentials
5. **Refresh** page (F5) and verify still logged in
6. Check browser **localStorage** for `authToken`

### Test Project Features:
1. **Create** new project with custom name
2. **Add** files and folders
3. **Rename** a file using pencil icon
4. **Write** some React code
5. **Verify** live preview updates
6. **Save Cloud** and note the project ID
7. **Create** another new project
8. **Load** projects and switch between them
9. **Delete** a project
10. **Logout**, login as different user, verify projects are isolated

### Test Empty States:
1. **Create** new empty project
2. **Verify** FileExplorer shows "📁 No files yet"
3. **Verify** CodeEditor shows "📄 No file open"
4. **Verify** Preview shows "👁️ No preview available"
5. **Create** first file and see all panels activate

## � Troubleshooting

### Backend won't start:
\`\`\`powershell
cd backend
npm install
# Check .env file exists with MONGO_URI and JWT_SECRET
npm run dev
\`\`\`

### Frontend won't start:
\`\`\`powershell
cd frontend
npm install
npm run dev
\`\`\`

### MongoDB Connection Error:
- Verify connection string in `.env`
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)
- Ensure database user has read/write permissions

### Login/Register not working:
- Check backend is running on port 5000
- Open browser console (F12) to see error messages
- Verify MongoDB connection is successful

### Projects not loading:
- Ensure you're logged in (check for username in toolbar)
- Check browser console for 401 errors
- Verify `authToken` exists in localStorage

### Preview not showing:
- Check if files exist in the project
- Verify code has no syntax errors
- Check browser console for Sandpack errors

## 📊 Environment Variables

### Backend `.env` file:
\`\`\`env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cipherstudio?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
PORT=5000
\`\`\`

**Important:** Never commit `.env` file to Git!

## 🚀 Deployment

### Frontend (Vercel/Netlify):
1. Build production bundle: `npm run build`
2. Deploy `dist/` folder
3. Set base URL for API calls

### Backend (Railway/Render/Heroku):
1. Push code to GitHub
2. Connect repository to platform
3. Add environment variables (MONGO_URI, JWT_SECRET)
4. Deploy

### MongoDB (Atlas):
- Already cloud-hosted
- Ensure production IP is whitelisted
- Use separate database for production

## 📝 Key Features Explained

### User-Specific Projects
Each user can only see and access their own projects. This is achieved by:
- Adding `userId` field to Project schema
- Filtering all queries: `Project.find({ userId: req.user.id })`
- Validating ownership before update/delete operations

### Custom Project Names
Users can name their projects:
- Prompt dialog asks for name when creating new project
- Default name: "my-react-app"
- Can be renamed after creation

### Empty State Handling
Professional empty states for better UX:
- **FileExplorer**: Shows message when no files exist
- **CodeEditor**: Shows message when no file is open
- **Preview**: Shows message when no code to preview

### Auto-Save & Cloud Save
Dual save system:
- **Local Save**: Auto-saves to localStorage on every change
- **Cloud Save**: Manual save to MongoDB with user authentication

## 🎉 Features Summary

| Category | Features |
|----------|----------|
| **File Management** | Create, delete, rename files/folders with nested structure |
| **Code Editor** | Monaco Editor with syntax highlighting, IntelliSense, themes |
| **Live Preview** | Sandpack real-time React preview with hot reload |
| **Authentication** | JWT-based login/register with bcrypt password hashing |
| **Cloud Storage** | MongoDB storage with user-specific project isolation |
| **Local Storage** | Browser localStorage for offline persistence |
| **User Experience** | Empty states, custom names, theme toggle, responsive design |
| **Security** | Protected routes, token verification, user isolation, password encryption |

## 🌟 Why CipherStudio?

- **Professional** - Enterprise-level code architecture with MVC pattern
- **Secure** - Industry-standard authentication and authorization
- **User-Friendly** - Intuitive UI with helpful empty states
- **Feature-Rich** - Everything you need for a browser-based IDE
- **Scalable** - Modular codebase ready for new features
- **Modern** - Latest React, Vite, and Node.js technologies

## 👨‍💻 Development

**Start Development:**
\`\`\`powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
\`\`\`

**Tech Versions:**
- React: 18.2.0
- Node.js: 16+
- MongoDB: 8.0.0
- Express: 4.18.2
- Vite: 5.0.8

## 📄 License

This project is for educational and portfolio purposes.

---

**Built with ❤️ using React, Node.js, and MongoDB**
