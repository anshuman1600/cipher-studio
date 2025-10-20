// ========================================
// API SERVICE - Connect Frontend to Backend
// Simple functions to save/load projects
// ========================================

const API_URL = 'http://localhost:5000/api';

// Helper function to handle API errors
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// ========================================
// API FUNCTIONS
// ========================================

/**
 * Save a new project to database
 * @param {Object} projectData - { name, files, activeFile }
 * @returns {Promise} - Saved project data
 */
export const saveProject = async (projectData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error saving project:', error);
    throw error;
  }
};

/**
 * Get all projects from database (only for logged-in user)
 * @returns {Promise} - List of user's projects
 */
export const getAllProjects = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/projects`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

/**
 * Get a single project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise} - Project data
 */
export const getProject = async (projectId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

/**
 * Update an existing project
 * @param {string} projectId - Project ID
 * @param {Object} projectData - Updated data
 * @returns {Promise} - Updated project data
 */
export const updateProject = async (projectId, projectData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

/**
 * Delete a project
 * @param {string} projectId - Project ID
 * @returns {Promise} - Success message
 */
export const deleteProject = async (projectId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// ========================================
// AUTH API FUNCTIONS
// ========================================

/**
 * Register a new user
 * @param {Object} userData - { username, email, password }
 * @returns {Promise} - User data and token
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise} - User data and token
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Get current user info
 * @param {string} token - JWT token
 * @returns {Promise} - User data
 */
export const getMe = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// ========================================
// FILE API FUNCTIONS (Individual File Management)
// ========================================

/**
 * Create a new file or folder
 * @param {Object} fileData - { projectId, parentId, name, type, content, language }
 * @returns {Promise} - Created file data
 */
export const createFile = async (fileData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(fileData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
};

/**
 * Get file details by ID
 * @param {string} fileId - File ID
 * @returns {Promise} - File data
 */
export const getFile = async (fileId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/files/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching file:', error);
    throw error;
  }
};

/**
 * Update file content or rename
 * @param {string} fileId - File ID
 * @param {Object} fileData - { name, content, language }
 * @returns {Promise} - Updated file data
 */
export const updateFile = async (fileId, fileData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/files/${fileId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(fileData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating file:', error);
    throw error;
  }
};

/**
 * Delete a file or folder
 * @param {string} fileId - File ID
 * @returns {Promise} - Success message
 */
export const deleteFile = async (fileId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
