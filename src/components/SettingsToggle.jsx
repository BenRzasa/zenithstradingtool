import React from 'react';

const SettingsToggle = ({ onClick }) => {
    return (
        <button
            title="Settings"
            aria-label="Settings"
            onClick={onClick}
            style={{
                position: 'fixed',
                top: "0",
                right: "0",
                background: 'var(--background-color)',
                color: 'var(--switch-outline)',
                border: '2px solid var(--switch-outline)',
                width: '2em',
                height: '2em',
                fontSize: '27px',
                textAlign: 'center',
                verticalAlign: 'middle',
                cursor: 'pointer',
                zIndex: "50000",
            }}
        >
            <i className="fas fa-gear"></i>
            {}
        </button>
    );
};

export default SettingsToggle;
