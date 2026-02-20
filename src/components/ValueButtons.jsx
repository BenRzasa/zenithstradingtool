import React from "react";
const ValueButtons = ({ valueMode, setValueMode }) => {
    const valueButtons = [
        {
            mode: "zenith",
            className: "color-template-stygian-ooze",
            label: "Zenith's Values",
        },
        {
            mode: "random",
            className: "color-template-ozirolyte",
            label: "Random's Values",
        },
        {
            mode: "custom",
            className: "color-template-havicron",
            label: "Custom Values",
        },
    ];

    return (
        <div
            className="button-container"
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
            }}
        >
            {valueButtons.map(({ mode, className, label }) => (
                <button 
                    key={mode}
                    onClick={() => setValueMode(mode)}
                    className={valueMode === mode ? className : ""}
                >
                    <span>{label}</span>
                </button>
            ))}
        </div>
    );
};

export default ValueButtons;
