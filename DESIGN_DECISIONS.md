# 🎯 Major Design Decisions - CipherStudio

This document explains the key architectural and technical decisions made during the development of CipherStudio.

---

## 📋 Table of Contents

1. [Frontend Architecture](#1-frontend-architecture)
2. [Code Editor Choice](#2-code-editor-choice)
3. [Live Preview Implementation](#3-live-preview-implementation)
4. [Authentication Strategy](#4-authentication-strategy)
5. [Data Storage Strategy](#5-data-storage-strategy)
6. [File Structure Design](#6-file-structure-design)
7. [State Management](#7-state-management)
8. [API Design](#8-api-design)

---

## 1. Frontend Architecture

### **Decision: React with Vite**

#### Why React?
- ✅ Component-based architecture (reusable UI elements)
- ✅ Large ecosystem (Monaco, Sandpack integrate easily)
- ✅ Virtual DOM for efficient updates
- ✅ Industry standard (familiar to developers)

#### Why Vite over Create React App?
- ✅ **Faster dev server** (instant HMR)
- ✅ **Smaller bundle size** (ES modules)
- ✅ **Modern tooling** (esbuild for blazing fast builds)
- ✅ **Better DX** (out-of-the-box support for JSX, CSS)

#### Alternatives Considered:
| Framework | Pros | Cons | Verdict |
|-----------|------|------|---------|
| **Vue.js** | Simpler learning curve | Smaller ecosystem for dev tools | ❌ Less Monaco/Sandpack support |
| **Angular** | Full-featured framework | Too heavy for our use case | ❌ Overkill for MVP |
| **Svelte** | No virtual DOM overhead | Smaller community | ❌ Fewer IDE libraries |

**Final Choice:** React + Vite ✅

---

## 2. Code Editor Choice

### **Decision: Monaco Editor**

#### Why Monaco?
- ✅ **Powers VS Code** (industry-standard editor)
- ✅ **Rich features out-of-the-box:**
  - Syntax highlighting
  - IntelliSense autocomplete
  - Multi-cursor editing
  - Find & replace
  - Code folding
- ✅ **Multi-language support** (JS, HTML, CSS, Python, etc.)
- ✅ **TypeScript definitions** (great DX)
- ✅ **Customizable themes** (VS Dark, Light, High Contrast)

#### Alternatives Considered:
| Editor | Pros | Cons | Verdict |
|--------|------|------|---------|
| **CodeMirror** | Lightweight, modular | Less feature-rich | ❌ More setup required |
| **Ace Editor** | Mature, stable | Older API design | ❌ Less modern |
| **Plain Textarea** | Simple | No features | ❌ Poor UX |

#### Trade-offs:
- **Bundle Size:** Monaco adds ~2MB to bundle
  - **Mitigation:** Lazy load Monaco, code splitting
- **Load Time:** Slight initial delay
  - **Acceptable:** Professional IDE experience is worth it

**Final Choice:** Monaco Editor ✅

---

## 3. Live Preview Implementation

### **Decision: Sandpack (CodeSandbox)**

#### Why Sandpack?
- ✅ **Real-time bundling** (Webpack in browser)
- ✅ **Isolated sandbox** (secure iframe execution)
- ✅ **React support** (JSX transpilation)
- ✅ **No backend needed** (client-side compilation)
- ✅ **Maintained by CodeSandbox** (proven reliability)
- ✅ **Hot reload** (instant preview updates)

#### Alternatives Considered:
| Solution | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Custom Bundler** | Full control | Complex to build | ❌ Time-consuming |
| **iframe + eval** | Simple | Security risks, no JSX | ❌ Unsafe |
| **Backend compilation** | More powerful | Requires server, slower | ❌ Adds complexity |
| **StackBlitz WebContainers** | Full Node.js | Limited browser support | ❌ Compatibility issues |

#### Implementation Details:
```jsx
<Sandpack
  key={filesKey} // Force remount on file change
  template="react"
  files={sandpackFiles}
  options={{
    showNavigator: true,
    layout: 'preview',
    editorWidthPercentage: 0, // Hide Sandpack editor
  }}
/>
```

**Key Innovation:** Use `filesKey` to force Sandpack remount when files change, ensuring preview updates immediately.

**Final Choice:** Sandpack ✅

---

## 4. Authentication Strategy

### **Decision: JWT (JSON Web Tokens)**

#### Why JWT?
- ✅ **Stateless** (no server-side session storage)
- ✅ **Scalable** (works across multiple servers)
- ✅ **Standard** (industry best practice for SPAs)
- ✅ **Mobile-friendly** (works in mobile apps)
- ✅ **Self-contained** (userId embedded in token)

#### Implementation:
```javascript
// Login flow
const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

// Authentication middleware
const decoded = jwt.verify(token, JWT_SECRET);
req.user = await User.findById(decoded.userId);
```

#### Alternatives Considered:
| Method | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Sessions + Cookies** | Can invalidate immediately | Requires server storage | ❌ Not scalable |
| **OAuth 2.0** | Industry standard | Complex setup | ❌ Overkill for MVP |
| **API Keys** | Simple | Less secure | ❌ No user context |

#### Security Measures:
- ✅ **Password hashing:** bcrypt with 10 salt rounds
- ✅ **Token expiration:** 30 days
- ✅ **HTTPS only** (in production)
- ⚠️ **TODO:** Implement refresh tokens
- ⚠️ **TODO:** Use httpOnly cookies (more secure than localStorage)

**Final Choice:** JWT Authentication ✅

---

## 5. Data Storage Strategy

### **Decision: Hybrid Approach (localStorage + MongoDB)**

#### Why Hybrid?
- ✅ **Best of both worlds:**
  - localStorage: Instant saves, offline access
  - MongoDB: Persistence, cross-device sync

#### localStorage (Local Saves)
**Use Case:** Quick saves, work-in-progress

**Advantages:**
- Instant write (no network latency)
- Works offline
- No database load
- No login required

**Limitations:**
- 5-10MB storage limit
- Not synced across devices
- Cleared if user clears browser data

**Data Structure:**
```javascript
{
  name: "my-react-app",
  files: { /* hierarchical structure */ },
  activeFile: "App.js",
  projectId: "68f5bd5a...", // Link to cloud (if loaded)
  savedAt: "2025-10-20T10:30:00.000Z"
}
```

#### MongoDB (Cloud Saves)
**Use Case:** Persistence, sharing, backup

**Advantages:**
- 16MB document size (plenty for code)
- Cross-device sync
- User authentication
- Backup & recovery

**Limitations:**
- Requires network
- Requires login
- Database costs

**Data Structure:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // User ownership
  name: String,
  files: Object, // Same format as localStorage
  activeFile: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Smart Save/Update Logic:
```javascript
if (currentProjectId) {
  // Update existing cloud project
  await updateProject(currentProjectId, projectData);
} else {
  // Create new cloud project
  const result = await saveProject(projectData);
  setCurrentProjectId(result.project._id); // Link to cloud
}
```

**Key Innovation:** `currentProjectId` acts as a "link" between local and cloud project.

**Final Choice:** Hybrid Storage ✅

---

## 6. File Structure Design

### **Decision: Hierarchical Object Structure**

#### Why Hierarchical?
- ✅ **Natural representation** (folders contain children)
- ✅ **Easier navigation** (tree traversal)
- ✅ **Simpler queries** (no joins needed)
- ✅ **Familiar to developers** (matches file system)

#### Data Structure:
```javascript
{
  'App.js': {
    type: 'file',
    code: 'export default function App() { ... }'
  },
  'components': {
    type: 'folder',
    children: {
      'Button.js': {
        type: 'file',
        code: 'export default function Button() { ... }'
      }
    }
  }
}
```

#### Alternatives Considered:
| Structure | Pros | Cons | Verdict |
|-----------|------|------|---------|
| **Flat Array** | Simple to query | Complex path resolution | ❌ Harder to navigate |
| **Path-based** | Efficient for deep trees | Requires parsing | ❌ More complex |
| **Graph Database** | Flexible relationships | Overkill | ❌ Too complex |

#### Limitations & Solutions:
**Problem:** MongoDB 16MB document size limit

**Solution:** Dual approach:
1. **Small projects:** Use hierarchical structure (fast, simple)
2. **Large projects:** Migrate to separate Files collection

#### Files Collection (S3-Ready):
```javascript
{
  _id: ObjectId,
  projectId: ObjectId,
  parentId: ObjectId, // null for root files
  name: String,
  type: 'file' | 'folder',
  content: String, // or s3Key for large files
  path: String, // '/components/Button.js'
  size: Number,
  createdAt: Date
}
```

**Future-Proofing:** Files collection ready for AWS S3 migration.

**Final Choice:** Hierarchical + Files Collection ✅

---

## 7. State Management

### **Decision: React useState (No Redux)**

#### Why No Redux?
- ✅ **Simple state needs** (files, user, projectId)
- ✅ **Component-local state** (no complex global state)
- ✅ **Fewer dependencies** (smaller bundle)
- ✅ **Faster development** (less boilerplate)

#### State Structure:
```javascript
// App.jsx
const [files, setFiles] = useState(STARTER_TEMPLATE);
const [activeFile, setActiveFile] = useState('App.js');
const [projectName, setProjectName] = useState('my-react-app');
const [currentProjectId, setCurrentProjectId] = useState(null);
const [user, setUser] = useState(null);
const [theme, setTheme] = useState('dark');
```

#### Prop Drilling:
**Problem:** Passing props through multiple levels

**Solution:** Direct prop passing (acceptable for small app)
```jsx
<Toolbar
  projectName={projectName}
  user={user}
  onSave={handleSave}
  onLogin={() => setShowAuthModal(true)}
/>
```

#### When to Add Redux?
**Indicators:**
- More than 5 levels of prop drilling
- Shared state across many components
- Complex state updates (async actions)

**Current Status:** Not needed yet ✅

**Final Choice:** React useState ✅

---

## 8. API Design

### **Decision: RESTful JSON API**

#### Why REST?
- ✅ **Simple & standard** (HTTP methods: GET, POST, PUT, DELETE)
- ✅ **Stateless** (each request independent)
- ✅ **Cacheable** (HTTP caching)
- ✅ **Well-documented** (OpenAPI/Swagger support)

#### Endpoint Structure:
```
Authentication:
POST   /api/auth/register      Create new user
POST   /api/auth/login         Login user
GET    /api/auth/me            Get current user

Projects:
GET    /api/projects           List user's projects
POST   /api/projects           Create new project
GET    /api/projects/:id       Get project by ID
PUT    /api/projects/:id       Update project
DELETE /api/projects/:id       Delete project

Files:
GET    /api/files/:id          Get file by ID
POST   /api/files              Create file
PUT    /api/files/:id          Update file
DELETE /api/files/:id          Delete file
```

#### Response Format:
**Success:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 404
}
```

#### Alternatives Considered:
| API Type | Pros | Cons | Verdict |
|----------|------|------|---------|
| **GraphQL** | Flexible queries | Complex setup | ❌ Overkill |
| **gRPC** | High performance | Binary protocol, harder to debug | ❌ Too complex |
| **WebSocket** | Real-time updates | Harder to scale | ❌ Not needed yet |

#### Authorization Pattern:
```javascript
// Middleware: Extract userId from JWT
const userId = req.user._id;

// Controller: Filter by userId
const projects = await Project.find({ userId });
```

**Key Security:** Never trust client-sent `userId`, always extract from JWT token.

**Final Choice:** RESTful API ✅

---

## 🔄 Evolution Path

### **Phase 1: MVP (Current)**
- ✅ Basic CRUD operations
- ✅ User authentication
- ✅ Local + Cloud saves
- ✅ Live preview

### **Phase 2: Enhanced Features**
- 🔲 File versioning (Git-like)
- 🔲 Project templates
- 🔲 Keyboard shortcuts
- 🔲 Multi-file search

### **Phase 3: Collaboration**
- 🔲 WebSocket real-time editing
- 🔲 User presence indicators
- 🔲 Comments & annotations
- 🔲 Share project links

### **Phase 4: Scale**
- 🔲 S3 file storage
- 🔲 Redis caching
- 🔲 Load balancing
- 🔲 CDN integration

---

## 📊 Decision Matrix

| Feature | Complexity | Impact | Priority | Status |
|---------|------------|--------|----------|--------|
| Monaco Editor | Medium | High | P0 | ✅ Done |
| Sandpack Preview | Medium | High | P0 | ✅ Done |
| JWT Auth | Low | High | P0 | ✅ Done |
| Hybrid Storage | Low | High | P0 | ✅ Done |
| Files Collection | Medium | Medium | P1 | ✅ Done |
| WebSocket Collab | High | High | P2 | 🔲 Future |
| S3 Storage | Medium | Medium | P2 | 🔲 Future |
| Git Integration | High | Medium | P3 | 🔲 Future |

---

## 💡 Lessons Learned

### **What Went Well:**
1. ✅ Monaco + Sandpack integration smooth
2. ✅ Hierarchical file structure works great
3. ✅ JWT auth simple yet secure
4. ✅ Hybrid storage provides flexibility

### **What Could Be Improved:**
1. ⚠️ Consider Context API for state management as app grows
2. ⚠️ Implement httpOnly cookies for tokens (more secure)
3. ⚠️ Add API rate limiting earlier
4. ⚠️ Set up CI/CD from start

### **Future Considerations:**
1. 🔮 WebSocket for real-time collaboration
2. 🔮 Redis for session/cache management
3. 🔮 GraphQL for flexible queries
4. 🔮 TypeScript for type safety

---

## 🎓 Key Takeaways

### **For Developers:**
- **Start simple:** MVP first, optimize later
- **Use proven tools:** Monaco, Sandpack, JWT (don't reinvent)
- **Security first:** Hash passwords, verify tokens, filter by userId
- **Plan for scale:** Files collection ready for S3

### **For Architects:**
- **Separation of concerns:** Client, Server, Database clearly separated
- **Flexibility:** Hybrid storage allows online/offline use
- **Extensibility:** Modular design easy to extend
- **Documentation:** Decisions documented for future team

---

**Last Updated:** October 20, 2025  
**Version:** 1.0.0  
**Author:** CipherStudio Team
