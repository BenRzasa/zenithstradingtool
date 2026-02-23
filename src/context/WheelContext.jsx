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

import React, {
    createContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from "react";

const WheelContext = createContext();

export const WheelProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem("wheelSettings");
            return saved ? JSON.parse(saved) : getDefaultSettings();
        } catch {
            return getDefaultSettings();
        }
    });

    // Save settings to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem("wheelSettings", JSON.stringify(settings));
        } catch (error) {
            console.error("Failed to save settings to localStorage:", error);
        }
    }, [settings]);

    const updateSetting = useCallback((key, value) => {
        setSettings((prev) => {
            const newSettings = {
                ...(prev || getDefaultSettings()),
                [key]: value,
            };
            return newSettings;
        });
    }, []);

    const contextValue = useMemo(
        () => ({
            settings: settings || getDefaultSettings(),
            updateSetting,
        }),
        [settings, updateSetting]
    );

    return (
        <WheelContext.Provider value={contextValue}>
            {children}
        </WheelContext.Provider>
    );
};

// Default settings state if something goes wrong
function getDefaultSettings() {
    return {
        includeOver100Completion: true,
        useCustomList: false,
        customOreList: "",
        includeRaresAndTrueRares: true,
        includeOver100LayerCompletion: true,
        includeRareOres: true,
    };
}

// Function to check the settings and make sure we're in wheel context
export const useWheel = () => {
    const context = React.useContext(WheelContext);
    if (!context) {
        console.warn("useWheel used outside provider, returning defaults");
        return {
            settings: getDefaultSettings(),
            updateSetting: () => {},
        };
    }
    return context;
};
