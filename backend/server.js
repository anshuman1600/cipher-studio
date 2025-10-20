// ========================================
// CIPHERSTUDIO BACKEND SERVER
// Modular Express + MongoDB Server
// ========================================

// Step 1: Import required packages
const express = require('express');      // Web framework
const cors = require('cors');            // Allow frontend to connect
const dotenv = require('dotenv');        // Load environment variables

// Step 2: Import custom modules
const connectDB = require('./config/database');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

// Step 3: Load environment variables from .env file
dotenv.config();

// Step 4: Create Express application
const app = express();

// Step 5: Configuration
const PORT = process.env.PORT || 5000;

// Step 6: Middleware (functions that run before routes)
// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://cipher-studio-one.vercel.app',
  'https://cipher-studio-one-git-main-anshuman1600s-projects.vercel.app',
  'https://cipher-studio-one-anshuman1600s-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('cipher-studio-one') || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // Parse JSON data (increased limit for large projects)

// Step 7: Connect to MongoDB Database
connectDB();

// ========================================
// API ROUTES
// ========================================

// Home route - Check if server is running
app.get('/', (req, res) => {
  res.json({
    message: '🚀 CipherStudio Backend is running!',
    status: 'active',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        getMe: 'GET /api/auth/me'
      },
      projects: {
        create: 'POST /api/projects',
        getAll: 'GET /api/projects',
        getById: 'GET /api/projects/:id',
        update: 'PUT /api/projects/:id',
        delete: 'DELETE /api/projects/:id'
      },
      files: {
        create: 'POST /api/files',
        getById: 'GET /api/files/:id',
        update: 'PUT /api/files/:id',
        delete: 'DELETE /api/files/:id'
      }
    }
  });
});

// Mount project routes
app.use('/api/projects', projectRoutes);

// Mount auth routes
app.use('/api/auth', authRoutes);

// Mount file routes
app.use('/api/files', fileRoutes);

// 404 handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
  console.log('========================================');
  console.log('🚀 CipherStudio Backend Server');
  console.log('========================================');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🗄️  Database: ${process.env.MONGODB_URI ? 'Configured' : 'NOT CONFIGURED'}`);
  console.log('========================================');
});
