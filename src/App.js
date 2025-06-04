// Main app routing
/* 
  Welcome page ->:
    - CSV Unloader
    - Trade Tool
    - Layer Value Chart
*/

import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import CSVLoader from './pages/CSVLoader';
import TradeTool from './pages/TradeTool';
import ValueChart from './pages/ValueChart';
import MiscPage from './pages/MiscPage';
import CustomValuesEditor from './pages/CustomValuesEditor';
import RareFindsTracker from './pages/RareFindsTracker';
import { MiscProvider } from './context/MiscContext';
import { TradeProvider } from './context/TradeContext';
import BackgroundManager from './components/BackgroundManager';
import packageJson from '../package.json'; // or use process.env.REACT_APP_VERSION

function App() {
    useEffect(() => {
        document.title = `Zenith's Trading Tool v${packageJson.version}`;
    }, []);
    return (
        <TradeProvider>
            <MiscProvider>
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
                        <Route
                            path="/findtracker"
                            element={
                                <BackgroundManager>
                                    <RareFindsTracker />
                                </BackgroundManager>
                            }
                        />
                        <Route path="/tradetool" element={<TradeTool />} />
                        <Route path="/misc" element={<MiscPage />} />
                        <Route
                            path="/customvalues"
                            element={
                                <BackgroundManager>
                                    <CustomValuesEditor />
                                </BackgroundManager>
                            }
                        />
                    </Routes>
                </HashRouter>
                </div>
            </MiscProvider>
        </TradeProvider>
    );
}

export default App;