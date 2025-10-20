import { Sandpack } from '@codesandbox/sandpack-react';
import './Preview.css';
import { useEffect, useRef, useState, useMemo } from 'react';

function Preview({ files, theme }) {
  // Files are already in flat format from parent
  const sandpackFiles = files;
  const hasFiles = Object.keys(sandpackFiles).length > 0;

  // Generate unique key from files content to force Sandpack refresh
  const filesKey = useMemo(() => {
    return JSON.stringify(files);
  }, [files]);

  // Key to force remount of Sandpack when container size changes OR files change
  const [sizeKey, setSizeKey] = useState(0);
  const [isRemounting, setIsRemounting] = useState(false);
  const containerRef = useRef(null);
  const resizeTimer = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      // Debounce remount to avoid too many re-renders
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      // show small overlay while remounting
      setIsRemounting(true);
      resizeTimer.current = setTimeout(() => {
        setSizeKey((k) => k + 1);
        // hide overlay shortly after remount
        setTimeout(() => setIsRemounting(false), 180);
      }, 40); // faster debounce for snappier UX
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
    };
  }, []);

  return (
    <div className="preview">
      <div className="preview-header">
        <span className="preview-title">Preview</span>
      </div>
      <div className="preview-content" ref={containerRef}>
        {!hasFiles ? (
          <div className="empty-preview-message">
            <p>👁️ No preview available</p>
            <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
              Create files and write code to see live preview
            </p>
          </div>
        ) : (
          <>
            {/* Use key so Sandpack remounts when files change or container resizes */}
            <Sandpack
              key={`${filesKey}-${sizeKey}`}
              template="react"
              files={sandpackFiles}
              theme={theme === 'dark' ? 'dark' : 'light'}
              options={{
                showNavigator: true,
                showTabs: false,
                showLineNumbers: false,
                editorHeight: '100%',
                editorWidthPercentage: 0,
                layout: 'preview',
              }}
            />

            {isRemounting && (
              <div className="preview-remount-overlay">Updating preview…</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Preview;
