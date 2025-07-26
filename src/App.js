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
import CreditsPage from './pages/CreditsPage';

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

        const savedBg = localStorage.getItem('ztt-background');
        const savedOpacity = localStorage.getItem('ztt-bg-opacity');
        if (savedOpacity) setOpacity(parseFloat(savedOpacity));
        if (savedBg && savedBg.startsWith('data:image/webp')) {
            setBackground(savedBg);
        } else if (savedBg) {
            // Convert existing non-WebP backgrounds
            const img = new Image();
            img.onload = async () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(async (blob) => {
                const webpURL = await convertToWebP(blob);
                localStorage.setItem('ztt-background', webpURL);
                setBackground(webpURL);
            }, 'image/webp');
            };
            img.src = savedBg;
        }
        }, []);

    const convertToWebP = (file, quality = 0.8) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(
                (blob) => {
                    const webpReader = new FileReader();
                    webpReader.onload = () => resolve(webpReader.result);
                    webpReader.readAsDataURL(blob);
                },
                'image/webp',
                quality
                );
            };
            img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleBgChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Convert to WebP first
        const webpData = await convertToWebP(file);
        setCustomBg(webpData); // Store the WebP version for preview
    };

    const handleOpacityChange = (e) => {
        const newOpacity = parseFloat(e.target.value);
        setOpacity(newOpacity);
        localStorage.setItem('ztt-bg-opacity', newOpacity.toString());
    };

    const applyBackground = () => {
        if (customBg) {
            setBackground(customBg);
            try {
                localStorage.removeItem('ztt-background');
                // Store ONLY the new background (as Base64)
                localStorage.setItem('ztt-background', customBg);
                setBackground(customBg);
                setCustomBg(''); // Clear the temp preview
            } catch(err) {
                window.alert("Local storage full. Image may be too large. Resetting...")
                resetBackground();
            }
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
                            <Route path="/credits" element={<CreditsPage />} />
                        </Routes>
                    </HashRouter>
                </BackgroundManager>
            </MiscProvider>
        </TradeProvider>
    );
}

export default App;