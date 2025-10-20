# 📊 CipherStudio - Visual Architecture Diagrams

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                              │
│                           (Browser - localhost:3000)                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │   Toolbar    │  │ File Explorer  │  │ Code Editor │  │  Preview  │ │
│  │              │  │                │  │             │  │           │ │
│  │ Save/Load    │  │ Create/Delete  │  │   Monaco    │  │ Sandpack  │ │
│  │ Login/Logout │  │ Rename Files   │  │   Editor    │  │  (React)  │ │
│  │ New/Theme    │  │ Folder Tree    │  │ Syntax HL   │  │ Live Run  │ │
│  └──────────────┘  └────────────────┘  └─────────────┘  └───────────┘ │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    AuthModal (Login/Register)                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                            HTTP REST API
                      (Authorization: Bearer JWT)
                                 │
┌────────────────────────────────┴────────────────────────────────────────┐
│                           EXPRESS SERVER                                 │
│                         (Node.js - Port 5000)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     Middleware Layer                             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │   │
│  │  │   CORS   │→ │   JSON   │→ │   Auth   │→ │  Routes  │       │   │
│  │  │  Config  │  │  Parser  │  │   JWT    │  │          │       │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Routes Layer                                │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │  Auth Routes │  │Project Routes│  │ File Routes  │          │   │
│  │  │ /api/auth/*  │  │/api/projects│  │ /api/files/* │          │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Controllers Layer                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │     Auth     │  │   Project    │  │     File     │          │   │
│  │  │ Controller   │  │  Controller  │  │  Controller  │          │   │
│  │  │ - register   │  │ - create     │  │ - create     │          │   │
│  │  │ - login      │  │ - getAll     │  │ - getById    │          │   │
│  │  │ - getMe      │  │ - getById    │  │ - update     │          │   │
│  │  │              │  │ - update     │  │ - delete     │          │   │
│  │  │              │  │ - delete     │  │              │          │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Models Layer                                │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │     User     │  │   Project    │  │     File     │          │   │
│  │  │    Model     │  │    Model     │  │    Model     │          │   │
│  │  │ - username   │  │ - userId     │  │ - projectId  │          │   │
│  │  │ - email      │  │ - name       │  │ - name       │          │   │
│  │  │ - password   │  │ - files      │  │ - content    │          │   │
│  │  │              │  │ - activeFile │  │ - s3Key      │          │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                          Mongoose ODM
                                 │
┌────────────────────────────────┴────────────────────────────────────────┐
│                         MONGODB ATLAS                                    │
│                      (Cloud Database - NoSQL)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       Collections                                │   │
│  │                                                                  │   │
│  │  ┌──────────────────┐                                           │   │
│  │  │  Users           │                                           │   │
│  │  │  ┌────────────┐  │                                           │   │
│  │  │  │ _id        │  │                                           │   │
│  │  │  │ username   │  │  Indexes:                                │   │
│  │  │  │ email      │  │  - username (unique)                     │   │
│  │  │  │ password   │  │  - email (unique)                        │   │
│  │  │  │ createdAt  │  │                                           │   │
│  │  │  └────────────┘  │                                           │   │
│  │  └──────────────────┘                                           │   │
│  │                                                                  │   │
│  │  ┌──────────────────┐                                           │   │
│  │  │  Projects        │                                           │   │
│  │  │  ┌────────────┐  │                                           │   │
│  │  │  │ _id        │  │                                           │   │
│  │  │  │ userId ────┼──┼─→ References Users._id                   │   │
│  │  │  │ name       │  │                                           │   │
│  │  │  │ files{}    │  │  Indexes:                                │   │
│  │  │  │ activeFile │  │  - userId                                │   │
│  │  │  │ createdAt  │  │  - { userId, updatedAt }                 │   │
│  │  │  │ updatedAt  │  │                                           │   │
│  │  │  └────────────┘  │                                           │   │
│  │  └──────────────────┘                                           │   │
│  │                                                                  │   │
│  │  ┌──────────────────┐                                           │   │
│  │  │  Files (S3-ready)│                                           │   │
│  │  │  ┌────────────┐  │                                           │   │
│  │  │  │ _id        │  │                                           │   │
│  │  │  │ projectId ─┼──┼─→ References Projects._id                │   │
│  │  │  │ parentId ──┼──┼─→ References Files._id (hierarchical)    │   │
│  │  │  │ name       │  │                                           │   │
│  │  │  │ type       │  │  Indexes:                                │   │
│  │  │  │ content    │  │  - projectId                             │   │
│  │  │  │ s3Key      │  │  - parentId                              │   │
│  │  │  │ path       │  │  - { projectId, path } (unique)          │   │
│  │  │  │ language   │  │                                           │   │
│  │  │  │ size       │  │                                           │   │
│  │  │  │ createdAt  │  │                                           │   │
│  │  │  └────────────┘  │                                           │   │
│  │  └──────────────────┘                                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────┐                                              ┌─────────────┐
│   Browser   │                                              │   Server    │
│  (Frontend) │                                              │  (Backend)  │
└──────┬──────┘                                              └──────┬──────┘
       │                                                            │
       │  1. POST /api/auth/register                               │
       │     { username, email, password }                         │
       ├───────────────────────────────────────────────────────────>│
       │                                                            │
       │                                          2. Validate Input │
       │                                   Check if username exists │
       │                                   Check if email exists    │
       │                                                            │
       │                                     3. Hash Password       │
       │                                        bcrypt.hash(pwd, 10)│
       │                                                            │
       │                                     4. Create User in DB   │
       │                                        User.create({...})  │
       │                                                            │
       │                                     5. Generate JWT Token  │
       │                                        jwt.sign({ userId })│
       │                                                            │
       │  6. { token, user }                                       │
       │<───────────────────────────────────────────────────────────┤
       │                                                            │
       │  7. Store token in localStorage                           │
       │     localStorage.setItem('authToken', token)              │
       │                                                            │
       │  ══════════════════════════════════════════════════════   │
       │                                                            │
       │  8. GET /api/projects                                     │
       │     Header: Authorization: Bearer <token>                 │
       ├───────────────────────────────────────────────────────────>│
       │                                                            │
       │                                     9. Verify JWT Token    │
       │                                        jwt.verify(token)   │
       │                                                            │
       │                                    10. Extract userId      │
       │                                        decoded.userId      │
       │                                                            │
       │                                    11. Query Database      │
       │                                        Project.find({      │
       │                                          userId: userId    │
       │                                        })                  │
       │                                                            │
       │ 12. { projects: [...] }                                   │
       │<───────────────────────────────────────────────────────────┤
       │                                                            │
```

**Key Security Points:**
- ✅ Password never stored in plain text (bcrypt hashed)
- ✅ JWT token contains userId (server extracts it, client cannot tamper)
- ✅ All protected routes verify JWT token
- ✅ Database queries filtered by userId (user isolation)

---

## 📂 Project Save/Update Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER CLICKS "SAVE CLOUD"                         │
└───────────────────────────────┬────────────────────────────────────────┘
                                │
                                ▼
                   ┌────────────────────────┐
                   │ Check: user logged in? │
                   └───────────┬────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                   NO                    YES
                    │                     │
                    ▼                     ▼
           ┌─────────────────┐  ┌──────────────────────┐
           │ Show login modal│  │ Check currentProjectId│
           │     STOP         │  └──────────┬───────────┘
           └─────────────────┘             │
                                            │
                            ┌───────────────┴───────────────┐
                            │                               │
                      currentProjectId                currentProjectId
                         === null                         !== null
                            │                               │
                            ▼                               ▼
              ┌─────────────────────────┐   ┌────────────────────────────┐
              │   CREATE NEW PROJECT     │   │   UPDATE EXISTING PROJECT  │
              ├─────────────────────────┤   ├────────────────────────────┤
              │ POST /api/projects      │   │ PUT /api/projects/:id      │
              │                         │   │                            │
              │ Body:                   │   │ Body:                      │
              │   { name, files,        │   │   { name, files,           │
              │     activeFile }        │   │     activeFile }           │
              │                         │   │                            │
              │ Backend:                │   │ Backend:                   │
              │ 1. Extract userId from  │   │ 1. Extract userId from JWT │
              │    JWT token            │   │ 2. Query with ownership:   │
              │ 2. Create project:      │   │    findOneAndUpdate({      │
              │    Project.create({     │   │      _id: id,              │
              │      ...data,           │   │      userId: userId        │
              │      userId             │   │    })                      │
              │    })                   │   │ 3. Return updated project  │
              │ 3. Return new project   │   │                            │
              │                         │   │                            │
              │ Frontend:               │   │ Frontend:                  │
              │ 1. Get project._id      │   │ 1. Confirm update          │
              │ 2. setCurrentProjectId  │   │ 2. Update localStorage     │
              │ 3. Save to localStorage │   │                            │
              │    with projectId       │   │                            │
              └─────────┬───────────────┘   └────────────┬───────────────┘
                        │                                │
                        └────────────┬───────────────────┘
                                     │
                                     ▼
                       ┌──────────────────────────┐
                       │ ✅ SUCCESS MESSAGE       │
                       │ "Project saved!"         │
                       └──────────────────────────┘
```

**Key Logic:**
- `currentProjectId === null` → Create new project (POST)
- `currentProjectId !== null` → Update existing (PUT)
- `currentProjectId` set when:
  - User loads project from cloud
  - New project created and saved
- `currentProjectId` NOT restored from localStorage on mount (prevents stale ID errors)

---

## 🔄 Load Project Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER CLICKS "LOAD"                               │
└───────────────────────────────┬────────────────────────────────────────┘
                                │
                                ▼
                   ┌────────────────────────┐
                   │ Check: user logged in? │
                   └───────────┬────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                   NO                    YES
                    │                     │
                    ▼                     ▼
           ┌─────────────────┐  ┌──────────────────────┐
           │ Show login modal│  │ GET /api/projects    │
           │     STOP         │  │ (fetch all projects) │
           └─────────────────┘  └──────────┬───────────┘
                                           │
                                           ▼
                              ┌────────────────────────┐
                              │ Backend:               │
                              │ 1. Extract userId      │
                              │ 2. Project.find({      │
                              │      userId            │
                              │    })                  │
                              │ 3. Return projects[]   │
                              └──────────┬─────────────┘
                                         │
                                         ▼
                              ┌────────────────────────┐
                              │ Display project list   │
                              │ (prompt with numbers)  │
                              └──────────┬─────────────┘
                                         │
                                         ▼
                              ┌────────────────────────┐
                              │ User selects project # │
                              └──────────┬─────────────┘
                                         │
                                         ▼
                              ┌────────────────────────┐
                              │ GET /api/projects/:id  │
                              └──────────┬─────────────┘
                                         │
                                         ▼
                              ┌────────────────────────┐
                              │ Backend:               │
                              │ 1. Verify ownership:   │
                              │    findOne({           │
                              │      _id: id,          │
                              │      userId            │
                              │    })                  │
                              │ 2. Return project data │
                              └──────────┬─────────────┘
                                         │
                                         ▼
                              ┌────────────────────────┐
                              │ Frontend:              │
                              │ 1. setFiles()          │
                              │ 2. setProjectName()    │
                              │ 3. setActiveFile()     │
                              │ 4. setCurrentProjectId ← IMPORTANT!│
                              │ 5. Save to localStorage│
                              │    (with projectId)    │
                              └──────────┬─────────────┘
                                         │
                                         ▼
                              ┌────────────────────────┐
                              │ ✅ Project loaded      │
                              │ 🔗 Linked to cloud     │
                              │ (next save = UPDATE)   │
                              └────────────────────────┘
```

**Key Points:**
- Only logged-in users can load from cloud
- Backend filters by userId (security)
- Frontend sets `currentProjectId` (creates cloud link)
- Subsequent saves will UPDATE this project

---

## 🆕 New Project Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER CLICKS "NEW"                                │
└───────────────────────────────┬────────────────────────────────────────┘
                                │
                                ▼
                   ┌────────────────────────┐
                   │ Prompt for project name│
                   └───────────┬────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                 Cancel                  OK
                    │                     │
                    ▼                     ▼
           ┌─────────────────┐  ┌──────────────────────┐
           │      STOP        │  │ Confirm creation     │
           └─────────────────┘  └──────────┬───────────┘
                                           │
                                           ▼
                              ┌────────────────────────┐
                              │ Clear all state:       │
                              │ - setFiles(EMPTY)      │
                              │ - setActiveFile('')    │
                              │ - setProjectName(name) │
                              │ - setCurrentProjectId  │
                              │   (null) ← IMPORTANT!  │
                              └──────────┬─────────────┘
                                         │
                                         ▼
                              ┌────────────────────────┐
                              │ Update localStorage:   │
                              │ {                      │
                              │   name,                │
                              │   files: EMPTY,        │
                              │   activeFile: '',      │
                              │   // NO projectId!     │
                              │   savedAt              │
                              │ }                      │
                              └──────────┬─────────────┘
                                         │
                                         ▼
                              ┌────────────────────────┐
                              │ ✅ New project created │
                              │ 🔓 Not linked to cloud │
                              │ (next save = CREATE)   │
                              └────────────────────────┘
```

**Key Innovation:**
- `setCurrentProjectId(null)` breaks cloud link
- Next "Save Cloud" will CREATE new project (not update)
- Prevents accidental updates to loaded projects

---

## 💾 Data Storage Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          HYBRID STORAGE                               │
└───────────────────────────┬──────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│   localStorage        │       │   MongoDB (Cloud)     │
│   (Browser)           │       │   (Server)            │
├───────────────────────┤       ├───────────────────────┤
│                       │       │                       │
│ Use Case:             │       │ Use Case:             │
│ - Quick saves         │       │ - Persistence         │
│ - Work in progress    │       │ - Cross-device sync   │
│ - Offline access      │       │ - Backup              │
│                       │       │ - Multi-user          │
│ Advantages:           │       │                       │
│ ✅ Instant (no network)│       │ Advantages:           │
│ ✅ Works offline       │       │ ✅ 16MB per document  │
│ ✅ No login required   │       │ ✅ Synced everywhere  │
│ ✅ No DB cost          │       │ ✅ User authentication│
│                       │       │ ✅ Backup & recovery  │
│ Limitations:          │       │                       │
│ ⚠️ 5-10MB limit       │       │ Limitations:          │
│ ⚠️ Single device      │       │ ⚠️ Requires network   │
│ ⚠️ Can be cleared     │       │ ⚠️ Requires login     │
│                       │       │ ⚠️ Database costs     │
│ Data Structure:       │       │                       │
│ {                     │       │ Data Structure:       │
│   name: "my-app",     │       │ {                     │
│   files: {...},       │       │   _id: ObjectId,      │
│   activeFile: "...",  │       │   userId: ObjectId,   │
│   projectId: "..."?,  │       │   name: "my-app",     │
│   savedAt: Date       │       │   files: {...},       │
│ }                     │       │   activeFile: "...",  │
│                       │       │   createdAt: Date,    │
│                       │       │   updatedAt: Date     │
│                       │       │ }                     │
└───────────────────────┘       └───────────────────────┘
            │                               │
            └───────────────┬───────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │   Sync Strategy:       │
                │                        │
                │ 1. "Save Local"        │
                │    → localStorage only │
                │                        │
                │ 2. "Save Cloud"        │
                │    → MongoDB + local   │
                │    → Sets projectId    │
                │                        │
                │ 3. "Load from Cloud"   │
                │    → MongoDB → local   │
                │    → Sets projectId    │
                │                        │
                │ 4. Page Refresh        │
                │    → Load from local   │
                │    → DON'T restore ID  │
                └───────────────────────┘
```

---

**Last Updated:** October 20, 2025  
**Version:** 1.0.0  
**Project:** CipherStudio - Full-Stack Browser IDE
