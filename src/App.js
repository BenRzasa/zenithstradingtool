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
import CSVLoader from './pages/CSVLoader';
import TradeTool from './pages/TradeTool';
import ValueChart from './pages/ValueChart';
import { CSVProvider } from './context/CSVContext';
import { TradeProvider } from './context/TradeContext';



function App() {
    return (
        <TradeProvider>
        <CSVProvider>
            <Router basename="/zenithstradingtool">
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/csvloader" element={<CSVLoader />} />
                    <Route path="/valuechart" element={<ValueChart />} />
                    <Route path="/tradetool" element={<TradeTool />} />
                </Routes>
            </Router>
        </CSVProvider>
        </TradeProvider>
    );
}

export default App;