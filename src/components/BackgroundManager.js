import React, { useState, useEffect } from 'react';

const BackgroundManager = ({ children }) => {
  const [background, setBackground] = useState('');
  const [customBg, setCustomBg] = useState('');

  // Load saved background on component mount
  useEffect(() => {
    const savedBg = localStorage.getItem('ztt-background');
    if (savedBg) {
      setBackground(savedBg);
    }
  }, []);

  // Apply background style
  const bgStyle = {
    backgroundImage: background ? `url(${background})` : 'none',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    minHeight: '100vh'
  };
  // Handle background change
  const handleBgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const bgUrl = event.target.result;
        setCustomBg(bgUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  // Apply background and save to local storage
  const applyBackground = () => {
    if (customBg) {
      setBackground(customBg);
      localStorage.setItem('ztt-background', customBg);

      setCustomBg(''); // Clear the preview
    }
  };
  // Reset the background to none
  const resetBackground = () => {
    setBackground('');
    setCustomBg('');
    localStorage.removeItem('ztt-background');
  };

  return (
    <div style={bgStyle}>
      <div className="bg-controls" style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleBgChange} 
          style={{ display: 'none' }} 
          id="bg-upload"
        />
        <label htmlFor="bg-upload" style={{ 
          cursor: 'pointer',
          color: 'white',
          marginRight: '10px'
        }}>
          📁 Upload BG
        </label>
        {customBg && (
          <>
            <button onClick={applyBackground} style={{
              marginRight: '10px',
              cursor: 'pointer'
            }}>
              ✅ Apply
            </button>
            <button onClick={resetBackground} style={{
              cursor: 'pointer'
            }}>
              ❌ Reset
            </button>
          </>
        )}
      </div>
      {children}
    </div>
  );
};

export default BackgroundManager;