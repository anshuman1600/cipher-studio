// ========================================
// FILE MODEL (Optional - For S3 Storage)
// Define the structure of individual files
// Currently files are stored in Project.files object
// This model is for future S3/cloud storage integration
// ========================================

const mongoose = require('mongoose');

// Define the schema for individual file storage
const fileSchema = new mongoose.Schema({
  // Project ID - links file to specific project
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project ID is required']
  },
  
  // Parent folder ID (null for root files)
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null
  },
  
  // File or folder name
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  
  // Type: 'file' or 'folder'
  type: {
    type: String,
    enum: ['file', 'folder'],
    required: [true, 'Type is required']
  },
  
  // File content (only for files, not folders)
  content: {
    type: String,
    default: ''
  },
  
  // File size in bytes
  size: {
    type: Number,
    default: 0
  },
  
  // S3/Cloud storage key (for future use)
  s3Key: {
    type: String,
    default: null
  },
  
  // File language/extension
  language: {
    type: String,
    default: 'javascript'
  },
  
  // Path from root (e.g., 'projects/p1/src/App.js')
  path: {
    type: String,
    required: true
  },
  
  // When file was created
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // When file was last updated
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
fileSchema.index({ projectId: 1, path: 1 });
fileSchema.index({ projectId: 1, parentId: 1 });

// Create and export the model
const File = mongoose.model('File', fileSchema);

module.exports = File;
