# 🏗️ CipherStudio - Architecture Documentation

## 📋 Table of Contents
1. [High-Level Architecture](#high-level-architecture)
2. [System Components](#system-components)
3. [Database Schema](#database-schema)
4. [Authentication Flow](#authentication-flow)
5. [Project Management Flow](#project-management-flow)
6. [Technology Stack](#technology-stack)
7. [Design Decisions](#design-decisions)
8. [Security Considerations](#security-considerations)

---

## 🎯 High-Level Architecture

CipherStudio follows a **three-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React Frontend (Vite)                                   │   │
│  │  - Monaco Editor (Code Editing)                          │   │
│  │  - Sandpack (Live Preview)                               │   │
│  │  - Component-based UI                                    │   │
│  │  - localStorage (Local Persistence)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                         HTTP/REST API
                         (JWT Auth)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Node.js + Express Server                                │   │
│  │  - RESTful API Endpoints                                 │   │
│  │  - JWT Authentication Middleware                         │   │
│  │  - Controllers (Business Logic)                          │   │
│  │  - Input Validation & Error Handling                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                         Mongoose ODM
                              │
┌─────────────────────────────────────────────────────────────────┐
│                       PERSISTENCE LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MongoDB Atlas (Cloud Database)                          │   │
│  │  - Users Collection                                      │   │
│  │  - Projects Collection                                   │   │
│  │  - Files Collection (S3-ready)                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧩 System Components

### **Frontend Components**

```
src/
├── components/
│   ├── Toolbar/
│   │   ├── Toolbar.jsx          # Top navigation bar
│   │   └── Toolbar.css          # Buttons: Save, Load, New, Login/Logout
│   │
│   ├── FileExplorer/
│   │   ├── FileExplorer.jsx     # File tree navigation
│   │   └── FileExplorer.css     # Create files/folders, delete, rename
│   │
│   ├── CodeEditor/
│   │   ├── CodeEditor.jsx       # Monaco Editor integration
│   │   └── CodeEditor.css       # Syntax highlighting, autocomplete
│   │
│   ├── Preview/
│   │   ├── Preview.jsx          # Sandpack live preview
│   │   └── Preview.css          # Real-time code execution
│   │
│   └── AuthModal/
│       ├── AuthModal.jsx        # Login/Register modal
│       └── AuthModal.css        # User authentication UI
│
├── services/
│   └── api.js                   # API client (Axios)
│
├── App.jsx                      # Main application logic
└── main.jsx                     # React entry point
```

### **Backend Components**

```
backend/
├── config/
│   └── database.js              # MongoDB connection
│
├── models/
│   ├── User.js                  # User schema (bcrypt password)
│   ├── Project.js               # Project schema (userId reference)
│   └── File.js                  # File schema (S3-ready)
│
├── controllers/
│   ├── authController.js        # register, login, getMe
│   ├── projectController.js     # CRUD operations (user-filtered)
│   └── fileController.js        # File management
│
├── middleware/
│   └── auth.js                  # JWT verification middleware
│
├── routes/
│   ├── authRoutes.js            # /api/auth/* endpoints
│   ├── projectRoutes.js         # /api/projects/* endpoints
│   └── fileRoutes.js            # /api/files/* endpoints
│
└── server.js                    # Express app initialization
```

---

## 💾 Database Schema

### **Users Collection**
```javascript
{
  _id: ObjectId,
  username: String (unique, indexed),
  email: String (unique, indexed),
  password: String (bcrypt hashed, 10 rounds),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `username` (unique)
- `email` (unique)

**Security:**
- Passwords hashed with bcrypt (saltRounds: 10)
- Password never sent in API responses (select: false)

---

### **Projects Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', indexed),
  name: String (required),
  files: Object {
    // Hierarchical structure:
    'App.js': {
      type: 'file',
      code: String
    },
    'components': {
      type: 'folder',
      children: {
        'Button.js': {
          type: 'file',
          code: String
        }
      }
    }
  },
  activeFile: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId` (for user-specific queries)
- Compound index: `{ userId: 1, updatedAt: -1 }` (for listing projects)

**Access Control:**
- All queries filtered by `userId`
- Users can only access their own projects

---

### **Files Collection** (S3-Ready)
```javascript
{
  _id: ObjectId,
  projectId: ObjectId (ref: 'Project', indexed),
  parentId: ObjectId (ref: 'File', null for root),
  name: String (required),
  type: String (enum: ['file', 'folder']),
  content: String (for files),
  s3Key: String (for S3 storage),
  path: String (full path),
  language: String,
  size: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `projectId` (for project-specific queries)
- `parentId` (for hierarchical queries)
- Compound index: `{ projectId: 1, path: 1 }` (unique)

**Features:**
- Supports hierarchical folder structure
- Ready for S3 storage migration
- Path-based file organization

---

## 🔐 Authentication Flow

```
┌─────────┐                                              ┌─────────┐
│ Client  │                                              │  Server │
└────┬────┘                                              └────┬────┘
     │                                                        │
     │  POST /api/auth/register                              │
     │  { username, email, password }                        │
     ├───────────────────────────────────────────────────────>│
     │                                                        │
     │                                          Validate Input│
     │                                  Check Existing User   │
     │                                  Hash Password (bcrypt)│
     │                                  Create User in DB     │
     │                                  Generate JWT Token    │
     │                                                        │
     │  { token, user }                                      │
     │<───────────────────────────────────────────────────────┤
     │                                                        │
     │  Store token in localStorage                          │
     │                                                        │
     │  ─────────────────────────────────────────────────────│
     │                                                        │
     │  GET /api/projects                                    │
     │  Header: Authorization: Bearer <token>                │
     ├───────────────────────────────────────────────────────>│
     │                                                        │
     │                                          Verify JWT     │
     │                                          Extract userId │
     │                                  Query DB: { userId }   │
     │                                                        │
     │  { projects: [...] }                                  │
     │<───────────────────────────────────────────────────────┤
     │                                                        │
```

**JWT Token Structure:**
```javascript
{
  payload: {
    userId: "68f5be8aad3962da1f0a63e7",
    iat: 1729411200,  // Issued at
    exp: 1732003200   // Expires in 30 days
  }
}
```

**Security Measures:**
1. Password hashing with bcrypt (10 rounds)
2. JWT tokens with 30-day expiration
3. Token stored in localStorage (httpOnly cookies recommended for production)
4. All protected routes require valid JWT
5. User ID extracted from token (not from request body)

---

## 📂 Project Management Flow

### **Create New Project**
```
User Action: Click "Save Cloud"
     │
     ├─ Check: currentProjectId === null? ✅
     │
     ├─ Prepare projectData:
     │  { name, files, activeFile }
     │
     ├─ POST /api/projects
     │  Headers: { Authorization: Bearer <token> }
     │  Body: projectData
     │
     ├─ Backend: Extract userId from JWT
     │
     ├─ Backend: Create project in DB
     │  { ...projectData, userId }
     │
     ├─ Backend: Return { project }
     │
     ├─ Frontend: Set currentProjectId
     │
     └─ Frontend: Save to localStorage
        { ...projectData, projectId }
```

### **Update Existing Project**
```
User Action: Click "Save Cloud" (after loading project)
     │
     ├─ Check: currentProjectId exists? ✅
     │
     ├─ PUT /api/projects/:id
     │  Headers: { Authorization: Bearer <token> }
     │  Body: { name, files, activeFile }
     │
     ├─ Backend: Extract userId from JWT
     │
     ├─ Backend: Query with ownership check:
     │  Project.findOneAndUpdate({ _id: id, userId })
     │
     ├─ Backend: Return updated project
     │
     └─ Frontend: Update localStorage
```

### **Load Project**
```
User Action: Click "Load"
     │
     ├─ GET /api/projects (fetch all user's projects)
     │
     ├─ Display project list
     │
     ├─ User selects project
     │
     ├─ GET /api/projects/:id
     │
     ├─ Backend: Verify ownership (userId match)
     │
     ├─ Frontend: Set files, projectName, activeFile
     │
     ├─ Frontend: Set currentProjectId (link to cloud)
     │
     └─ Frontend: Save to localStorage with projectId
```

**Key Design Decision:**
- `currentProjectId` is ONLY set when loading from cloud
- NOT restored from localStorage on mount
- This prevents "Project not found" errors
- Forces explicit "Load" action to link to cloud project

---

## 🛠️ Technology Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI framework |
| **Vite** | 5.x | Build tool & dev server |
| **Monaco Editor** | Latest | Code editor (VS Code engine) |
| **Sandpack** | Latest | Live preview (CodeSandbox) |
| **Axios** | Latest | HTTP client |
| **Lucide React** | Latest | Icon library |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express** | 4.x | Web framework |
| **MongoDB** | 7.x | NoSQL database |
| **Mongoose** | 8.x | MongoDB ODM |
| **bcryptjs** | 2.x | Password hashing |
| **jsonwebtoken** | 9.x | JWT authentication |
| **cors** | 2.x | Cross-origin requests |
| **dotenv** | 16.x | Environment variables |

---

## 🎨 Design Decisions

### **1. Why Monaco Editor?**
**Decision:** Use Monaco Editor instead of basic textarea

**Rationale:**
- Industry-standard (powers VS Code)
- Built-in syntax highlighting
- IntelliSense & autocomplete
- Multi-language support
- Familiar UX for developers

**Trade-off:** Larger bundle size (~2MB), but worth it for professional IDE experience

---

### **2. Why Sandpack for Preview?**
**Decision:** Use Sandpack instead of iframe or custom bundler

**Rationale:**
- Real-time bundling & execution
- Supports React, Vue, vanilla JS
- Isolated sandbox environment
- No backend compilation needed
- Developed by CodeSandbox team

**Trade-off:** Less customization than custom bundler, but faster implementation

---

### **3. Why Hierarchical File Structure in MongoDB?**
**Decision:** Store files as nested object instead of flat array

**Rationale:**
- Natural representation of folder structure
- Easier to navigate (folder → children)
- Simpler file path resolution
- Less complex queries

**Trade-off:** 
- BSON document size limit (16MB)
- Solution: Also implemented separate Files collection for S3 migration

---

### **4. Why JWT Instead of Sessions?**
**Decision:** Use JWT tokens for authentication

**Rationale:**
- Stateless authentication (no server-side session store)
- Scalable across multiple servers
- Works with mobile apps
- Standard for modern SPAs

**Trade-off:** 
- Cannot invalidate tokens immediately (must wait for expiration)
- Solution: Keep token expiry short (30 days) and implement refresh tokens in production

---

### **5. Why localStorage for Local Saves?**
**Decision:** Store projects in browser localStorage for quick access

**Rationale:**
- Instant saves (no network latency)
- Works offline
- Reduces database load
- User can work without login

**Trade-off:**
- Limited storage (5-10MB)
- Not synced across devices
- Solution: Cloud save feature for persistence & sync

---

### **6. Why Separate Files Collection?**
**Decision:** Created separate Files collection even though using hierarchical structure

**Rationale:**
- Future-proofing for S3 storage
- Better indexing for large projects
- Individual file permissions possible
- Avoids 16MB document limit
- Supports file versioning

**Current State:** Both systems coexist
- Small projects: Use hierarchical in Projects.files
- Large projects: Can migrate to Files collection

---

### **7. Why Not Auto-Restore ProjectId?**
**Decision:** Don't restore `currentProjectId` from localStorage on mount

**Rationale:**
- Prevents "Project not found" errors
- User might have deleted project from cloud
- User might have switched accounts
- Forces explicit "Load" to link to cloud

**User Experience:**
- Fresh start on page load
- Must explicitly load cloud project
- Prevents accidental updates to wrong project

---

### **8. Why User-Specific Filtering on Backend?**
**Decision:** Filter all queries by `userId` extracted from JWT

**Rationale:**
- Security: Users can only access own data
- No client-side userId (prevents tampering)
- Centralized authorization logic
- Follows principle of least privilege

**Implementation:**
```javascript
// ❌ WRONG (client sends userId)
Project.find({ userId: req.body.userId })

// ✅ CORRECT (server extracts from JWT)
const userId = req.user._id;
Project.find({ userId })
```

---

## 🔒 Security Considerations

### **Authentication Security**
✅ Passwords hashed with bcrypt (10 rounds)  
✅ JWT tokens with expiration (30 days)  
✅ Token verification on every protected route  
✅ User ID extracted from token (not request body)  
⚠️ **TODO:** Implement refresh tokens for production  
⚠️ **TODO:** Use httpOnly cookies instead of localStorage  

### **Authorization Security**
✅ All database queries filtered by `userId`  
✅ Ownership validation before update/delete  
✅ Server-side validation (never trust client)  
✅ MongoDB injection protection (Mongoose sanitization)  

### **API Security**
✅ CORS configured for specific origins  
✅ Rate limiting recommended for production  
✅ Input validation on all endpoints  
✅ Error messages don't leak sensitive info  

### **Data Security**
✅ Environment variables for secrets (.env)  
✅ Database connection string not in code  
✅ S3-ready for secure file storage  
⚠️ **TODO:** Implement file size limits  
⚠️ **TODO:** Virus scanning for uploaded files  

---

## 📊 Performance Considerations

### **Frontend Optimization**
- **Code Splitting:** Vite lazy loads components
- **Monaco Editor:** Loaded asynchronously
- **Sandpack:** Isolated iframe (doesn't block main thread)
- **localStorage:** Instant reads (no network)

### **Backend Optimization**
- **Database Indexes:** 
  - `userId` for user queries
  - `{ userId, updatedAt }` for project lists
- **Mongoose Lean:** Use `.lean()` for read-only queries
- **Connection Pooling:** MongoDB connection reuse

### **Caching Strategy**
- **Client-side:** localStorage for local projects
- **Server-side:** Consider Redis for session data (future)

---

## 🚀 Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                       │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Frontend (Vercel/Netlify)                               │
│  ├─ Static hosting                                       │
│  ├─ CDN distribution                                     │
│  └─ Automatic HTTPS                                      │
│                                                           │
│  Backend (Render/Railway/Heroku)                         │
│  ├─ Node.js server                                       │
│  ├─ Auto-scaling                                         │
│  ├─ Health checks                                        │
│  └─ Environment variables                                │
│                                                           │
│  Database (MongoDB Atlas)                                │
│  ├─ Cloud-hosted                                         │
│  ├─ Automatic backups                                    │
│  ├─ Replica sets                                         │
│  └─ 99.9% uptime SLA                                     │
│                                                           │
│  File Storage (AWS S3) - Future                          │
│  ├─ Scalable object storage                              │
│  ├─ CDN integration                                      │
│  └─ Versioning support                                   │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 Future Enhancements

### **Planned Features**
1. **Collaborative Editing** (WebSocket)
   - Multiple users editing same project
   - Real-time cursor positions
   - Conflict resolution

2. **Version Control**
   - Git-like commit history
   - Branch support
   - Rollback functionality

3. **File Storage Migration**
   - Move from MongoDB to AWS S3
   - Support large media files
   - Reduce database costs

4. **AI Code Assistance**
   - Code completion with GPT
   - Bug detection
   - Code review suggestions

5. **Enhanced Security**
   - 2FA authentication
   - API rate limiting
   - Content Security Policy headers

---

## 📝 Development Guidelines

### **Code Organization**
- **Component Pattern:** One component per file
- **Naming Convention:** PascalCase for components, camelCase for functions
- **File Structure:** Group by feature, not by type
- **State Management:** Lift state to nearest common ancestor

### **API Design**
- **RESTful Endpoints:** Use proper HTTP methods (GET, POST, PUT, DELETE)
- **Consistent Response Format:** `{ success, data/error, message }`
- **Error Handling:** Centralized error middleware
- **Validation:** Use Mongoose schema validation

### **Testing Strategy** (Recommended)
```
Frontend:
├─ Unit Tests (Vitest)
├─ Component Tests (React Testing Library)
└─ E2E Tests (Cypress/Playwright)

Backend:
├─ Unit Tests (Jest)
├─ Integration Tests (Supertest)
└─ Database Tests (MongoDB Memory Server)
```

---

## 🐛 Known Limitations

1. **16MB MongoDB Document Limit**
   - **Impact:** Large projects may hit size limit
   - **Solution:** Migrate to Files collection or S3

2. **localStorage 5MB Limit**
   - **Impact:** Cannot store many large projects locally
   - **Solution:** Implement IndexedDB for larger storage

3. **No Real-time Collaboration**
   - **Impact:** Multiple users cannot edit simultaneously
   - **Solution:** Implement WebSocket-based collaboration

4. **Token Invalidation**
   - **Impact:** Cannot immediately invalidate JWT tokens
   - **Solution:** Implement token blacklist or refresh tokens

---

## 📚 References

- [React Documentation](https://react.dev)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/)
- [Sandpack Documentation](https://sandpack.codesandbox.io/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Last Updated:** October 20, 2025  
**Version:** 1.0.0  
**Maintainer:** CipherStudio Team
