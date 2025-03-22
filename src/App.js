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
import TradeTool from './pages/TradeTool';
import ValueChart from './pages/ValueChart';
import { CSVProvider } from './context/CSVContext';



function App() {
    return (
        <CSVProvider>
            <Router basename="/zenithstradingtool">
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/csvunloader" element={<CSVUnloader />} />
                    <Route path="/valuechart" element={<ValueChart />} />
                    <Route path="/tradetool" element={<TradeTool />} />
                </Routes>
            </Router>
        </CSVProvider>
    );
}

export default App;