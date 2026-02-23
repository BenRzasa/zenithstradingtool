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

import React, { useContext, useState, useMemo } from "react";
import { MiscContext } from "../context/MiscContext";

import NavBar from "../components/NavBar";
import RareRow from "../components/RareRow";
import CustomMultiplierInput from "../components/CustomMultiplierInput";

import "../styles/RareFindsTracker.css";

import patik from "../images/misc/patik.png";

const RareFindsTracker = () => {
    const {
        rareFindsData,
        setRareFindsData,
        currentMode,
        customMultiplier,
        getValueForMode,
        useObtainRateVals,
        oreValsDict,
        getOreClassName
    } = useContext(MiscContext);

    const [lastUpdatedDates, setLastUpdatedDates] = useState(() => {
        const savedDates = localStorage.getItem("rareFindsLastUpdated");
        return savedDates ? JSON.parse(savedDates) : {};
    });

    // eslint-disable-next-line
    const modeStr = useMemo(() => {
        switch (currentMode) {
            case 1:
                return "AV"; // AV
            case 2:
                return "UV"; // UV
            case 3:
                return "NV"; // NV
            case 4:
                return "TV"; // TV
            case 5:
                return "SV"; // SV
            case 6:
                return "RV"; // RV
            case 7:
                return "CV"; // Custom
            default:
                return "AV"; // Default to AV
        }
    });

    const calculateNumV = (value, count) => {
        let numV = 0.0;
        switch (currentMode) {
            case 1:
                numV = value * 1;
                break; // AV
            case 2:
                numV = value * 10;
                break; // UV
            case 3:
                numV = value * 100;
                break; // NV
            case 4:
                numV = value * 500;
                break; // TV
            case 5:
                numV = value * 1000;
                break; // SV
            case 6:
                numV = value * 50;
                break; // RV
            case 7:
                numV = value * customMultiplier;
                break; // Custom
            default:
                numV = value;
        }
        return (count / numV).toFixed(2);
    };

    // Define super rare ores
    const superRareOres = [
        "Rhylazil",
        "Neutrine",
        "Ubriniale",
        "Torn Fabric",
        "Singularity",
    ];

    // Get rares data (bracket notation for string names)
    const raresData = useMemo(() => {
        const allRares = [];

        Object.values(oreValsDict).forEach((layer) => {
            if (
                layer.layerName.includes("Rares") ||
                    layer.layerName.includes("True Rares")
            ) {
                allRares.push(...layer.layerOres);
            }
        });

        return allRares;
    }, [oreValsDict]);

    const raresGradient = Object.values(oreValsDict).find(
        (layer) =>
            layer.layerName.includes("Rares") &&
                !layer.layerName.includes("True Rares")
    )?.background;

    const superRaresGradient = Object.values(oreValsDict).find((layer) =>
        layer.layerName.includes("True Rares")
    )?.background;

    const rareOres = raresData.filter((ore) => !superRareOres.includes(ore.name));
    const superRares = raresData.filter((ore) =>
        superRareOres.includes(ore.name)
    );

    const totalRareFinds = rareOres.reduce((total, ore) => {
        return total + (rareFindsData[ore.name] || 0);
    }, 0);

    const totalSuperRareFinds = superRares.reduce((total, ore) => {
        return total + (rareFindsData[ore.name] || 0);
    }, 0);


    const updateLastUpdated = (oreName) => {
        const newDates = {
            ...lastUpdatedDates,
            [oreName]: new Date().toISOString(),
        };
        setLastUpdatedDates(newDates);
        localStorage.setItem("rareFindsLastUpdated", JSON.stringify(newDates));
    };

    const handleCountChange = (oreName, newValue) => {
        let numericValue =
            newValue === ""
                ? ""
                : Math.max(0, isNaN(newValue) ? 0 : Number(newValue));
        setRareFindsData((prev) => ({
            ...prev,
            [oreName]: numericValue,
        }));
        updateLastUpdated(oreName);
    };

    const incrementValue = (oreName) => {
        const currentValue = rareFindsData[oreName] || 0;
        handleCountChange(oreName, currentValue + 1);
        updateLastUpdated(oreName);
    };

    const decrementValue = (oreName) => {
        const currentValue = rareFindsData[oreName] || 0;
        handleCountChange(oreName, Math.max(0, currentValue - 1));
        updateLastUpdated(oreName);
    };

    const resetRareFinds = (resetType = "all") => {
        const messages = {
            all: `WARNING: This will permanently delete ALL your rare finds data.\nThis cannot be undone!\nAre you sure you want to reset?`,
            rares: `WARNING: This will permanently delete your REGULAR RARES data only.\nThis cannot be undone!\nAre you sure you want to reset?`,
            superRares: `WARNING: This will permanently delete your SUPER RARES data only.\nThis cannot be undone!\nAre you sure you want to reset?`,
        };

        if (!window.confirm(messages[resetType])) return;

        if (resetType === "all") {
            setRareFindsData({});
            setLastUpdatedDates({});
            localStorage.removeItem("rareFindsData");
            localStorage.removeItem("rareFindsLastUpdated");
            return;
        }

        const oresToDelete = resetType === "rares" ? rareOres : superRares;
        setRareFindsData((prev) => {
            const newData = { ...prev };
            oresToDelete.forEach((ore) => delete newData[ore.name]);
            setTimeout(() => {
                localStorage.setItem("rareFindsData", JSON.stringify(newData));
            }, 0);
            return newData;
        });

        setLastUpdatedDates((prev) => {
            const newDates = { ...prev };
            oresToDelete.forEach((ore) => delete newDates[ore.name]);
            setTimeout(() => {
                localStorage.setItem("rareFindsLastUpdated", JSON.stringify(newDates));
            }, 0);
            return newDates;
        });
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "Never found";

        const newDate = new Date(dateString);
        const currentDate = new Date();

        newDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
        const daysPassed = Math.round(
            Math.abs(newDate.getTime() - currentDate.getTime()) / MILLISECONDS_IN_DAY
        );

        let daysString = "";
        if (daysPassed === 0) {
            daysString = "(today)";
        } else if (daysPassed === 1) {
            daysString = "(yesterday)";
        } else {
            daysString = `(${daysPassed} days ago)`;
        }

        return (
            newDate.toLocaleDateString() +
                " " +
                new Date(dateString).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }) +
                " " +
                `${daysString}`
        );
    };

    return (
        <>
            <div className="patic">
                <img
                    src={patik}
                    alt="patik"
                    style={{ position: "absolute", opacity: "0.025" }}
                />
            </div>
            <div className="page-wrapper">
                <h1>Rare Finds Tracker</h1>
                <div className="button-container">
                    <button
                        className="reset-button"
                        onClick={() => resetRareFinds("rares")}
                    >
                        Reset Rares
                    </button>
                    <button
                        className="reset-button"
                        onClick={() => resetRareFinds("superRares")}
                    >
                        Reset Super Rares
                    </button>
                    <button 
                        className="reset-button"
                        onClick={() => resetRareFinds("all")}>
                        Reset All Finds
                    </button>
                </div>

                <div className="row-container" id="rares">
                    <div className="box" id="super-rare">
                        <h2>Total Super Rare Finds</h2>
                        <h3>{totalSuperRareFinds}</h3>
                    </div>
                    <div className="box">
                        <h2>Total Rare Finds</h2>
                        <h3>{totalRareFinds}</h3>
                    </div>
                </div>

                <div className="tables-container">
                    <div
                        className="table-wrapper"
                        style={{ width: "800px" }}
                    >
                        <div className="gradient-wrapper"
                            style={{ background: superRaresGradient }}
                        >
                            <h2
                                className="table-wrapper h2"
                                data-text="Super Rares"
                            >
                                Super Rares
                            </h2>
                        </div>
                        <table className="rare-table">
                            <thead>
                                <tr>
                                    <th>Ore Name</th>
                                    <th>Amount Found</th>
                                    <th># {modeStr}</th>
                                    <th>Date/Time Last Found</th>
                                </tr>
                            </thead>
                            <tbody>
                                {superRares.map((ore, index) => (
                                    <RareRow
                                        key={index}
                                        ore={ore}
                                        count={rareFindsData[ore.name] || 0}
                                        lastUpdated={lastUpdatedDates[ore.name]}
                                        incrementValue={incrementValue}
                                        decrementValue={decrementValue}
                                        handleCountChange={handleCountChange}
                                        getOreClassName={getOreClassName}
                                        calculateNumV={calculateNumV}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Regular rares table */}
                    <div className="table-wrapper" style={{ width: "800px" }}>
                        <div className="gradient-wrapper"
                            style={{ background: raresGradient }}
                        >
                            <h2
                                className="table-wrapper h2"
                                data-text="Regular Rares"
                            >
                                Regular Rares
                            </h2>
                        </div>
                        <table className="rare-table">
                            <thead>
                                <tr>
                                    <th>Ore Name</th>
                                    <th>Amount Found</th>
                                    <th># {modeStr}</th>
                                    <th>Time/Date Last Found</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rareOres.map((ore, index) => (
                                    <RareRow
                                        key={index}
                                        ore={ore}
                                        count={rareFindsData[ore.name] || 0}
                                        lastUpdated={lastUpdatedDates[ore.name]}
                                        incrementValue={incrementValue}
                                        decrementValue={decrementValue}
                                        handleCountChange={handleCountChange}
                                        getOreClassName={getOreClassName}
                                        calculateNumV={calculateNumV}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RareFindsTracker;
