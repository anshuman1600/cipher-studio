// ========================================
// PROJECT CONTROLLER
// Business logic for project operations
// ========================================

const Project = require('../models/Project');

/**
 * Create a new project
 * @route POST /api/projects
 */
exports.createProject = async (req, res) => {
  try {
    // Get data from request body
    const { name, files, activeFile } = req.body;
    
    // Get userId from authenticated user (set by auth middleware)
    const userId = req.user?.id;

    console.log('📝 Creating project...');
    console.log('User ID:', userId);
    console.log('Project Name:', name);
    console.log('Files count:', Object.keys(files || {}).length);

    // Validate required fields
    if (!name || !files) {
      return res.status(400).json({
        success: false,
        message: 'Project name and files are required'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Create new project with userId
    const newProject = new Project({
      userId,
      name,
      files,
      activeFile,
      updatedAt: new Date()
    });

    // Save to database
    const savedProject = await newProject.save();

    console.log('✅ Project saved with ID:', savedProject._id);
    console.log('   Belongs to user:', savedProject.userId);

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Project saved successfully!',
      project: savedProject
    });

  } catch (error) {
    console.error('❌ Error saving project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save project',
      error: error.message
    });
  }
};

/**
 * Get all projects for the logged-in user
 * @route GET /api/projects
 */
exports.getAllProjects = async (req, res) => {
  try {
    // Get userId from authenticated user
    const userId = req.user?.id;

    console.log('📂 Fetching projects for user:', userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Find only projects belonging to this user, sorted by update time (newest first)
    const projects = await Project.find({ userId })
      .sort({ updatedAt: -1 })
      .select('name createdAt updatedAt'); // Only return these fields

    console.log(`✅ Found ${projects.length} projects for user`);
    projects.forEach(p => {
      console.log(`   - ${p.name} (ID: ${p._id})`);
    });

    res.json({
      success: true,
      count: projects.length,
      projects
    });

  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

/**
 * Get a single project by ID (only if it belongs to the user)
 * @route GET /api/projects/:id
 */
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    console.log('🔍 Loading project:', id);
    console.log('   Requested by user:', userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Find project by ID and userId (security check)
    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      console.log('❌ Project not found or access denied');
      return res.status(404).json({
        success: false,
        message: 'Project not found or you do not have access to it'
      });
    }

    console.log('✅ Project loaded:', project.name);
    console.log('   Files:', Object.keys(project.files || {}).length);

    res.json({
      success: true,
      project
    });

  } catch (error) {
    console.error('❌ Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
};

/**
 * Update an existing project (only if it belongs to the user)
 * @route PUT /api/projects/:id
 */
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, files, activeFile } = req.body;
    const userId = req.user?.id;

    console.log('🔄 Update project request:');
    console.log('   Project ID:', id);
    console.log('   User ID:', userId);
    console.log('   Project Name:', name);
    console.log('   Files count:', Object.keys(files || {}).length);

    if (!userId) {
      console.log('❌ User not authenticated');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Find and update project (only if it belongs to this user)
    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, userId }, // Match both ID and userId
      {
        name,
        files,
        activeFile,
        updatedAt: new Date()
      },
      { 
        new: true,              // Return updated document
        runValidators: true     // Run schema validations
      }
    );

    if (!updatedProject) {
      console.log('❌ Project not found or access denied');
      console.log('   Searched for: ID =', id, ', userId =', userId);
      
      // Debug: Check if project exists at all
      const projectExists = await Project.findById(id);
      if (projectExists) {
        console.log('   ⚠️ Project EXISTS but belongs to user:', projectExists.userId);
        console.log('   ⚠️ You are trying to access as user:', userId);
      } else {
        console.log('   ⚠️ Project does NOT exist in database');
      }
      
      return res.status(404).json({
        success: false,
        message: 'Project not found or you do not have access to it'
      });
    }

    console.log('✅ Project updated successfully!');
    console.log('   Updated project:', updatedProject.name);

    res.json({
      success: true,
      message: 'Project updated successfully!',
      project: updatedProject
    });

  } catch (error) {
    console.error('❌ Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
};

/**
 * Delete a project (only if it belongs to the user)
 * @route DELETE /api/projects/:id
 */
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Find and delete project (only if it belongs to this user)
    const deletedProject = await Project.findOneAndDelete({ _id: id, userId });

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or you do not have access to it'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully!'
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};
