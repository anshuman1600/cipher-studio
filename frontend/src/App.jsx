import { useState, useEffect } from 'react';
import Toolbar from './components/Toolbar/Toolbar';
import FileExplorer from './components/FileExplorer/FileExplorer';
import CodeEditor from './components/CodeEditor/CodeEditor';
import Preview from './components/Preview/Preview';
import AuthModal from './components/AuthModal/AuthModal';
import { saveProject, getAllProjects, getProject, updateProject, register, login, getMe } from './services/api';
import './App.css';

// Empty initial files for new projects
const EMPTY_FILES = {};

// Sample starter template (for first load only)
const STARTER_TEMPLATE = {
  'App.js': {
    code: `export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Welcome to CipherStudio! 🚀</h1>
      <p>Start editing to see changes live!</p>
    </div>
  );
}`,
    type: 'file'
  },
  'index.js': {
    code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
    type: 'file'
  },
  'components': {
    type: 'folder',
    children: {}
  }
};

function App() {
  const [files, setFiles] = useState(STARTER_TEMPLATE); // Start with sample template
  const [activeFile, setActiveFile] = useState('App.js');
  const [selectedItem, setSelectedItem] = useState('App.js');
  const [projectName, setProjectName] = useState('my-react-app');
  const [theme, setTheme] = useState('dark');
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Debug: Log files whenever they change
  useEffect(() => {
    console.log('Files state updated:', Object.keys(files));
  }, [files]);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token and get user info
      getMe(token)
        .then((result) => {
          setUser(result.user);
          console.log('✅ User loaded:', result.user.username);
        })
        .catch(() => {
          // Token invalid, clear it
          console.log('❌ Token invalid, clearing...');
          localStorage.removeItem('authToken');
          localStorage.removeItem('cipherStudioProject'); // Clear project too
        });
    }
  }, []);

  // Load saved project from localStorage on mount
  useEffect(() => {
    const savedProject = localStorage.getItem('cipherStudioProject');
    if (savedProject) {
      try {
        const parsed = JSON.parse(savedProject);
        setFiles(parsed.files || EMPTY_FILES);
        setProjectName(parsed.name || 'my-react-app');
        setActiveFile(parsed.activeFile || '');
        setSelectedItem(parsed.activeFile || '');
        // ⚠️ DO NOT restore projectId automatically on mount
        // Let it remain null so new saves create new projects
        // User must use "Load from Cloud" to restore a linked project
        console.log('� Loaded local project (no cloud link)');
      } catch (error) {
        console.error('Failed to load saved project:', error);
      }
    }
  }, []);

  // Save project to localStorage (local save)
  const handleSaveProject = () => {
    const project = {
      name: projectName,
      files,
      activeFile,
      projectId: currentProjectId, // Save projectId to track cloud project
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('cipherStudioProject', JSON.stringify(project));
    
    // Show better message based on whether it's linked to cloud
    if (currentProjectId) {
      alert('✅ Project saved locally! 💾\n\n🔗 Linked to cloud project ID: ' + currentProjectId);
    } else {
      alert('✅ Project saved locally! 💾\n\n💡 Tip: Use "Save Cloud" to backup to MongoDB');
    }
  };

  // Save project to cloud (MongoDB)
  const handleSaveToCloud = async () => {
    // Check if user is logged in
    if (!user) {
      alert('⚠️ Please login first to save to cloud!\n\nClick the "Login" button to create an account or sign in.');
      setShowAuthModal(true);
      return;
    }

    console.log('💾 Saving to cloud...');
    console.log('User:', user.username);
    console.log('Project:', projectName);
    console.log('Files:', Object.keys(files).length);
    console.log('Current Project ID:', currentProjectId);

    try {
      const projectData = {
        name: projectName,
        files,
        activeFile,
      };

      let result;
      if (currentProjectId) {
        // Update existing project (automatically if projectId exists)
        console.log('🔄 Updating existing project:', currentProjectId);
        result = await updateProject(currentProjectId, projectData);
        
        // Also update localStorage with latest data
        const localProject = {
          name: projectName,
          files,
          activeFile,
          projectId: currentProjectId,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem('cipherStudioProject', JSON.stringify(localProject));
        
        console.log('✅ Project updated successfully!');
        alert('✅ Project updated in cloud! ☁️\n\n"' + projectName + '" has been saved.');
      } else {
        // Save new project (only when no projectId exists)
        console.log('📝 Creating new project...');
        result = await saveProject(projectData);
        const newProjectId = result.project._id;
        setCurrentProjectId(newProjectId);
        
        // Save to localStorage with projectId
        const localProject = {
          name: projectName,
          files,
          activeFile,
          projectId: newProjectId,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem('cipherStudioProject', JSON.stringify(localProject));
        
        console.log('✅ New project created with ID:', newProjectId);
        alert('✅ Project saved to cloud! ☁️\n\nProject: "' + projectName + '"\nID: ' + newProjectId);
      }
    } catch (error) {
      console.error('❌ Failed to save:', error);
      alert('❌ Failed to save to cloud: ' + error.message + '\n\nMake sure backend server is running on port 5000');
    }
  };

  // Load project from cloud
  const handleLoadProject = async () => {
    // Check if user is logged in
    if (!user) {
      alert('⚠️ Please login first to load from cloud!\n\nClick the "Login" button to create an account or sign in.');
      setShowAuthModal(true);
      return;
    }

    console.log('📂 Loading projects for user:', user.username);

    try {
      // Get all projects
      const result = await getAllProjects();
      
      console.log('Received projects:', result.count);

      if (result.projects.length === 0) {
        alert('📭 No projects found in cloud!\n\nCreate and save a project first.');
        return;
      }

      // Show list of projects
      let projectList = 'Available Projects:\n\n';
      result.projects.forEach((proj, index) => {
        const date = new Date(proj.updatedAt).toLocaleString();
        projectList += `${index + 1}. ${proj.name} (${date})\n`;
      });
      projectList += '\nEnter project number to load:';

      const choice = prompt(projectList);
      if (!choice) return;

      const index = parseInt(choice) - 1;
      if (index < 0 || index >= result.projects.length) {
        alert('Invalid choice!');
        return;
      }

      // Load selected project
      const projectId = result.projects[index]._id;
      console.log('Loading project:', projectId);
      
      const projectData = await getProject(projectId);

      console.log('Project loaded:', projectData.project.name);
      console.log('Files count:', Object.keys(projectData.project.files).length);

      setFiles(projectData.project.files);
      setProjectName(projectData.project.name);
      setActiveFile(projectData.project.activeFile || '');
      setSelectedItem(projectData.project.activeFile || '');
      setCurrentProjectId(projectId); // Link to cloud project

      // Also save to localStorage
      const localProject = {
        name: projectData.project.name,
        files: projectData.project.files,
        activeFile: projectData.project.activeFile,
        projectId: projectId, // Important: Save project ID
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('cipherStudioProject', JSON.stringify(localProject));

      console.log('🔗 Project linked to cloud ID:', projectId);
      alert('✅ Project loaded successfully! ☁️\n\n"' + projectData.project.name + '"\n\n💡 Any changes will update this project when you click "Save Cloud"');
    } catch (error) {
      console.error('❌ Failed to load:', error);
      alert('❌ Failed to load project: ' + error.message + '\n\nMake sure backend server is running on port 5000');
    }
  };

  // Helper function to set value at path
  const setValueAtPath = (obj, path, value) => {
    const keys = path.split('/').filter(k => k);
    const newObj = JSON.parse(JSON.stringify(obj));
    let current = newObj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = { type: 'folder', children: {} };
      }
      current = current[keys[i]].children;
    }
    
    current[keys[keys.length - 1]] = value;
    return newObj;
  };

  // Helper function to delete at path
  const deleteAtPath = (obj, path) => {
    const keys = path.split('/').filter(k => k);
    const newObj = JSON.parse(JSON.stringify(obj));
    let current = newObj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]].children;
    }
    
    delete current[keys[keys.length - 1]];
    return newObj;
  };

  // Helper function to rename at path
  const renameAtPath = (obj, path, newName) => {
    const keys = path.split('/').filter(k => k);
    if (keys.length === 0) return obj;

    const newObj = JSON.parse(JSON.stringify(obj));
    let current = newObj;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]].children;
    }

    const oldKey = keys[keys.length - 1];
    const node = current[oldKey];
    if (!node) return obj;

    // Avoid overwriting existing name
    if (current[newName]) {
      alert('A file or folder with that name already exists in this folder.');
      return obj;
    }

    // Move node to new key and delete old
    current[newName] = node;
    delete current[oldKey];

    // Update activeFile/selectedItem if they used the old path
    const oldPath = path;
    const newPath = keys.slice(0, -1).concat(newName).join('/');
    if (activeFile && activeFile === oldPath) {
      setActiveFile(newPath);
    }
    if (selectedItem && selectedItem === oldPath) {
      setSelectedItem(newPath);
    }

    return newObj;
  };

  // Create new file or folder
  const handleCreateFile = (parentPath, name, type = 'file') => {
    const fullPath = parentPath ? `${parentPath}/${name}` : name;
    
    if (type === 'folder') {
      const newFiles = setValueAtPath(files, fullPath, { type: 'folder', children: {} });
      setFiles(newFiles);
    } else {
      const newFiles = setValueAtPath(files, fullPath, { 
        code: '// Start coding...', 
        type: 'file' 
      });
      setFiles(newFiles);
      setActiveFile(fullPath);
      setSelectedItem(fullPath);
    }
  };

  // Delete file
  const handleDeleteFile = (path) => {
    const newFiles = deleteAtPath(files, path);
    setFiles(newFiles);
    if (activeFile === path) {
      setActiveFile('');
      setSelectedItem('');
    }
  };

  // Get file content by path
  const getFileContent = (path) => {
    const keys = path.split('/').filter(k => k);
    let current = files;
    
    for (const key of keys) {
      if (current[key]) {
        if (current[key].type === 'file') {
          return current[key];
        }
        current = current[key].children;
      }
    }
    return null;
  };

  // Update file content
  const handleFileChange = (path, newCode) => {
    const newFiles = setValueAtPath(files, path, {
      code: newCode,
      type: 'file'
    });
    setFiles(newFiles);
  };

  // Handle file selection
  const handleFileSelect = (path) => {
    setActiveFile(path);
    setSelectedItem(path);
  };

  // Toggle theme
  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Reset project
  const handleNewProject = () => {
    console.log('New Project clicked - showing confirmation...');
    
    // Ask for project name first
    const newProjectName = prompt('Enter new project name:', 'my-react-app');
    
    // If user cancels or enters empty name, abort
    if (!newProjectName || newProjectName.trim() === '') {
      console.log('New project creation cancelled - no name provided');
      return;
    }
    
    // Confirm creation
    const confirmed = window.confirm(`Create new project "${newProjectName}"?\n\nCurrent changes will be lost if not saved.`);
    
    console.log('User confirmed:', confirmed);
    
    if (confirmed) {
      console.log('Creating new project with starter template:', newProjectName);
      
      // Create new project with STARTER_TEMPLATE (not empty!)
      setFiles(STARTER_TEMPLATE);
      setActiveFile('App.js');
      setSelectedItem('App.js');
      setProjectName(newProjectName.trim());
      setCurrentProjectId(null); // ← IMPORTANT: Clear cloud link so next save creates NEW project
      
      // Update localStorage WITHOUT projectId (fresh project)
      const localProject = {
        name: newProjectName.trim(),
        files: STARTER_TEMPLATE,
        activeFile: 'App.js',
        // NO projectId - this is a fresh project
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('cipherStudioProject', JSON.stringify(localProject));
      
      console.log('✅ New empty project created (not linked to cloud yet)');
      console.log('   Use "Save Cloud" to save it to MongoDB');
      
      // Show simple success message
      alert(`✅ New project "${newProjectName}" created!\n\n💡 Click "Save Cloud" to save it as a NEW project in MongoDB.`);
    } else {
      console.log('New project creation cancelled');
    }
  };

  // Handle user login
  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    localStorage.setItem('authToken', result.token);
    setUser(result.user);
  };

  // Handle user registration
  const handleRegister = async (userData) => {
    const result = await register(userData);
    localStorage.setItem('authToken', result.token);
    setUser(result.user);
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('cipherStudioProject'); // Clear project data
    setUser(null);
    setCurrentProjectId(null); // Clear project ID
    setFiles(EMPTY_FILES); // Clear files
    setActiveFile('');
    setProjectName('my-react-app');
    alert('👋 Logged out successfully!\n\n💡 Your session and project data have been cleared.');
  };

  // Convert files to flat structure for Sandpack
  const getFlatFiles = (files, prefix = '') => {
    let result = {};
    Object.entries(files).forEach(([name, item]) => {
      const path = prefix ? `${prefix}/${name}` : `/${name}`;
      if (item.type === 'file' && item.code) {
        result[path] = item.code;
      } else if (item.type === 'folder' && item.children) {
        result = { ...result, ...getFlatFiles(item.children, path) };
      }
    });
    return result;
  };

  const currentFileContent = activeFile ? getFileContent(activeFile) : null;

  return (
    <div className={`app ${theme}`}>
      <Toolbar
        projectName={projectName}
        user={user}
        onSave={handleSaveProject}
        onSaveToCloud={handleSaveToCloud}
        onLoadProject={handleLoadProject}
        onNewProject={handleNewProject}
        onToggleTheme={handleToggleTheme}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        theme={theme}
      />
      <div className="workspace">
        <FileExplorer
          files={files}
          activeFile={activeFile}
          selectedItem={selectedItem}
          onFileSelect={handleFileSelect}
          onItemSelect={setSelectedItem}
          onCreateFile={handleCreateFile}
          onDeleteFile={handleDeleteFile}
          onRename={(path, newName) => setFiles((f) => renameAtPath(f, path, newName))}
        />
        <CodeEditor
          file={activeFile}
          code={currentFileContent?.code || ''}
          onChange={(newCode) => handleFileChange(activeFile, newCode)}
          theme={theme}
        />
        <Preview files={getFlatFiles(files)} theme={theme} />
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
}

export default App;
