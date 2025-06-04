// SettingsToggle.js
import React from 'react';

const SettingsToggle = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      style={{
        scale:'1.5',
        position: 'fixed',
        top: '15px',
        right: '30px',
        background:'none',
        color: 'black',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        fontSize: '25px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1001
      }}
    >
      ⚙️
    </button>
  );
};

export default SettingsToggle;