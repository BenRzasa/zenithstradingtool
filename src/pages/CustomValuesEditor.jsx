import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MiscContext } from "../context/MiscContext";
import NavBar from "../components/NavBar";

import { OreIcons } from "../data/OreIcons";

import "../styles/CustomValuesEditor.css";
import "../styles/AllGradients.css";
import "../styles/LayerTable.css";

function CustomValuesEditor() {
  const navigate = useNavigate();
  const { 
    oreValsDict, 
    setOreValsDict, 
    valueMode, 
    setValueMode, 
    resetCustomValues 
  } = useContext(MiscContext);

  // Initialize localValues with proper fallbacks
  const [localValues, setLocalValues] = useState(() => {
    const initialValues = {};
    Object.values(oreValsDict).forEach((layer) => {
      const layerName = layer.layerName;
      const layerData = layer.layerOres;
      layerData?.forEach((ore) => {
        const key = `${layerName}-${ore.name}`;
        const value = ore.customVal;
        initialValues[key] = value;
      });
    });
    return initialValues;
  });

  // Effect to immediately update localValues when oreValsDict changes
  useEffect(() => {
    const newValues = {};
    Object.values(oreValsDict).forEach((layer) => {
      const layerName = layer.layerName;
      const layerData = layer.layerOres;
      layerData?.forEach((item) => {
        const key = `${layerName}-${item.name}`;
        newValues[key] = item.customVal;
      });
    });
    setLocalValues(newValues);
  }, [oreValsDict]);

  // Change the custom value in the dictionary
  const handleValueChange = (layer, oreName, newValue) => {
    setOreValsDict((prev) => {
      const newDict = { ...prev };
      const layerKey = Object.keys(newDict).find(
        (key) => newDict[key].layerName === layer
      );

      if (!layerKey) return prev;

      return {
        ...prev,
        [layerKey]: {
          ...newDict[layerKey],
          layerOres: newDict[layerKey].layerOres.map((ore) => {
            if (ore.name === oreName) {
              return {
                ...ore,
                customVal: newValue,
              };
            }
            return ore;
          }),
        },
      };
    });
  };

  // Save the new dictionary
  const handleSave = () => {
    setValueMode("custom");
    window.alert("Custom values successfully saved!");
    navigate("/valuechart");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Handle resetting of the dictionary
  const handleReset = async (source) => {
    if (window.confirm(`Reset all values to ${source.toUpperCase()} values?`)) {
      await resetCustomValues(source);
      window.scrollTo(0, 0);
    }
  };

  // Function to generate the className based on ore name
  const getOreClassName = (oreName) => {
    return `color-template-${oreName.toLowerCase().replace(/ /g, "-")}`;
  };

  return (
    <>
      <NavBar />
      <div className="custom-editor">
        <div className="custom-usage">
          <h1>Custom Values Editor</h1>
          <h2>Usage Instructions:</h2>
          <ul>
            <li>Here, you can customize values to your heart's content</li>
            <li>
              First, find the ore you want, then change the "/AV" (ore per AV)
              number
            </li>
            <li>
              Something like "0.001" means that the ore is worth 1000 Ambrosine
              This can be determined by "1 / 0.001"{" "}
            </li>
            <li>
              When you're done customizing values, click "Save Changes" to set
              the values and navigate back to the value chart page
            </li>
            <li>
              If you make a mistake, or want to start over, click one of the two
              reset buttons, then click to confirm
            </li>
          </ul>
        </div>
        <div className="editor-controls">
          {/* Reset buttons for different value sources */}
          <div className="reset-buttons">
            <button
              onClick={() => handleReset("zenith")}
              className="color-template-torn-fabric"
            >
              Reset to Zenith's Values
            </button>
            <button
              onClick={() => handleReset("random")}
              className="color-template-verglazium-custom"
              style={{ 
                color: "white", 
                textShadow: "1px 2px 2px black"
              }}
            >
              Reset to Random's Vals
              <br/>(Active, based off NAN's old vals)
            </button>
            <button
              onClick={() => handleReset("custom")}
              className="color-template-obliviril"
            >
              Reset to Default
            </button>
            <button onClick={handleSave} className="save-button">
              Save Changes
            </button>
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
        {/* Value tables container - formatted similarly to the main Value Chart page */}
        <div className="editor-tables-container">
          {Object.values(oreValsDict)
            .filter((layer) => !layer.layerName.includes("Essences"))
            .map((layer) => {
              const layerName = layer.layerName;
              const layerData = layer.layerOres;

              const gradientStyle =
                layer.background ||
                  "linear-gradient(90deg,rgb(255, 0, 0) 0%,rgb(238, 255, 0) 100%)";

              return (
                <div
                  id={layerName.replace(/\s+/g, "-")}
                  key={layerName}
                  className="table-wrapper"
                  style={{ maxWidth: "350px" }}
                >
                  <h2
                    className="table-wrapper h2"
                    style={{ background: gradientStyle }}
                    data-text={layerName.substring(0, layerName.indexOf("\n"))}
                  >
                    {layerName.substring(0, layerName.indexOf("\n"))}
                  </h2>
                  {/* Only needs the per AV column, since they're customizing the customVal */}
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ore Name</th>
                        <th style={{ textAlign: "left" }}>Value (/AV)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {layerData.map((ore, index) => (
                        <tr key={index}>
                          <td
                            className={`name-column ${getOreClassName(
ore.name
)}`}
                            data-text={ore.name}
                          >
                            {OreIcons[ore.name.replace(/ /g, "_")] ? (
                              <img
                                src={OreIcons[ore.name.replace(/ /g, "_")]}
                                alt={`${ore.name} icon`}
                                className="ore-icon"
                                loading="lazy"
                                onError={(e) => {
                                  console.error(
                                    `Missing icon for: ${ore.name}`
                                  );
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                                <span>🖼️</span>
                              )}
                            {ore.name}
                          </td>
                          <td>
                            <input
                              id={`custom-value-input-${ore.name}`}
                              type="number"
                              step="any"
                              value={
                                localValues[`${layerName}-${ore.name}`] !==
                                  undefined
                                  ? localValues[`${layerName}-${ore.name}`]
                                  : ore.customVal
                              }
                              onChange={(e) => {
                                console.log(`${ore.name} Value Change from ${localValues[`${layerName}-${ore.name}`]} to ${e.target.value}`);
                                setLocalValues((prev) => ({
                                  ...prev,
                                  [`${layerName}-${ore.name}`]: e.target.value,
                                }));
                              }}
                              onBlur={(e) => {
                                if (
                                  e.target.value <= 0 ||
                                    e.target.value > 10000
                                ) {
                                  window.alert(
                                    "Please enter a value between 1 and 10000. Defaulting to '1'..."
                                  );
                                  e.target.value = 1;
                                }
                                handleValueChange(
                                  layerName,
                                  ore.name,
                                  e.target.value
                                );
                                setLocalValues((prev) => {
                                  const newValues = { ...prev };
                                  delete newValues[`${layerName}-${ore.name}`];
                                  return newValues;
                                });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleValueChange(
                                    layerName,
                                    ore.name,
                                    e.target.value
                                  );
                                  setLocalValues((prev) => {
                                    const newValues = { ...prev };
                                    delete newValues[
                                    `${layerName}-${ore.name}`
                                  ];
                                    return newValues;
                                  });
                                }
                              }}
                              className="base-value-input"
                              style={{ textAlign: "left" }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default CustomValuesEditor;
