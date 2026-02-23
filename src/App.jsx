/*
 * Zenith's Trading Tool - An external website created for Celestial Caverns
 * Copyright (C) 2026 - Ben Rzasa
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
*/

// Main app routing
import React, { useState, useEffect, useContext, useCallback, createContext } from "react";
import {
    HashRouter,
    Routes,
    Route,
    useNavigate,
    useLocation,
} from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import TradeTool from "./pages/TradeTool";
import ValueChart from "./pages/ValueChart";
import MiscPage from "./pages/MiscPage";
import CustomValuesEditor from "./pages/CustomValuesEditor";
import RareFindsTracker from "./pages/RareFindsTracker";
import OreAndLayerWheel from "./pages/OreAndLayerWheel";
import CreditsPage from "./pages/CreditsPage";

import { MiscContext } from "./context/MiscContext";
import { PinListProvider } from "./context/PinListContext";
import { MiscProvider } from "./context/MiscContext";
import { TradeProvider } from "./context/TradeContext";
import { WheelProvider } from "./context/WheelContext";
import BackgroundManager from "./components/BackgroundManager";

import NavBar from "./components/NavBar";
import SettingsPanel from "./components/SettingsPanel";
import SettingsToggle from "./components/SettingsToggle";
import IconRefreshButton from "./components/IconRefreshButton";

import CustomPinList from "./components/CustomPinList";
import PinlistToggle from "./components/PinlistToggle";

import HotkeyHandler from "./components/HotkeyHandler";
import packageJson from "../package.json";
import md5 from 'md5';

export const IconContext = createContext();

// Constants
const STATIC_URL = "https://static.wikitide.net/celestialcavernswiki";
const PROXIES = [
    "https://corsproxy.io/?url=",
    "http://alloworigin.com/get?url=",
];
const CACHE_KEY = "ore-icons-cache";
const CACHE_TIMESTAMP_KEY = "ore-icons-timestamp";
const BATCH_SIZE = 25;
const REQUEST_DELAY = 25;
// Icon cache manager
class IconCacheManager {
    constructor() {
        this.cache = new Map();
        this.loadFromStorage();
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem(CACHE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                this.cache = new Map(Object.entries(parsed));
                console.log(`Loaded ${this.cache.size} icons from cache`);
            }
        } catch (error) {
            console.error("Failed to load icon cache:", error);
            this.cache = new Map();
        }
    }

    saveToStorage() {
        try {
            const obj = Object.fromEntries(this.cache);
            localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
            console.log(`Saved ${this.cache.size} icons to cache`);
        } catch (error) {
            console.error("Failed to save icon cache:", error);
        }
    }

    get(oreName) {
        return this.cache.get(oreName);
    }

    set(oreName, dataUrl) {
        this.cache.set(oreName, dataUrl);
    }

    has(oreName) {
        return this.cache.has(oreName);
    }

    clear() {
        this.cache.clear();
        this.saveToStorage();
    }

    getAllOreNames() {
        return Array.from(this.cache.keys());
    }

    size() {
        return this.cache.size;
    }
}

// Create singleton instance
const iconCache = new IconCacheManager();

// Helper function to convert image to data URL
const imageToDataURL = (url) => {
    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.blob();
        })
        .then(blob => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        });
};

// Sleep utility
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const VALUES_URL = "https://celestialcaverns.miraheze.org/w/index.php?title=Module:OreValuesData.json&action=raw";
const SUCCESSFUL_PROXY = "https://corsproxy.io/?url=";
const BACKUP_PROXY = "http://alloworigin.com/get?";

// IndexedDB setup
const DB_NAME = "ZenithTradingToolDB";
const DB_VERSION = 1;
const STORE_NAME = "backgrounds";
async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

async function saveToIndexedDB(data) {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        store.put(data, "background");
        return new Promise((resolve) => {
            transaction.oncomplete = () => resolve(true);
        });
    } catch (error) {
        console.error("IndexedDB save error:", error);
        return false;
    }
}

async function getFromIndexedDB() {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get("background");
        return new Promise((resolve) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null);
        });
    } catch (error) {
        console.error("IndexedDB read error:", error);
        return null;
    }
}

async function clearIndexedDB() {
    try {
        const db = await initDB();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        store.delete("background");
        return new Promise((resolve) => {
            transaction.oncomplete = () => resolve(true);
        });
    } catch (error) {
        console.error("IndexedDB clear error:", error);
        return false;
    }
}

