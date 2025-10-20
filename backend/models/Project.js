// ========================================
// PROJECT MODEL
// Define the structure of a project
// ========================================

const mongoose = require('mongoose');

// Define the schema (structure) of a project
const projectSchema = new mongoose.Schema({
  // User ID - links project to specific user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  
  // Project name
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  
  // Files object (stores all files and folders)
  files: {
    type: Object,
    required: [true, 'Files are required']
  },
  
  // Currently active/open file
  activeFile: {
    type: String,
    default: ''
  },
  
  // When project was created
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // When project was last updated
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the model
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
