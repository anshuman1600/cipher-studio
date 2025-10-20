import { Save, Plus, Moon, Sun, Cloud, FolderOpen, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import './Toolbar.css';

function Toolbar({ 
  projectName,
  user,
  onSave, 
  onSaveToCloud, 
  onLoadProject, 
  onNewProject, 
  onToggleTheme,
  onLogin,
  onLogout,
  theme 
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <h1 className="logo">
          <span className="logo-icon">⚡</span>
          CipherStudio
        </h1>
        <span className="project-name">{projectName}</span>
      </div>
      <div className="toolbar-right">
        {user && (
          <div className="user-info">
            <UserIcon size={16} />
            <span>{user.username}</span>
          </div>
        )}
        <button className="toolbar-btn" onClick={onNewProject} title="New Project">
          <Plus size={18} />
          New
        </button>
        <button className="toolbar-btn save-btn" onClick={onSave} title="Save Locally">
          <Save size={18} />
          Save Local
        </button>
        <button 
          className={`toolbar-btn cloud-btn ${!user ? 'disabled' : ''}`} 
          onClick={onSaveToCloud} 
          title={user ? "Save to Cloud" : "Login required to save to cloud"}
          disabled={!user}
        >
          <Cloud size={18} />
          Save Cloud
        </button>
        <button 
          className={`toolbar-btn ${!user ? 'disabled' : ''}`} 
          onClick={onLoadProject} 
          title={user ? "Load Project" : "Login required to load from cloud"}
          disabled={!user}
        >
          <FolderOpen size={18} />
          Load
        </button>
        <button className="toolbar-btn" onClick={onToggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {user ? (
          <button className="toolbar-btn logout-btn" onClick={onLogout} title="Logout">
            <LogOut size={18} />
            Logout
          </button>
        ) : (
          <button className="toolbar-btn login-btn" onClick={onLogin} title="Login">
            <LogIn size={18} />
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Toolbar;
