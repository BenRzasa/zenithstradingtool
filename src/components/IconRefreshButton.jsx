/*
 * Zenith's Trading Tool - An external website created for Celestial Caverns
 * Copyright (C) 2026 - Ben Rzasa
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
*/

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
