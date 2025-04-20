// Main app routing
/* 
  Welcome page ->:
    - CSV Unloader
    - Trade Tool
    - Layer Value Chart
*/

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import CSVLoader from './pages/CSVLoader';
import TradeTool from './pages/TradeTool';
import ValueChart from './pages/ValueChart';
import MiscPage from './pages/MiscPage';
import CustomValuesEditor from './pages/CustomValuesEditor';
import { CSVProvider } from './context/CSVContext';
import { TradeProvider } from './context/TradeContext';
import BackgroundManager from './components/BackgroundManager';

function App() {
    return (
        <TradeProvider>
            <CSVProvider>
                <div className="app-container">
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<WelcomePage />} />
                        <Route path="/csvloader" element={<CSVLoader />} />
                        <Route
                            path="/valuechart"
                            element={
                                <BackgroundManager>
                                    <ValueChart />
                                </BackgroundManager>
                            }
                        />
                        <Route path="/tradetool" element={<TradeTool />} />
                        <Route path="/misc" element={<MiscPage />} />
                        <Route path="/customvalues" element={<CustomValuesEditor />} />
                    </Routes>
                </HashRouter>
                </div>
            </CSVProvider>
        </TradeProvider>
    );
}

export default App;