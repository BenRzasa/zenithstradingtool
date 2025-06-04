// SettingsPanel.js
import React, { useEffect, useRef } from 'react';
import ThemeSwitch from './ThemeSwitch';
import '../styles/SettingsPanel.css';

const SettingsPanel = ({
  isOpen,
  onClose,
  opacity,
  onOpacityChange,
  onBgChange,
  customBg,
  onApplyBg,
  onResetBg
}) => {
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add when the component mounts
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div 
      ref={panelRef}
      className={`settings-panel ${isOpen ? 'open' : ''}`}
    >
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Theme</h3>
        <div className="theme-control">
          <span>🔆Dark/Light Mode Toggle</span>
          <ThemeSwitch />
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Background</h3>
        <div className="opacity-control">
          <label className="opacity-label">
            Background Opacity: {Math.round(opacity * 100)}%
          </label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={opacity}
            onChange={onOpacityChange}
            className="opacity-slider"
          />
        </div>
        
        <div>
          <input 
            type="file" 
            accept="image/*" 
            onChange={onBgChange} 
            className="file-input"
            id="bg-upload"
          />
          <label htmlFor="bg-upload" className="upload-button">
            📁 Upload Background Image
          </label>
          
          {customBg && (
            <div className="action-buttons">
              <button 
                onClick={onApplyBg}
                className="apply-button"
              >
                Apply Background
              </button>
              <button 
                onClick={onResetBg}
                className="reset-button"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;