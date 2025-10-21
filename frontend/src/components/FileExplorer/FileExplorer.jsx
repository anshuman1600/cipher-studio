import { useState } from 'react';
import { File, Trash2, ChevronRight, ChevronDown, Folder, FilePlus, FolderPlus } from 'lucide-react';
import './FileExplorer.css';

function FileItem({ name, item, path, activeFile, selectedItem, onFileSelect, onItemSelect, onDeleteFile, onRename, level = 0 }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(name);
  const isFolder = item.type === 'folder';
  const fullPath = path ? `${path}/${name}` : name;
  const isActive = fullPath === activeFile;
  const isSelected = fullPath === selectedItem;

  const handleClick = () => {
    onItemSelect(fullPath);
    if (!isFolder) {
      onFileSelect(fullPath);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <div
        className={`file-item ${isSelected ? 'selected' : ''} ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        onClick={handleClick}
      >
        <div className="file-name">
          {isFolder && (
            <span className="chevron">
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
          {!isFolder && <span className="chevron-placeholder" />}
          {isFolder ? <Folder size={14} /> : <File size={14} />}
          <span>{name}</span>
        </div>
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Delete ${isFolder ? 'folder' : 'file'} "${name}"?`)) {
              onDeleteFile(fullPath);
            }
          }}
          title={isFolder ? "Delete Folder" : "Delete File"}
        >
          <Trash2 size={12} />
        </button>
        <button
          className="rename-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsRenaming(true);
            setRenameValue(name);
          }}
          title={`Rename ${isFolder ? 'folder' : 'file'}`}
        >
          ✏️
        </button>
      </div>
        {isRenaming && (
          <div className="rename-input" onClick={(e) => e.stopPropagation()}>
            <input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const newName = renameValue.trim();
                  if (newName && newName !== name) {
                    onRename && onRename(fullPath, newName);
                  }
                  setIsRenaming(false);
                } else if (e.key === 'Escape') {
                  setIsRenaming(false);
                }
              }}
              onBlur={() => setIsRenaming(false)}
              autoFocus
            />
          </div>
        )}
      {isFolder && isOpen && item.children && (
        <div className="folder-contents">
          {Object.entries(item.children).map(([childName, childItem]) => (
            <FileItem
              key={childName}
              name={childName}
              item={childItem}
              path={fullPath}
              activeFile={activeFile}
              selectedItem={selectedItem}
              onFileSelect={onFileSelect}
              onItemSelect={onItemSelect}
              onDeleteFile={onDeleteFile}
              onRename={onRename}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </>
  );
}

function FileExplorer({ files, activeFile, selectedItem, onFileSelect, onItemSelect, onCreateFile, onDeleteFile, onRename }) {
  const [newItemName, setNewItemName] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [createInPath, setCreateInPath] = useState('');

  // Helper function to check if path is a folder (works for nested paths too)
  const isFolder = (path) => {
    if (!path) return false;
    
    // Split path and traverse
    const parts = path.split('/');
    let current = files;
    
    for (const part of parts) {
      if (!current[part]) return false;
      if (current[part].type === 'folder') {
        current = current[part].children || {};
      } else {
        return false; // It's a file, not a folder
      }
    }
    return true;
  };

  const handleCreateFile = () => {
    if (newItemName.trim()) {
      onCreateFile(createInPath, newItemName, 'file');
      setNewItemName('');
      setShowNewFileInput(false);
      setCreateInPath('');
    }
  };

  const handleCreateFolder = () => {
    if (newItemName.trim()) {
      onCreateFile(createInPath, newItemName, 'folder');
      setNewItemName('');
      setShowNewFolderInput(false);
      setCreateInPath('');
    }
  };

  const startCreatingFile = () => {
    // If selected item is a folder (even nested), create inside it
    const path = selectedItem && isFolder(selectedItem) ? selectedItem : '';
    setCreateInPath(path);
    setShowNewFileInput(true);
    setShowNewFolderInput(false);
  };

  const startCreatingFolder = () => {
    // If selected item is a folder (even nested), create inside it
    const path = selectedItem && isFolder(selectedItem) ? selectedItem : '';
    setCreateInPath(path);
    setShowNewFolderInput(true);
    setShowNewFileInput(false);
  };

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <span className="header-title">FILES</span>
        <div className="header-actions">
          <button
            className="add-file-btn"
            onClick={startCreatingFile}
            title="New File"
          >
            <FilePlus size={16} />
          </button>
          <button
            className="add-file-btn"
            onClick={startCreatingFolder}
            title="New Folder"
          >
            <FolderPlus size={16} />
          </button>
        </div>
      </div>

      {showNewFileInput && (
        <div className="new-file-input">
          <div className="input-label">
            {createInPath ? `📁 ${createInPath}/` : '📄 '}
          </div>
          <input
            type="text"
            placeholder="filename.js"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
            onBlur={() => {
              if (!newItemName.trim()) {
                setShowNewFileInput(false);
              }
            }}
            autoFocus
          />
        </div>
      )}

      {showNewFolderInput && (
        <div className="new-file-input">
          <div className="input-label">
            {createInPath ? `📁 ${createInPath}/` : '📁 '}
          </div>
          <input
            type="text"
            placeholder="folder-name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            onBlur={() => {
              if (!newItemName.trim()) {
                setShowNewFolderInput(false);
              }
            }}
            autoFocus
          />
        </div>
      )}

      <div className="file-tree">
        {Object.keys(files).length === 0 ? (
          <div className="empty-files-message">
            <p>📁 No files yet</p>
            <p style={{ fontSize: '12px', color: '#888' }}>
              Click + button above to create files/folders
            </p>
          </div>
        ) : (
          Object.entries(files).map(([name, item]) => (
            <FileItem
              key={name}
              name={name}
              item={item}
              path=""
              activeFile={activeFile}
              selectedItem={selectedItem}
              onFileSelect={onFileSelect}
              onItemSelect={onItemSelect}
              onDeleteFile={onDeleteFile}
              onRename={onRename}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default FileExplorer;
