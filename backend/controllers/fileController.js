// ========================================
// FILE CONTROLLER
// Handle file operations (create, read, update, delete)
// This is for individual file management
// ========================================

const File = require('../models/File');
const Project = require('../models/Project');

// ========================================
// CREATE A NEW FILE OR FOLDER
// POST /api/files
// ========================================
exports.createFile = async (req, res) => {
  try {
    const { projectId, parentId, name, type, content, language } = req.body;

    // Validate required fields
    if (!projectId || !name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Project ID, name, and type are required'
      });
    }

    // Verify project exists and belongs to user
    const project = await Project.findOne({ 
      _id: projectId, 
      userId: req.user.id 
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied'
      });
    }

    // Build file path
    let path = name;
    if (parentId) {
      const parent = await File.findById(parentId);
      if (parent) {
        path = `${parent.path}/${name}`;
      }
    }

    // Create file
    const file = await File.create({
      projectId,
      parentId: parentId || null,
      name,
      type,
      content: type === 'file' ? (content || '') : null,
      language: language || 'javascript',
      path,
      size: content ? content.length : 0
    });

    res.status(201).json({
      success: true,
      message: `${type === 'file' ? 'File' : 'Folder'} created successfully`,
      file
    });

  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create file',
      error: error.message
    });
  }
};

// ========================================
// GET FILE/FOLDER DETAILS BY ID
// GET /api/files/:id
// ========================================
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
      .populate('projectId', 'name userId')
      .populate('parentId', 'name path');

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Verify user owns the project
    if (file.projectId.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      file
    });

  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch file',
      error: error.message
    });
  }
};

// ========================================
// UPDATE FILE CONTENT OR RENAME
// PUT /api/files/:id
// ========================================
exports.updateFile = async (req, res) => {
  try {
    const { name, content, language } = req.body;

    const file = await File.findById(req.params.id)
      .populate('projectId', 'userId');

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Verify user owns the project
    if (file.projectId.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update fields
    if (name) file.name = name;
    if (content !== undefined && file.type === 'file') {
      file.content = content;
      file.size = content.length;
    }
    if (language) file.language = language;
    
    file.updatedAt = Date.now();

    await file.save();

    res.json({
      success: true,
      message: 'File updated successfully',
      file
    });

  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update file',
      error: error.message
    });
  }
};

// ========================================
// DELETE A FILE OR FOLDER
// DELETE /api/files/:id
// ========================================
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
      .populate('projectId', 'userId');

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Verify user owns the project
    if (file.projectId.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // If folder, delete all children recursively
    if (file.type === 'folder') {
      await File.deleteMany({ parentId: file._id });
    }

    await File.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `${file.type === 'file' ? 'File' : 'Folder'} deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    });
  }
};
