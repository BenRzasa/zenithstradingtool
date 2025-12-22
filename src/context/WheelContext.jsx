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
