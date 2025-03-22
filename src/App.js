// Main app routing
/* 
  Welcome page ->:
    - CSV Unloader
    - Trade Tool
    - Layer Value Chart
*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import CSVUnloader from './pages/CSVUnloader';

function Placeholder1() {
    return <h2>Placeholder Page 1</h2>;
}

function Placeholder2() {
    return <h2>Placeholder Page 2</h2>;
}

function App() {
    return (
        <Router basename="/zenithstradingtool">
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/csvunloader" element={<CSVUnloader />} />
                <Route path="/placeholder1" element={<Placeholder1 />} />
                <Route path="/placeholder2" element={<Placeholder2 />} />
            </Routes>
        </Router>
    );
}

export default App;