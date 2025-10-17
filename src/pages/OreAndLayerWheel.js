import React, { useState, useContext, useMemo, useCallback, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import { MiscContext } from "../context/MiscContext";
import { useWheel } from "../context/WheelContext";
import NavBar from "../components/NavBar";
import { OreIcons } from "../data/OreIcons";
import missingIcon from "../images/ore-icons/Missing_Texture.webp";
import "../styles/AllGradients.css";
import "../styles/OreAndLayerWheel.css";
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

  const { settings, updateSetting } = useWheel();

  const csvData = getCurrentCSV();
  const valueFunctions = MiscValueFunctions({
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

  const calculateOreCompletion = useCallback(
    (ore) => {
      const inventory = csvData[ore.name] || 0;
      const oreValue =
        useSeparateRareMode && isRareOre(ore)
          ? valueFunctions.calculateDisplayValue(ore)
          : valueFunctions.calculateValue(ore);
      const completion = oreValue > 0 ? (inventory / oreValue) * 100 : 0;
      return capCompletion ? Math.min(100, completion) : completion;
    },
    [csvData, valueFunctions, capCompletion, useSeparateRareMode, isRareOre]
  );

  const calculateOreValue = useCallback(
    (ore) => {
      const inventory = csvData[ore.name] || 0;
      const oreValue =
        useSeparateRareMode && isRareOre(ore)
          ? valueFunctions.calculateDisplayValue(ore)
          : valueFunctions.calculateValue(ore);
      return oreValue > 0 ? inventory / oreValue : 0;
    },
    [csvData, valueFunctions, useSeparateRareMode, isRareOre]
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
        const value = valueFunctions.calculateValue(ore);
        if (value > 0) {
          const completion = calculateOreCompletion(ore) / 100;
          totalCompletion += completion;
          countedOres++;
        }
      });

      return countedOres > 0 ? (totalCompletion / countedOres) * 100 : 0;
    },
    [oreValsDict, valueFunctions, calculateOreCompletion]
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

    if (!settings.includeOreRaresAndTrueRares) {
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
        const completion = calculateOreCompletion(ore);
        return completion < 100;
      });
    }

    return ores;
  }, [
    oreValsDict,
    settings.includeOreRaresAndTrueRares,
    settings.useCustomList,
    settings.customOreList,
    settings.includeOver100Completion,
    calculateOreCompletion,
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
    settings.includeOreRaresAndTrueRares,
    settings.useCustomList,
    settings.customOreList,
    settings.includeOver100Completion,
    calculateOreCompletion,
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
      if (background.includes("gradient")) {
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
    <>
      <NavBar />
      <div className="ore-spinner-container">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Ore Wheel Section */}
          <div
            className="csv-usage"
            style={{
              paddingLeft: "15px",
              display: "flex",
              fontSize: "25px",
              flexDirection: "column",
              gap: "10px",
              paddingBottom: "15px",
              margin: "0 auto",
              marginBottom: "-50px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <h1>Ore Wheel</h1>
              <button
                className="spin-button"
                onClick={spinOreWheel}
                disabled={mustSpinOre || allOres.length === 0}
              >
                {mustSpinOre ? "..." : "SPIN"}
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
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
            </div>
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

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
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
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={settings.includeOreRaresAndTrueRares}
                  onChange={(e) =>
                    updateSetting(
                      "includeOreRaresAndTrueRares",
                      e.target.checked
                    )
                  }
                />
                Include Rares & True Rares
                {!settings.includeOver100Completion && (
                  <>
                    <br></br>
                    <br></br>Ores Remaining for {getModeString()} {(useSeparateRareMode && settings.includeOreRaresAndTrueRares) ? " + Custom Rare" : ""} Completion:{" "}
                    {allOres.length}
                  </>
                )}
                {settings.includeOver100Completion && (
                  <>
                    <br></br>
                    <br></br>Ores in Wheel: {allOres.length}
                  </>
                )}
              </label>
            </div>
          </div>
          <div className="wheel-container">
            {selectedOre && (
              <div className="selected-ore">
                <button
                  className="close-button"
                  onClick={() => setSelectedOre(null)}
                >
                  ×
                </button>
                <h3>Selected Ore:</h3>
                <div
                  className={`selected-ore-display ${getOreClassName(
                    selectedOre.name
                  )}`}
                  style={{
                    color: getTextColorForBackground(
                      getOreColor(selectedOre.name)
                    ),
                  }}
                >
                  <img
                    src={
                      OreIcons[selectedOre.name.replace(/ /g, "_")] ||
                      missingIcon
                    }
                    alt={`${selectedOre.name} icon`}
                    className="ore-icon"
                  />
                  <span>{selectedOre.name}</span>
                </div>
                <div className="ore-stats">
                  <div>
                    <strong>{getModeString(selectedOre)} Completion:</strong>{" "}
                    {calculateOreCompletion(selectedOre).toFixed(3)}%
                  </div>
                  <div>
                    <strong>Total {getModeString(selectedOre)}s:</strong>{" "}
                    {calculateOreValue(selectedOre).toFixed(3)}
                  </div>
                  <div>
                    <strong># in Inventory:</strong>{" "}
                    {csvData[selectedOre.name] || 0}
                  </div>
                </div>
              </div>
            )}
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
              spinDuration={0.7}
              perpendicularText={false}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Layer wheel section */}
          <div
            className="csv-usage"
            style={{
              width: "525px",
              paddingLeft: "15px",
              display: "flex",
              fontSize: "25px",
              flexDirection: "column",
              gap: "8px",
              paddingBottom: "15px",
              margin: "0 auto",
              marginTop: "0vh",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0px" }}>
              <h1>Layer Wheel</h1>
              <button
                className="spin-button"
                onClick={spinLayerWheel}
                disabled={mustSpinLayer || allLayers.length === 0}
              >
                {mustSpinLayer ? "..." : "SPIN"}
              </button>
            </div>
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
                  <br></br>Layers Remaining for {getModeString()} {(useSeparateRareMode && settings.includeRaresAndTrueRares) ? " + Custom Rare" : ""} Completion:{" "}
                  {allLayers.length}
                </>
              )}
              {settings.includeOver100LayerCompletion && (
                <>
                  <br></br>
                  <br></br>Layers in Wheel: {allLayers.length}
                </>
              )}
            </label>
          </div>

          <div className="wheel-container">
            {selectedLayer && (
              <div className="selected-ore">
                <button
                  className="close-button"
                  onClick={() => setSelectedLayer(null)}
                >
                  ×
                </button>
                <h3>Selected Layer:</h3>
                <div
                  className="selected-ore-display"
                  style={{
                    background: getLayerColor(selectedLayer),
                    color: getTextColorForBackground(
                      getLayerColor(selectedLayer)
                    ),
                  }}
                >
                  <span>{getMatchingLayerName(selectedLayer)}</span>
                </div>
                <div className="ore-stats">
                  <div>
                    <strong>{getModeString(selectedLayer)} Completion:</strong>{" "}
                    {calculateLayerCompletion(selectedLayer).toFixed(3)}%
                  </div>
                  <div>
                    <strong>Total {getModeString(selectedLayer)}s:</strong>{" "}
                    {calculateLayerValue(selectedLayer).toFixed(3)}
                  </div>
                </div>
              </div>
            )}
            <Wheel
              mustStartSpinning={mustSpinLayer}
              prizeNumber={layerPrizeNumber}
              data={layerWheelData}
              backgroundColors={layerColors}
              textColors={["#ffffff"]}
              fontSize={14}
              textDistance={65}
              innerRadius={25}
              outerBorderWidth={5}
              innerBorderWidth={5}
              radiusLineWidth={1}
              spinDuration={0.7}
              perpendicularText={false}
              onStopSpinning={handleLayerSpinStop}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default OreAndLayerWheel;
