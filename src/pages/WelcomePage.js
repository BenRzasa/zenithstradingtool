// The page the user will see upon entering the site
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css';
import logo from '../images/Site-logo.webp';
import cornerImage1 from '../images/Site-logo.webp';
import cornerImage2 from '../images/Site-logo.webp';
import cornerImage3 from '../images/Site-logo.webp';
import cornerImage4 from '../images/Site-logo.webp';

function WelcomePage() {
    const navigate = useNavigate();
    return (
        <div class="welcome-page">
            {/* Corner images container */}
            <div className="corner-images-container">
                <img src={cornerImage1} alt="Top Left" className="corner-image top-left" />
                <img src={cornerImage2} alt="Top Right" className="corner-image top-right" />
                <img src={cornerImage3} alt="Bottom Left" className="corner-image bottom-left" />
                <img src={cornerImage4} alt="Bottom Right" className="corner-image bottom-right" />
            </div>
            <div>
                <h1 class="name">
                    <span class="copy-wrap">
                        Created by ZenithFlare for The Celestial Caverns
                        </span>
                    </h1>

                    <div class="square"></div>
                    <div class="card">
                        {/* TCC Logo */}
                        <img 
                            src={logo} 
                            alt="Site Logo" 
                            className="site-logo" 
                            style={{ 
                                position: 'absolute',
                                zIndex: '10000',
                                marginLeft: '0px',
                                marginTop: '900px',
                                transform: 'scale(1.25)'
                            }}
                        />
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