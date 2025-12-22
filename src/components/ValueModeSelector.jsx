import React from "react";
const ValueModeSelector = ({ currentMode, setCurrentMode }) => {
    const valueModeButtons = [
        {
            mode: 1,
            className: "color-template-ambrosine",
            label: "AV Mode",
        },
        {
            mode: 2,
            className: "color-template-universallium",
            label: "UV Mode",
        },
        {
            mode: 6,
            className: "color-template-rhylazil",
            label: "RV Mode",
        },
        {
            mode: 3,
            className: "color-template-neutrine",
            label: "NV Mode",
        },
        {
            mode: 4,
            className: "color-template-torn-fabric",
            label: "TV Mode",
        },
        {
            mode: 5,
            className: "color-template-singularity",
            label: "SV Mode",
        },
        {
            mode: 7,
            className: "color-template-havicron",
            label: "Custom",
        },
    ];
    return (
        <div className="row-container" style={{gap: "0.25em"}}>
            {valueModeButtons.map(({ mode, className, label }) => (
                <button 
                    style={{width: "6em", height: "3em"}}
                    key={mode}
                    onClick={() => setCurrentMode(mode)}
                    className={currentMode === mode ? className : ""}
                >
                    <span>{label}</span>
                </button>
            ))}
        </div>
    );
};

export default ValueModeSelector;
