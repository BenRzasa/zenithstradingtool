// The page the user will see upon entering the site.
import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
    return (
        <div>
            <h1>Welcome to Zenith's Trading Tool</h1>
            <nav>
                <ul>
                    <li><Link to="/csvloader">CSV Loader & Ore List</Link></li>
                    <li><Link to="/valuechart">Value Chart</Link></li>
                    <li><Link to="/tradetool">Trade Tool</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default WelcomePage;