// Main app routing
import React, { useState, useEffect, useContext } from "react";
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

import CustomPinList from "./components/CustomPinList";
import PinlistToggle from "./components/PinlistToggle";

import HotkeyHandler from "./components/HotkeyHandler";
import packageJson from "../package.json";

const MIRAHEZE_URL = "https://celestialcaverns.miraheze.org/w/index.php?title=Module:OreValuesData.json&action=raw";
const SUCCESSFUL_PROXY = "https://corsproxy.io/?";

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

    useEffect(() => {
        const fetchAndStoreOreValues = async () => {
            try {
                const proxyURL = SUCCESSFUL_PROXY + encodeURIComponent(MIRAHEZE_URL);
                console.log(`Fetching ore values from: ${proxyURL}`);

                const response = await fetch(proxyURL);

                if (!response.ok) {
                    throw new Error(`HTTP ERROR: ${response.status}`);
                }

                const oresJSON = await response.json();
                console.log("Fetch successful, storing ore values: ", oresJSON);

                localStorage.setItem('oreValuesData', JSON.stringify(oresJSON));

                window.dispatchEvent(new CustomEvent('oreValuesUpdated', { 
                    detail: oresJSON 
                }));

            } catch (error) {
                console.error("Failed to fetch ore values:", error);
            }
        };

        fetchAndStoreOreValues();
    }, []);

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

    return (
        <HashRouter>
            <MiscProvider>
                <PinListProvider>
                    <TradeProvider>
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
                        />
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
}) {
    const { hotkeysEnabled } = useContext(MiscContext);

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
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [hotkeysEnabled, setSettingsOpen, setPinlistOpen]);

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
