import React, { useState, useContext, useMemo, useCallback, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import { MiscContext } from "../context/MiscContext";
import { IconContext } from "../App";
import { useWheel } from "../context/WheelContext";
import NavBar from "../components/NavBar";
import missingIcon from "../images/misc/Missing_Texture.png";
import "../styles/LayerTable.css";
import { MiscValueFunctions } from "../components/MiscValueFunctions";

const OreAndLayerWheel = () => {
    const {
        oreValsDict,
        getCurrentCSV,
        currentMode,
        customMultiplier,
        getValueForMode,
        valueMode,
        capCompletion,
        useSeparateRareMode,
        rareValueMode,
        rareCustomMultiplier,
    } = useContext(MiscContext);

    const { getImageSource } = useContext(IconContext);

    const { settings, updateSetting } = useWheel();

    const csvData = getCurrentCSV();
    const allValues = MiscValueFunctions({
        csvData: getCurrentCSV(),
        currentMode,
        customMultiplier,
        valueMode,
        getValueForMode,
        oreValsDict,
        capCompletion,
        useSeparateRareMode,
        rareValueMode,
        rareCustomMultiplier,
    });

    const {
        avgCompletion,
        incompleteOres,
        getCurrentModeStr,
        layerTotal
    } = allValues;

    // Wheel state
    const [selectedOre, setSelectedOre] = useState(null);
    const [selectedLayer, setSelectedLayer] = useState(null);
    const [mustSpinOre, setMustSpinOre] = useState(false);
    const [mustSpinLayer, setMustSpinLayer] = useState(false);
    const [orePrizeNumber, setOrePrizeNumber] = useState(0);
    const [layerPrizeNumber, setLayerPrizeNumber] = useState(0);

    const layerColors = [];

    useEffect(() => {
        // Reset selected ore and layer when rare mode settings change
        // This ensures the display updates with the new calculations
        setSelectedOre(null);
        setSelectedLayer(null);
    }, [useSeparateRareMode, rareValueMode, rareCustomMultiplier]);

    const isRareOre = useCallback(
        (ore) => {
            const raresLayer = Object.values(oreValsDict).find((layer) =>
                layer.layerName.includes("Rares\nMore")
            );
            const trueRaresLayer = Object.values(oreValsDict).find((layer) =>
                layer.layerName.includes("True Rares")
            );

            return (
                raresLayer?.layerOres.some((rareOre) => rareOre.name === ore.name) ||
                    trueRaresLayer?.layerOres.some((rareOre) => rareOre.name === ore.name)
            );
        },
        [oreValsDict]
    );

    const isRareLayer = useCallback((layerName) => {
        return (
            layerName.includes("Rares\nMore") || layerName.includes("True Rares")
        );
    }, []);
    const getMatchingLayerName = useCallback(
        (layerName) => {
            // Find layer by name in the new structure
            const matchingLayer = Object.values(oreValsDict).find((layer) =>
                layer.layerName.toLowerCase().includes(layerName.toLowerCase())
            );

            if (matchingLayer) {
                // Trim at the first newline if it exists
                const trimmedName = matchingLayer.layerName.split("\n")[0];
                return trimmedName;
            }

            return layerName;
        },
        [oreValsDict]
    );

    const getOreCompletion = useCallback(
        (ore) => {
            const foundOre = allValues.incompleteOres.find(({name}) => 
                name?.toLowerCase() === ore.name?.toLowerCase()
            );

            if(!foundOre) return 100.00;
            else if(foundOre) return foundOre.completion;
        },
        [allValues.incompleteOres]
    );

    const getOreRemaining = useCallback(
        (ore) => {
            const foundOre = allValues.incompleteOres.find(({name}) => 
                name?.toLowerCase() === ore.name?.toLowerCase()
            );

            if(!foundOre) return 0;
            else if(foundOre) return foundOre.remaining;
        },
        [allValues.incompleteOres]
    );

    const getOreTotal = useCallback(
        (ore) => {
            const foundOre = allValues.incompleteOres.find(({name}) => 
                name?.toLowerCase() === ore.name?.toLowerCase()
            );

            if(!foundOre) return 0;
            else if(foundOre) return foundOre.required;
        },
        [allValues.incompleteOres]
    );

    const calculateOreValue = useCallback(
        (ore) => {
            const inventory = csvData[ore.name] || 0;
            const oreValue =
                useSeparateRareMode && isRareOre(ore)
                    ? allValues.calculateDisplayValue(ore)
                    : allValues.calculateValue(ore);
            return oreValue > 0 ? inventory / oreValue : 0;
        },
        [csvData, allValues, useSeparateRareMode, isRareOre]
    );

    const calculateLayerCompletion = useCallback(
        (layerName) => {
            // Find the layer by name in the new structure
            const layer = Object.values(oreValsDict).find(
                (layer) => layer.layerName === layerName
            );

            if (!layer) return 0;

            let totalCompletion = 0;
            let countedOres = 0;

            layer.layerOres.forEach((ore) => {
                const value = allValues.calculateValue(ore);
                if (value > 0) {
                    const completion = getOreCompletion(ore);
                    totalCompletion += completion;
                    countedOres++;
                }
            });
            const avgCompletion = totalCompletion / countedOres;
            return countedOres > 0 ? avgCompletion : 0;
        },
        [oreValsDict, allValues, getOreCompletion]
    );

    const calculateLayerValue = useCallback(
        (layerName) => {
            // Find the layer by name in the new structure
            const layer = Object.values(oreValsDict).find(
                (layer) => layer.layerName === layerName
            );

            if (!layer) return 0;

            let totalValue = 0;

            layer.layerOres.forEach((ore) => {
                const value = calculateOreValue(ore);
                if (!isNaN(value)) {
                    totalValue += value;
                }
            });

            return parseFloat(totalValue.toFixed(2));
        },
        [oreValsDict, calculateOreValue]
    );

    const getFilteredOres = useCallback(() => {
        // Get all ores from the new structure
        let ores = Object.values(oreValsDict)
        .flatMap((layer) => layer.layerOres)
        .filter((ore) => {
            // Exclude ores that belong to the Essences layer
            return !Object.values(oreValsDict).some(
                (layer) =>
                    layer.layerName.includes("Essences") &&
                        layer.layerOres.some((lo) => lo.name === ore.name)
            );
        });

        if (!settings.includeRareOres) {
            // Find rares and true rares layers by name
            const rareLayers = Object.values(oreValsDict).filter(
                (layer) =>
                    layer.layerName.includes("Rares") ||
                        layer.layerName.includes("True Rares")
            );

            const rareOres = rareLayers.flatMap((layer) =>
                layer.layerOres.map((ore) => ore.name)
            );

            ores = ores.filter((ore) => !rareOres.includes(ore.name));
        }

        if (settings.useCustomList) {
            const customOresArray = settings.customOreList
            .split(",")
            .map((ore) => ore.trim())
            .filter((ore) => ore !== "");

            if (customOresArray.length > 0) {
                ores = ores.filter((ore) => customOresArray.includes(ore.name.toLowerCase()));
            }
        }

        if (!settings.includeOver100Completion) {
            ores = ores.filter((ore) => {
                const completion = getOreCompletion(ore);
                return completion < 100;
            });
        }

        return ores;
    }, [
            oreValsDict,
            settings.includeRareOres,
            settings.useCustomList,
            settings.customOreList,
            settings.includeOver100Completion,
            getOreCompletion,
        ]);

    const getFilteredLayers = useCallback(() => {
        // Get layer names from the new structure
        let layers = Object.values(oreValsDict)
        .map((layer) => layer.layerName)
        .filter((layerName) => !layerName.includes("Essences"));

        // Filter out rares and true rares if needed
        if (!settings.includeRaresAndTrueRares) {
            layers = layers.filter(
                (layerName) =>
                    !layerName.includes("Rares") && !layerName.includes("True Rares")
            );
        }

        // Filter out layers with 100%+ completion if needed
        if (!settings.includeOver100LayerCompletion) {
            layers = layers.filter((layerName) => {
                const completion = calculateLayerCompletion(layerName);
                return completion < 100;
            });
        }

        return layers;
    }, [
            oreValsDict,
            settings.includeRaresAndTrueRares,
            settings.includeOver100LayerCompletion,
            calculateLayerCompletion,
        ]);

    const allOres = useMemo(getFilteredOres, [
        oreValsDict,
        settings.includeRareOres,
        settings.useCustomList,
        settings.customOreList,
        settings.includeOver100Completion,
        getOreCompletion,
        getFilteredOres,
    ]);

    const allLayers = useMemo(getFilteredLayers, [
        getFilteredOres,
        settings.includeRaresAndTrueRares,
        settings.includeOver100LayerCompletion,
        calculateLayerCompletion,
        getFilteredLayers,
        useSeparateRareMode,
        rareValueMode,
        rareCustomMultiplier,
    ]);

    const getOreColor = useCallback((oreName) => {
        const tempEl = document.createElement("div");
        const className = `color-template-${oreName
.toLowerCase()
.replace(/ /g, "-")}`;
        tempEl.className = className;
        document.body.appendChild(tempEl);

        const wheelColor = getComputedStyle(tempEl)
        .getPropertyValue("--wheel-color")
        .trim();
        if (wheelColor && wheelColor !== "") {
            document.body.removeChild(tempEl);
            return wheelColor;
        }

        const bgColor = getComputedStyle(tempEl).backgroundColor;
        document.body.removeChild(tempEl);

        if (
            !bgColor ||
                bgColor === "rgba(0, 0, 0, 0)" ||
                bgColor === "transparent"
        ) {
            return "#cccccc";
        }
        return bgColor;
    }, []);

    const getLayerColor = useCallback(
        (layerName) => {
            const layer = Object.values(oreValsDict).find(
                (l) => l.layerName === layerName
            );
            const background = layer?.background || "#333333";

            // If it's a gradient, extract the first color
            if (background.includes("linear-gradient")) {
                // Match the first color in the gradient (hex or rgb)
                const colorMatch = background.match(/#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)/);
                return colorMatch ? colorMatch[0] : "#333333";
            }

            // If it's already a solid color, return it as-is
            return background;
        },
        [oreValsDict]
    );

    const getTextColorForBackground = useCallback((bgColor) => {
        if (bgColor.startsWith("var(") || bgColor.includes("gradient")) {
            return "#ffffff";
        }
        let r, g, b;

        // Handle hex colors
        if (bgColor.startsWith("#")) {
            const hex = bgColor.substring(1);
            if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16);
                g = parseInt(hex[1] + hex[1], 16);
                b = parseInt(hex[2] + hex[2], 16);
            } else if (hex.length === 6) {
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
            } else {
                return "#ffffff";
            }
        } else if (bgColor.startsWith("rgb")) {
            const match = bgColor.match(/(\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
                r = parseInt(match[1]);
                g = parseInt(match[2]);
                b = parseInt(match[3]);
            } else {
                return "#ffffff";
            }
        } else {
            return "#ffffff";
        }

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? "#000000" : "#ffffff";
    }, []);

    const oreWheelData = useMemo(() => {
        if (!allOres || allOres.length === 0) {
            return [
                {
                    option: "No ores",
                    style: { backgroundColor: "#cccccc", textColor: "#000000" },
                },
            ];
        }
        return allOres.map((ore) => {
            const bgColor = getOreColor(ore.name);
            return {
                option: ore.name,
                style: {
                    backgroundColor: bgColor,
                    textColor: getTextColorForBackground(bgColor),
                },
            };
        });
    }, [
            allOres,
            getOreColor,
            getTextColorForBackground,
        ]);

    const layerWheelData = useMemo(() => {
        if (!allLayers || allLayers.length === 0) {
            return [
                {
                    option: "No layers available",
                    style: { backgroundColor: "#cccccc", textColor: "#000000" },
                },
            ];
        }
        return allLayers.map((layerName) => {
            const bgColor = getLayerColor(layerName);
            return {
                option: getMatchingLayerName(layerName),
                style: {
                    backgroundColor: bgColor,
                    textColor: getTextColorForBackground(bgColor),
                },
            };
        });
    }, [
            allLayers,
            getMatchingLayerName,
            getLayerColor,
            getTextColorForBackground,
        ]);

    const spinOreWheel = () => {
        if (!oreWheelData || oreWheelData.length === 0) {
            return;
        }

        const newPrizeNumber = Math.floor(Math.random() * oreWheelData.length);
        setOrePrizeNumber(newPrizeNumber);
        setMustSpinOre(true);
        setSelectedOre(null);
    };

    const spinLayerWheel = () => {
        if (!layerWheelData || layerWheelData.length === 0) {
            return;
        }

        const newPrizeNumber = Math.floor(Math.random() * layerWheelData.length);
        setLayerPrizeNumber(newPrizeNumber);
        setMustSpinLayer(true);
        setSelectedLayer(null);
    };

    const getOreClassName = (oreName) => {
        return `color-template-${oreName.toLowerCase().replace(/ /g, "-")}`;
    };

    const getModeString = useCallback(
        (oreOrLayer = null) => {
            // Determine if this is for a rare ore/layer
            let isRare = false;

            if (oreOrLayer) {
                if (typeof oreOrLayer === "string") {
                    // It's a layer name
                    isRare = isRareLayer(oreOrLayer);
                } else {
                    // It's an ore object
                    isRare = isRareOre(oreOrLayer);
                }
            }

            const useRareMode = useSeparateRareMode && isRare;
            const effectiveMode = useRareMode ? rareValueMode : currentMode;
            const effectiveMultiplier = useRareMode
                ? rareCustomMultiplier
                : customMultiplier;

            const isNV = effectiveMultiplier % 100 === 0;
            const isSV = effectiveMultiplier % 1000 === 0;

            switch (effectiveMode) {
                case 1:
                    return "AV";
                case 2:
                    return "UV";
                case 3:
                    return "NV";
                case 4:
                    return "TV";
                case 5:
                    return "SV";
                case 6:
                    return "RV";
                case 7:
                    if (isNV) return `${effectiveMultiplier / 100}NV`;
                    if (isSV) return `${effectiveMultiplier / 1000}SV`;
                    return "CV";
                default:
                    return "NV";
            }
        },
        [
            currentMode,
            customMultiplier,
            rareValueMode,
            rareCustomMultiplier,
            useSeparateRareMode,
            isRareLayer,
            isRareOre,
        ]
    );

    const handleOreSpinStop = () => {
        setMustSpinOre(false);
        setSelectedOre(allOres[orePrizeNumber]);
    };

    const handleLayerSpinStop = () => {
        setMustSpinLayer(false);
        setSelectedLayer(allLayers[layerPrizeNumber]);
    };

    const calculateFontSize = (numOres) => {
        const MAX_FONT_SIZE = 15;
        const MIN_FONT_SIZE = 5;
        const SCALING_FACTOR = 1.1;
        let scaledSize = 0;
        if (numOres > 50) {
            scaledSize = MAX_FONT_SIZE - Math.log(numOres) * 2;
        } else {
            scaledSize = MAX_FONT_SIZE - Math.log(numOres) * SCALING_FACTOR;
        }

        return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, scaledSize));
    };

    const calculateTextDistance = (numOres) => {
        if (numOres > 50) {
            return 85;
        }
        return Math.max(30, 78 - numOres * 0.3);
    };

    const handleCustomListBlur = (e) => {
        const value = e.target.value.trim();

        if (
            settings.useCustomList &&
                (!value || value.split(",").every((item) => !item.trim()))
        ) {
            updateSetting("useCustomList", false); // Disable custom list if invalid
        }
    };

    return (
        <div className="page-wrapper" 
            style={{
                transform: "scale(1.1)", 
                transformOrigin: "center", 
                width: "95%", 
                height: "95%",
                paddingTop: "8em"
            }}>
            <div className="row-container">
                <Wheel
                    mustStartSpinning={mustSpinOre}
                    prizeNumber={orePrizeNumber}
                    data={oreWheelData}
                    onStopSpinning={handleOreSpinStop}
                    textColors={["#ffffff"]}
                    fontSize={calculateFontSize(allOres.length)}
                    textDistance={calculateTextDistance(allOres.length)}
                    innerRadius={25}
                    outerBorderWidth={5}
                    innerBorderWidth={5}
                    radiusLineWidth={1}
                    spinDuration={0.5}
                    perpendicularText={false}
                />

                <div className="box">
                    {/* Ore Wheel Section */}
                    <h1>Ore Wheel</h1>
                    <button
                        onClick={spinOreWheel}
                        disabled={mustSpinOre || allOres.length === 0}
                        className={mustSpinOre ? "color-template-singularity" : ""}
                    >
                        {mustSpinOre ? "..." : "SPIN"}
                    </button>
                    <div 
                        className="col-container" 
                        style={{
                            justifyContent: "left",
                            gap: "0.25em",
                            marginTop: "1em"
                        }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={settings.useCustomList}
                            onChange={(e) =>
                                updateSetting("useCustomList", e.target.checked)
                            }
                        />
                        Use Custom Ore List
                    </label>
                    {settings.useCustomList && (
                        <textarea
                            value={settings.customOreList}
                            onChange={(e) => updateSetting("customOreList", e.target.value)}
                            onBlur={handleCustomListBlur}
                            placeholder="Enter ores separated by commas"
                            style={{
                                width: "350px",
                                height: "100px",
                                padding: "5px",
                                marginRight: "15px",
                                textAlign: "left",
                                resize: "none",
                                overflow: "auto",
                                direction: "rtl",
                                unicodeBidi: "plaintext",
                                boxSizing: "border-box",
                            }}
                        />
                    )}

                    <label>
                        <input
                            type="checkbox"
                            checked={settings.includeOver100Completion}
                            onChange={(e) =>
                                updateSetting("includeOver100Completion", e.target.checked)
                            }
                        />
                        Include Over 100% Completion
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={settings.includeRareOres}
                            onChange={(e) =>
                                updateSetting(
                                    "includeRareOres",
                                    e.target.checked
                                )
                            }
                        />
                        Include Rares & True Rares
                        {!settings.includeOver100Completion && (
                            <>
                                <br></br>
                                <br></br>Ores Remaining for {getModeString()} 
                                <br></br>{(useSeparateRareMode && settings.includeRareOres) ? " + Custom Rare" : ""} Completion:{" "}
                                <span className="accent">{allOres.length}</span>
                            </>
                        )}
                        {settings.includeOver100Completion && (
                            <>
                                <br></br>
                                <br></br>Ores in Wheel: <span className="accent">{allOres.length}</span>
                            </>
                        )}
                    </label>
                    </div>
                </div>
                    {selectedOre && (
                        <div className="popup-overlay" onClick={() => setSelectedOre(null)}>
                            <div className="box" id="wheel">
                                <button
                                    className="close-button"
                                    onClick={() => setSelectedOre(null)}
                                >✖</button>
                                <h3>Selected Ore:</h3>
                                <div
                                    className={`box ${getOreClassName(selectedOre.name)}`}
                                    data-text={selectedOre.name}
                                    style={{
                                        fontSize: "18px",
                                        WebkitTextStroke: "5px black",
                                        textStroke: "5px black",
                                        paintOrder: "stroke fill",
                                        width: "fit-content",
                                        textAlign: "left",
                                        paddingLeft: "1em",
                                        justifyContent: "space-evenly"
                                    }}
                                >
                                <div className="row-container">
                                    <img
                                    src={getImageSource(selectedOre.name)}
                                        loading="lazy"
                                        alt={`${selectedOre.name} icon`}
                                        onError={(e) => {
                                            console.warn(`Missing icon for: ${selectedOre.name}`);
                                            e.target.src = missingIcon;
                                        }}
                                        className="ore-icon"
                                        id="wheel"
                                    />
                                    <span style={{marginTop: "7px"}}>{selectedOre.name}</span>
                                </div>
                            </div>
                            <div className="box" id="selected">
                                <p>
                                    {getModeString(selectedOre)} Completion:{" "}
                                    <span className="accent">{getOreCompletion(selectedOre).toFixed(3)}%</span>
                                </p>
                                <p>
                                    Total {getModeString(selectedOre)}s:{" "}
                                    <span className="accent">{calculateOreValue(selectedOre).toFixed(3)}</span>
                                </p>
                                <p>
                                    Amount in Inventory:{" "}
                                    <span className="accent">{(csvData[selectedOre.name] || 0).toLocaleString()}</span>
                                </p>
                                <p>
                                    Amount Remaining:{" "}
                                    <span className="accent">{getOreRemaining(selectedOre).toLocaleString()}</span>
                                </p>
                                <p>
                                    Total for {getModeString(selectedOre)}:{" "}
                                    <span className="accent">{getOreTotal(selectedOre).toLocaleString()}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    )}
            </div>
            <div className="row-container">
                {/* Layer wheel section */}
                <Wheel
                    mustStartSpinning={mustSpinLayer}
                    prizeNumber={layerPrizeNumber}
                    data={layerWheelData}
                    backgroundColors={layerColors}
                    textColors={["#ffffff"]}
                    fontSize={13}
                    textDistance={60}
                    innerRadius={25}
                    outerBorderWidth={5}
                    innerBorderWidth={5}
                    radiusLineWidth={1}
                    spinDuration={0.5}
                    perpendicularText={false}
                    onStopSpinning={handleLayerSpinStop}
                />
                <div className="box">
                    <h1>Layer Wheel</h1>
                    <button
                        onClick={spinLayerWheel}
                        disabled={mustSpinLayer || allLayers.length === 0}
                        className={mustSpinLayer ? "color-template-singularity" : ""}
                    >
                        {mustSpinLayer ? "..." : "SPIN"}
                    </button>
                    <div className="col-container"
                        style={{
                            justifyContent: "left",
                            gap: "0.25em",
                            marginTop: "1em"
                        }}>
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.includeOver100LayerCompletion}
                                onChange={(e) =>
                                    updateSetting(
                                        "includeOver100LayerCompletion",
                                        e.target.checked
                                    )
                                }
                            />
                            Include Over 100% Completion
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.includeRaresAndTrueRares}
                                onChange={(e) =>
                                    updateSetting("includeRaresAndTrueRares", e.target.checked)
                                }
                            />
                            Include Rares & True Rares
                            {!settings.includeOver100LayerCompletion && (
                                <>
                                    <br></br>
                                    <br></br>Layers Remaining for {getModeString()}
                                    <br></br>{(useSeparateRareMode && settings.includeRaresAndTrueRares) ? " + Custom Rare" : ""} Completion:{" "}
                                    <span className="accent">{allLayers.length}</span>
                                </>
                            )}
                            {settings.includeOver100LayerCompletion && (
                                <>
                                    <br></br>
                                    <br></br>Layers in Wheel: <span className="accent">{allLayers.length}</span>
                                </>
                            )}
                        </label>
                    </div>
                </div>
                    {selectedLayer && (
                        <div className="popup-overlay" onClick={() => setSelectedLayer(null)}>
                            <div className="box" id="wheel">
                                <button
                                    className="close-button"
                                    onClick={() => setSelectedLayer(null)}
                                >
                                    ✖
                                </button>
                                <h3>Selected Layer:</h3>
                                <div
                                    className="box"
                                    style={{
                                        background: getLayerColor(selectedLayer),
                                        width: "fit-content",
                                        textAlign: "center",
                                        fontSize: "20px",
                                        textStroke: "5px black",
                                        WebkitTextStroke: "5px black",
                                        paintOrder: "stroke fill"
                                    }}
                                >
                                    <span>{getMatchingLayerName(selectedLayer)}</span>
                                </div>
                                <div className="box" id="selected">
                                    <p>
                                        {getModeString(selectedLayer)} Completion:{" "}
                                        <span className="accent">{calculateLayerCompletion(selectedLayer).toFixed(3)}%</span>
                                    </p>
                                    <p>
                                        Total {getModeString(selectedLayer)}s:{" "}
                                        <span className="accent">{calculateLayerValue(selectedLayer).toFixed(3)}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};
export default OreAndLayerWheel;