function App() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [pinlistOpen, setPinlistOpen] = useState(false);
    const [background, setBackground] = useState("");
    const [customBg, setCustomBg] = useState("");
    const [opacity, setOpacity] = useState(0.5);

    // Generate the image path
    const generateImagePath = useCallback((oreName) => {
        const fileName = oreName.replace(/ /g, '_') + '_Icon.png';
        const hashHex = md5(fileName);
        const trimmedHash1 = hashHex.charAt(0);
        const trimmedHash2 = hashHex.charAt(0) + hashHex.charAt(1);
        return `${STATIC_URL}/${trimmedHash1}/${trimmedHash2}/${fileName}`;
    }, []);

    // Get image source (from cache or generate path)
    const getImageSource = useCallback((oreName) => {
        // Check cache first
        const cached = iconCache.get(oreName);
        if (cached) {
            return cached;
        }

        // Fall back to generated path
        return generateImagePath(oreName);
    }, [generateImagePath]);

    // Load cache on component mount
    useEffect(() => {
        iconCache.loadFromStorage();
    }, []);

    function checkResource (url) {
        var req = new XMLHttpRequest();
        req.open('HEAD', url, true);
        req.send();
        if (req.status === 404) {
            return false;
        }
        if (req.status === 403) {
            return false;
        }
    };

    const fetchAndStoreOreValues = useCallback(async () => {
        // Use the raw action parameter to get just the CSS
        const GRADIENTS_URL = "https://celestialcaverns.miraheze.org/w/index.php?title=Template:Color/styles.css&action=raw&ctype=text/css";

        const gradientTargetURL = encodeURIComponent(GRADIENTS_URL);
        const gradientProxyURL = SUCCESSFUL_PROXY + gradientTargetURL;

        try {
            console.log('Fetching raw gradients CSS...');
            const gradientController = new AbortController();
            const gradientTimeoutId = setTimeout(() => gradientController.abort(), 8000);

            const gradientResponse = await fetch(gradientProxyURL, {
                signal: gradientController.signal,
                headers: {
                    'Accept': 'text/css',
                }
            });

            clearTimeout(gradientTimeoutId);

            if (gradientResponse.ok) {
                const gradientCSS = await gradientResponse.text();
                const convertedCSS = gradientCSS.replace(/color:/g, 'background:');

                localStorage.setItem('gradientsCSS', convertedCSS);

                // Create and inject a style element with the converted CSS
                let styleElement = document.getElementById('dynamic-gradients-styles');
                if (!styleElement) {
                    styleElement = document.createElement('style');
                    styleElement.id = 'dynamic-gradients-styles';
                    document.head.appendChild(styleElement);
                }
                styleElement.textContent = convertedCSS;

                console.log('Gradients CSS fetched, converted color→background, and applied successfully');
            } else {
                console.error('Failed to fetch gradients CSS:', gradientResponse.status);
                // Try to load from cache if fetch fails
                const cachedGradients = localStorage.getItem('gradientsCSS');
                if (cachedGradients) {
                    let styleElement = document.getElementById('dynamic-gradients-styles');
                    if (!styleElement) {
                        styleElement = document.createElement('style');
                        styleElement.id = 'dynamic-gradients-styles';
                        document.head.appendChild(styleElement);
                    }
                    styleElement.textContent = cachedGradients;
                    console.log('Loaded gradients CSS from cache');
                }
            }
        } catch (error) {
            console.log('Gradient fetch error:', error.name === 'AbortError' ? 'Timeout' : error.message);
            // Try to load from cache on error
            const cachedGradients = localStorage.getItem('gradientsCSS');
            if (cachedGradients) {
                let styleElement = document.getElementById('dynamic-gradients-styles');
                if (!styleElement) {
                    styleElement = document.createElement('style');
                    styleElement.id = 'dynamic-gradients-styles';
                    document.head.appendChild(styleElement);
                }
                styleElement.textContent = cachedGradients;
                console.log('Loaded gradients CSS from cache after error');
            }
        }

        // Continue with the original proxy loop for ore values
        const proxyTemplates = [
            'https://corsproxy.io/?',
            'https://api.allorigins.win/raw?url=',
            'https://api.codetabs.com/v1/proxy?quest=',
            'https://cors-anywhere.herokuapp.com/',
            SUCCESSFUL_PROXY,
            BACKUP_PROXY
        ];

        const targetURL = encodeURIComponent(VALUES_URL);

        // Create full URLs from templates
        const proxyURLs = proxyTemplates.map(proxy => {
            if (proxy === SUCCESSFUL_PROXY || proxy === BACKUP_PROXY) {
                return proxy + targetURL;                
            }
            return proxy + targetURL;
        });

        console.log(`Trying ${proxyURLs.length} proxy URLs for: ${VALUES_URL}`);

        for (let i = 0; i < proxyURLs.length; i++) {
            try {
                console.log(`Attempt ${i + 1}/${proxyURLs.length}: ${new URL(proxyURLs[i]).hostname}`);

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                const response = await fetch(proxyURLs[i], {
                    signal: controller.signal,
                    headers: {
                        // Some proxies require specific headers
                        'Accept': 'application/json',
                    }
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const oresJSON = await response.json();
                    console.log(`Proxy ${i + 1} succeeded!`);

                    // Store data
                    localStorage.setItem('oreValuesData', JSON.stringify(oresJSON));
                    localStorage.setItem('lastSuccessfulProxy', proxyURLs[i]);
                    localStorage.setItem('lastFetchTime', Date.now().toString());

                    window.dispatchEvent(new CustomEvent('oreValuesUpdated', { 
                        detail: oresJSON 
                    }));
                    return;
                }

                console.log(`Proxy ${i + 1} failed with status: ${response.status}`);

            } catch (error) {
                console.log(`Proxy ${i + 1} error:`, error.name === 'AbortError' ? 'Timeout' : error.message);
            }
        }

        // All proxies failed - use cache as fallback
        const cachedData = localStorage.getItem('oreValuesData');
        if (cachedData) {
            console.warn("All proxies failed, using cached data");
            window.dispatchEvent(new CustomEvent('oreValuesUpdated', { 
                detail: JSON.parse(cachedData) 
            }));
        } else {
            console.error("All proxies failed and no cached data available!");
            window.dispatchEvent(new CustomEvent('oreValuesError', { 
                detail: 'Failed to fetch data' 
            }));
        }
    }, []);

    // Call fetchAndStoreOreValues on mount
    useEffect(() => {
        fetchAndStoreOreValues();
    }, [fetchAndStoreOreValues]);

    useEffect(() => {
        document.title = `Zenith's Trading Tool v${packageJson.version}`;

        const loadBackground = async () => {
            const savedOpacity = localStorage.getItem("ztt-bg-opacity");
            if (savedOpacity) setOpacity(parseFloat(savedOpacity));

            // Try localStorage first
            const savedBg = localStorage.getItem("ztt-background");
            if (savedBg) {
                // Check if it's a GIF (data:image/gif) or WebP (data:image/webp)
                if (
                    savedBg.startsWith("data:image/gif") ||
                        savedBg.startsWith("data:image/webp")
                ) {
                    setBackground(savedBg);
                    return;
                } else {
                    // Convert existing non-GIF, non-WebP backgrounds
                    const img = new Image();
                    img.onload = async () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob(async (blob) => {
                            const webpURL = await convertToWebP(blob);
                            localStorage.setItem("ztt-background", webpURL);
                            setBackground(webpURL);
                        }, "image/webp");
                    };
                    img.src = savedBg;
                    return;
                }
            }

            // Fallback to IndexedDB
            const indexedDbBg = await getFromIndexedDB();
            if (indexedDbBg) {
                setBackground(indexedDbBg);
            }
        };

        loadBackground();
    }, []);

    const convertToWebP = (file, quality = 0.8) => {
        return new Promise((resolve) => {
            // If it's a GIF, return it as-is
            if (file.type === "image/gif") {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
                return;
            }

            // Original WebP conversion logic for other image types
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob(
                        (blob) => {
                            const webpReader = new FileReader();
                            webpReader.onload = () => resolve(webpReader.result);
                            webpReader.readAsDataURL(blob);
                        },
                        "image/webp",
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

        // Convert to WebP (or keep as GIF)
        const webpData = await convertToWebP(file);
        setCustomBg(webpData); // Store for preview
    };

    const handleOpacityChange = (e) => {
        const newOpacity = parseFloat(e.target.value);
        setOpacity(newOpacity);
        localStorage.setItem("ztt-bg-opacity", newOpacity.toString());
    };

    const applyBackground = async () => {
        if (!customBg) return;

        try {
            // First try localStorage
            localStorage.setItem("ztt-background", customBg);
            setBackground(customBg);
            // If successful, clear any IndexedDB version
            await clearIndexedDB();
        } catch (err) {
            console.warn("LocalStorage full, falling back to IndexedDB");
            try {
                // Try IndexedDB
                const success = await saveToIndexedDB(customBg);
                if (success) {
                    setBackground(customBg);
                    localStorage.removeItem("ztt-background");
                } else {
                    window.alert("Failed to save background. Image may be too large.");
                    return;
                }
            } catch (indexedDbError) {
                window.alert(
                    "Both localStorage and IndexedDB are full. Please use a smaller image."
                );
                return;
            }
        }

        setCustomBg("");
    };

    const resetBackground = async () => {
        setBackground("");
        setCustomBg("");
        localStorage.removeItem("ztt-background");
        await clearIndexedDB();
        setOpacity(0.5);
        localStorage.removeItem("ztt-bg-opacity");
    };

    const iconContextValue = {
        getImageSource,
    };

    return (
        <HashRouter>
            <MiscProvider>
                <PinListProvider>
                    <TradeProvider>
                        <IconContext.Provider value={iconContextValue}>
                            <PathRedirectHandler />
                            <AppWithHotkeys
                                settingsOpen={settingsOpen}
                                setSettingsOpen={setSettingsOpen}
                                background={background}
                                customBg={customBg}
                                opacity={opacity}
                                handleOpacityChange={handleOpacityChange}
                                handleBgChange={handleBgChange}
                                applyBackground={applyBackground}
                                resetBackground={resetBackground}
                                pinlistOpen={pinlistOpen}
                                setPinlistOpen={setPinlistOpen}
                                fetchAndStoreOreValues={fetchAndStoreOreValues}
                            />
                        </IconContext.Provider>
                    </TradeProvider>
                </PinListProvider>
            </MiscProvider>
        </HashRouter>
    );
}

function PathRedirectHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if the path includes "csvloader"
        if (location.pathname.toLowerCase().includes("csvloader")) {
            // Redirect to valuechart
            navigate("/valuechart", { replace: true });
        }
    }, [location.pathname, navigate]);

    return null; // No rendering
}

