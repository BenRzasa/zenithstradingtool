// Main app routing
/* 
  Welcome page ->:
    - CSV Unloader
    - Trade Tool
    - Layer Value Chart
*/

import React, { useState, useEffect } from 'react';
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
import SettingsPanel from './components/SettingsPanel';
import SettingsToggle from './components/SettingsToggle';
import packageJson from '../package.json';

function App() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [background, setBackground] = useState('');
    const [customBg, setCustomBg] = useState('');
    const [opacity, setOpacity] = useState(0.5);

    useEffect(() => {
        document.title = `Zenith's Trading Tool v${packageJson.version}`;
        // Load saved settings
        const savedBg = localStorage.getItem('ztt-background');
        const savedOpacity = localStorage.getItem('ztt-bg-opacity');
        if (savedBg) setBackground(savedBg);
        if (savedOpacity) setOpacity(parseFloat(savedOpacity));
    }, []);

    const handleBgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCustomBg(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOpacityChange = (e) => {
        const newOpacity = parseFloat(e.target.value);
        setOpacity(newOpacity);
        localStorage.setItem('ztt-bg-opacity', newOpacity.toString());
    };

    const applyBackground = () => {
        if (customBg) {
            setBackground(customBg);
            localStorage.setItem('ztt-background', customBg);
            setCustomBg('');
        }
    };

    const resetBackground = () => {
        setBackground('');
        setCustomBg('');
        localStorage.removeItem('ztt-background');
        setOpacity(0.5);
        localStorage.removeItem('ztt-bg-opacity');
    };

    return (
        <TradeProvider>
            <MiscProvider>
                <BackgroundManager background={background} opacity={opacity}>
                    <SettingsToggle onClick={() => setSettingsOpen(!settingsOpen)} />
                    <SettingsPanel
                        isOpen={settingsOpen}
                        onClose={() => setSettingsOpen(false)}
                        opacity={opacity}
                        onOpacityChange={handleOpacityChange}
                        onBgChange={handleBgChange}
                        customBg={customBg}
                        onApplyBg={applyBackground}
                        onResetBg={resetBackground}
                    />
                    <HashRouter>
                        <Routes>
                            <Route path="/" element={<WelcomePage />} />
                            <Route path="/csvloader" element={<CSVLoader />} />
                            <Route path="/valuechart" element={<ValueChart />} />
                            <Route path="/findtracker" element={<RareFindsTracker />} />
                            <Route path="/tradetool" element={<TradeTool />} />
                            <Route path="/misc" element={<MiscPage />} />
                            <Route path="/customvalues" element={<CustomValuesEditor />} />
                        </Routes>
                    </HashRouter>
                </BackgroundManager>
            </MiscProvider>
        </TradeProvider>
    );
}

export default App;