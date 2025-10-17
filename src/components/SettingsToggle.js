import React from 'react';

const SettingsToggle = ({ onClick }) => {
  return (
    <button
      title="Settings"
      aria-label="Settings"
      onClick={onClick}
      style={{
        scale:'1.25',
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'var(--background-color)',
        color: 'var(--switch-outline)',
        border: '2.25px solid var(--switch-outline)',
        borderRadius: '12px',
        width: '40px',
        height: '40px',
        fontSize: '25px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: "10001",
      }}
    >
    <i className="fas fa-gear"></i>
    {}
    </button>
  );
};

export default SettingsToggle;
