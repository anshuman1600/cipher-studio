// ========================================
// PROJECT ROUTES
// Define API endpoints (Protected - requires authentication)
// ========================================

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

// All routes below require authentication
router.use(protect);

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (requires auth)
router.post('/', projectController.createProject);

// @route   GET /api/projects
// @desc    Get all projects for logged-in user
// @access  Private (requires auth)
router.get('/', projectController.getAllProjects);

// @route   GET /api/projects/:id
// @desc    Get a single project by ID (if belongs to user)
// @access  Private (requires auth)
router.get('/:id', projectController.getProjectById);

// @route   PUT /api/projects/:id
// @desc    Update a project (if belongs to user)
// @access  Private (requires auth)
router.put('/:id', projectController.updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete a project (if belongs to user)
// @access  Private (requires auth)
router.delete('/:id', projectController.deleteProject);

module.exports = router;
