import React from 'react';

const IconRefreshButton = ({ onRefresh, status, disabled }) => {
    const { loading, message, progress, total } = status;

    return (
        <div className="icon-refresh-container">
            <button
                className="icon-refresh-btn"
                onClick={onRefresh}
                disabled={loading || disabled}
                title={disabled ? 'No ores loaded yet' : 'Refresh all ore icons (Ctrl+Shift+R)'}
            >
                <i className={`fa fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
                <span className="btn-text">Reload Icons</span>
            </button>
            {message && (
                <div className={`icon-status-message ${loading ? 'loading' : 'done'}`}>
                    {message}
                    {total > 0 && (
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${(progress / total) * 100}%` }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default IconRefreshButton;
