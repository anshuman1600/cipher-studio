import Editor from '@monaco-editor/react';
import './CodeEditor.css';
import { useEffect, useRef, useState } from 'react';

function CodeEditor({ file, code, onChange, theme }) {
  const [sizeKey, setSizeKey] = useState(0);
  const [isRemounting, setIsRemounting] = useState(false);
  const containerRef = useRef(null);
  const resizeTimer = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      setIsRemounting(true);
      resizeTimer.current = setTimeout(() => {
        setSizeKey((k) => k + 1);
        setTimeout(() => setIsRemounting(false), 120);
      }, 40);
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
    };
  }, []);

  return (
    <div className="code-editor" ref={containerRef}>
      <div className="editor-header">
        <span className="editor-title">{file || 'No file selected'}</span>
      </div>
      
      {!file ? (
        <div className="empty-editor-message">
          <p>📄 No file open</p>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
            Select a file from the file explorer or create a new one
          </p>
        </div>
      ) : (
        <>
          {/* use key so monaco remounts when container size changes */}
          <Editor
            key={sizeKey}
            height="100%"
            defaultLanguage="javascript"
            language="javascript"
            value={code}
            onChange={onChange}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
            }}
          />

          {isRemounting && (
            <div className="editor-remount-overlay">Resizing editor…</div>
          )}
        </>
      )}
    </div>
  );
}

export default CodeEditor;
