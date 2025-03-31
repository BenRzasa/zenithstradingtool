// The page the user will see upon entering the site
import logo from '../images/misc/Site-logo.webp';
import ambro from '../images/misc/Ambrosine.webp';
import universallium from '../images/misc/Universallium.webp';
import havicron from '../images/misc/Havicron.webp'
import neutrine from '../images/misc/Neutrine.webp';
import ubriniale from '../images/misc/Ubriniale.webp'
import tornfabric from '../images/misc/Torn_Fabric.webp';
import singularity from '../images/misc/Singularity.webp'

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css';


function WelcomePage() {
    const navigate = useNavigate();
    return (
        <div className="welcome-page">
            {/* Corner images container */}
            <div className="corner-images-container">
                <img src={universallium} alt="Top Left" className="corner-image top-left" />
                <img src={neutrine} alt="Top Right" className="corner-image top-right" />
                <img src={tornfabric} alt="Bottom Left" className="corner-image bottom-left" />
                <img src={singularity} alt="Bottom Right" className="corner-image bottom-right" />
            </div>
            <div>
                <h1 className="name">
                    <span className="copy-wrap">
                        Created by ZenithFlare for The Celestial Caverns
                        </span>
                    </h1>

                    <div className="square"></div>
                    <div className="wcard">
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
                        <div className="card-title-wrap">
                            <h1 className="title">
                                <span className="copy-wrap">
                                    Welcome to Zenith's Trading Tool 𝛂1.3!
                                </span>
                            </h1> 
                        </div>
                    <div className="card-img"></div>
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
                        <div className="box-button">
                            <button onClick={() => navigate('/misc')}>
                            <span>Misc Info</span>
                            </button>
                        </div>
                        <div className="box-button">
                            <button onClick={() => window.open('https://the-celestial-caverns.fandom.com/wiki/The_Celestial_Caverns_Wiki', '_blank')}>
                                <span>TCC Wiki Page</span>
                            </button>
                        </div>
                    </div>
                    <h2 className="copyright">
                    <span className="copy-wrap">
                        20&nbsp;&nbsp;&nbsp;&nbsp;25
                    </span>
                    </h2>
            </div>
        </div>
    );
}

export default WelcomePage;