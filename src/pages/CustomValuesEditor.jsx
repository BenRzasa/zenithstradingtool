import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MiscContext } from "../context/MiscContext";
import NavBar from "../components/NavBar";

import { OreIcons } from "../data/OreIcons";

import "../styles/AllGradients.css";
import "../styles/LayerTable.css";

function CustomValuesEditor() {
    const navigate = useNavigate();
    const { 
        oreValsDict, 
        setOreValsDict, 
        valueMode, 
        setValueMode, 
        resetCustomValues,
        getOreClassName
    } = useContext(MiscContext);

    const formatter = new Intl.NumberFormat('en-US', {
        style:'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
        useGrouping: false
    });

    // Initialize localValues with proper fallbacks
    const [localValues, setLocalValues] = useState(() => {
        const initialValues = {};
        Object.values(oreValsDict).forEach((layer) => {
            const layerName = layer.layerName;
            const layerData = layer.layerOres;
            layerData?.forEach((ore) => {
                const key = `${layerName}-${ore.name}`;
                const value = ore.defaultVal;
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
                newValues[key] = item.defaultVal;
            });
        });
        setLocalValues(newValues);
    }, [oreValsDict]);

    // Change the custom value in the dictionary
    const handleValueChange = (layer, oreName, newValue) => {
        const num = parseFloat(newValue);
        let formattedValue = newValue;

        if (!isNaN(num)) {
            formattedValue = formatter.format(num);
        }

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
                                defaultVal: formattedValue.replace(",", ""),
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



    return (
        <>
            <div className="page-wrapper" id="custom-values">
                <div className="box">
                    <h1>Custom Values Editor</h1>
                    <h2>Usage Instructions:</h2>
                    <p>
                        ⛏ Here, you can <span className="accent">customize values</span> to your heart's content.
                    </p>
                    <p>
                        ⛏ First, find the ore you want, then <span className="accent">change the "/AV"</span> (ore per AV) number.
                    </p>
                    <p>
                        ⛏ Something like "0.001" in the value spot means that the ore is <span className="accent">worth 1000 Ambrosine.</span> This can be determined by "1 / 0.001".
                    </p>
                    <p>
                        ⛏ When you're done customizing values, <span className="accent">click "Save Changes" to set</span> the values and navigate back to the value chart page.
                    </p>
                    <p>
                        ⛏ If you make a mistake, or want to start over, <span className="accent">click one of the reset buttons (depending on values you want)</span>, then click "yes" to confirm.
                    </p>
                </div>
                <div className="button-container-full-row">
                        <button
                            onClick={() => handleReset("zenith")}
                            className="color-template-torn-fabric"
                        >
                            Reset: Zenith's
                        </button>
                        <button
                            onClick={() => handleReset("random")}
                            className="color-template-verglazium-custom"
                            style={{ 
                                color: "white", 
                                textShadow: "1px 2px 2px black"
                            }}
                        >
                            Reset: Random's
                            <span className="v-last-updated">(Similar to NAN's)</span>
                        </button>
                        <button
                            onClick={() => handleReset("custom")}
                            className="color-template-obliviril"
                        >
                            Reset: Default
                        </button>
                        <button onClick={handleSave} className="apply-button">
                            Save Changes
                        </button>
                        <button onClick={handleCancel} className="reset-button">
                            Cancel
                        </button>
                </div>
                {/* Value tables container - formatted similarly to the main Value Chart page */}
                <div className="tables-container" id="custom">
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
                                    style={{ width: "400px" }}
                                >
                                    <div className="wrapper-gradient"
                                        style={{ background: gradientStyle }}
                                    >
                                        <h2 className="table-header"
                                            data-text={layerName.substring(0, layerName.indexOf("\n"))}
                                        >
                                            {layerName.substring(0, layerName.indexOf("\n"))}
                                        </h2>
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Ore Name</th>
                                                <th>Value (/AV)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {layerData.map((ore, index) => (
                                                <tr key={index}>
                                                    <td
                                                        className={`name-column ${getOreClassName(ore.name)}`}
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
                                                                    ? (localValues[`${layerName}-${ore.name}`])
                                                                    : (ore.defaultVal)
                                                            }
                                                            onChange={(e) => {
                                                                setLocalValues((prev) => ({
                                                                    ...prev,
                                                                    [`${layerName}-${ore.name}`]: e.target.value,
                                                                }));
                                                            }}
                                                            onBlur={(e) => {
                                                                const rawValue = e.target.value;
                                                                const num = parseFloat(rawValue);

                                                                if (isNaN(num) || num <= 0 || num > 10000) {
                                                                    window.alert(
                                                                        "Please enter a value between 0 and 10000. Defaulting to '1'..."
                                                                    );
                                                                    e.target.value = 1;
                                                                } else {
                                                                    // Format the value for display
                                                                    e.target.value = formatter.format(num);
                                                                }

                                                                handleValueChange(layerName, ore.name, e.target.value);
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
                                                            className="quantity-input"
                                                            style={{ 
                                                                justifySelf: "center",
                                                                alignSelf: "center",
                                                                textAlign: "center",
                                                                width: "80%",
                                                                height: "100%",
                                                            }}
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
