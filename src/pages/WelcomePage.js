// The page the user will see upon entering the site.
import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
    return (
        <div>
            <h1>Welcome to Zenith's Trading Tool</h1>
            <nav>
                <ul>
                    <li><Link to="/csvunloader">CSV Unloader & Ore List</Link></li>
                    <li><Link to="/placeholder1">Placeholder 1</Link></li>
                    <li><Link to="/placeholder2">Placeholder 2</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default WelcomePage;