function AppWithHotkeys({
    settingsOpen,
    setSettingsOpen,
    pinlistOpen,
    setPinlistOpen,
    background,
    customBg,
    opacity,
    handleOpacityChange,
    handleBgChange,
    applyBackground,
    resetBackground,
    iconRefreshStatus,
    fetchAndStoreOreValues
}) {
    const { hotkeysEnabled } = useContext(MiscContext);
    const [oreNames, setOreNames] = useState([]);

    // Load ore names from localStorage when available
    useEffect(() => {
        const loadOreNames = () => {
            const storedData = localStorage.getItem('oreValuesData');
            if (storedData) {
                try {
                    const data = JSON.parse(storedData);
                    // Extract ore names from the data structure
                    // Adjust this based on your actual data structure
                    const names = Object.keys(data).filter(key => 
                        data[key] && typeof data[key] === 'object' && data[key].name
                    ).map(key => data[key].name);
                    setOreNames(names);
                } catch (error) {
                    console.error('Failed to parse ore names:', error);
                }
            }
        };

        loadOreNames();

        // Listen for ore values updates
        const handleOreValuesUpdated = (event) => {
            const data = event.detail;
            const names = Object.keys(data).filter(key => 
                data[key] && typeof data[key] === 'object' && data[key].name
            ).map(key => data[key].name);
            setOreNames(names);
        };

        window.addEventListener('oreValuesUpdated', handleOreValuesUpdated);
        return () => window.removeEventListener('oreValuesUpdated', handleOreValuesUpdated);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (
                !hotkeysEnabled ||
                    ["INPUT", "TEXTAREA", "SELECT"].includes(
                        document.activeElement?.tagName
                    ) ||
                    e.ctrlKey ||
                    e.altKey ||
                    e.shiftKey ||
                    e.metaKey
            ) {
                return;
            }

            if (e.key.toLowerCase() === "s") {
                e.preventDefault();
                setSettingsOpen((prev) => !prev);
            }

            if (e.key.toLowerCase() === "p") {
                e.preventDefault();
                setPinlistOpen((prev) => !prev);
            }

            if (e.key.toLowerCase() === "i") {
                e.preventDefault();
                console.log("'I' detected - reloading values, icons, gradients");
                fetchAndStoreOreValues();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [hotkeysEnabled, setSettingsOpen, setPinlistOpen, fetchAndStoreOreValues, oreNames]);

    return (
        <HotkeyHandler>
            <BackgroundManager background={background} opacity={opacity}>
                <PinlistToggle onClick={() => setPinlistOpen(!pinlistOpen)} />
                <CustomPinList
                    isOpen={pinlistOpen}
                    onClose={() => setPinlistOpen(false)}
                />
                <NavBar/>
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

                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/valuechart" element={<ValueChart />} />
                    <Route path="/findtracker" element={<RareFindsTracker />} />
                    <Route path="/tradetool" element={<TradeTool />} />
                    <Route path="/misc" element={<MiscPage />} />
                    <Route path="/customvalues" element={<CustomValuesEditor />} />
                    <Route
                        path="/wheelspage"
                        element={
                            <WheelProvider>
                                <OreAndLayerWheel />
                            </WheelProvider>
                        }
                    />
                    <Route path="/credits" element={<CreditsPage />} />
                </Routes>
            </BackgroundManager>
        </HotkeyHandler>
    );
}

export default App;
