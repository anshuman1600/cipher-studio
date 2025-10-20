// ========================================
// FILE ROUTES
// Define API endpoints for file operations
// ========================================

const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { protect } = require('../middleware/auth');

// Protect all file routes - require authentication
router.use(protect);

// ========================================
// FILE ROUTES
// ========================================

// Create a new file or folder in a project
// POST /api/files
router.post('/', fileController.createFile);

// Get file/folder details by ID
// GET /api/files/:id
router.get('/:id', fileController.getFileById);

// Update file content or rename file/folder
// PUT /api/files/:id
router.put('/:id', fileController.updateFile);

// Delete a file or folder
// DELETE /api/files/:id
router.delete('/:id', fileController.deleteFile);

module.exports = router;
