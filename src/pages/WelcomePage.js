// The page the user will see upon entering the site
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css';

function WelcomePage() {
    const navigate = useNavigate();
    return (
        <div class="welcome-page">
            <div>
                <h1 class="name">
                    <span class="copy-wrap">
                        Created by ZenithFlare for The Celestial Caverns
                        </span>
                    </h1>

                    <div class="square"></div>
                    <div class="card">
                        <div class="card-title-wrap">
                            <h1 class="title">
                                <span class="copy-wrap">
                                    
                                    Welcome to Zenith's Trading Tool v1.0!
                                </span>
                            </h1> 
                        </div>
                    <div class="card-img"></div>
                    </div>
                    {/* Buttons section */}
                    <div className="button-container">
                        <div className="box-button">
                            <button onClick={() => navigate('/csvloader')}>
                            <span>CSV Loader</span>
                            </button>
                        </div>
                        <div className="box-button">
                            <button onClick={() => navigate('/valuechart')}>
                            <span>Value Chart</span>
                            </button>
                        </div>
                        <div className="box-button">
                            <button onClick={() => navigate('/tradetool')}>
                            <span>Trade Tool</span>
                            </button>
                        </div>
                    </div>
                    <h2 class="copyright">
                    <span class="copy-wrap">
                        20&nbsp;&nbsp;&nbsp;&nbsp;25
                    </span>
                    </h2>
            </div>
        </div>
    );
}

export default WelcomePage;