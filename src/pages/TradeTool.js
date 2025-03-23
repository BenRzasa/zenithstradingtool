// The page the user will see upon entering the site.
import React from 'react';
import { Link } from 'react-router-dom';

function ValueChart() {
    return (
        <div>
            <h1>Trade Tool Placeholder Page</h1>
            <nav>
                <ul>
                    <li><Link to="/">Back to Home Page</Link></li>
                    <li><Link to="/valuechart">Value Chart</Link></li>
                    <li><Link to="/csvloader">CSV Loader</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default ValueChart;