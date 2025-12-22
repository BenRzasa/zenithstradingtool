import React from "react";
const ValueButtons = ({ valueMode, setValueMode }) => {
    const valueButtons = [
        {
            mode: "zenith",
            className: "color-template-torn-fabric",
            label: "Zenith's Values",
        },
        {
            mode: "random",
            className: "color-template-verglazium-custom",
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
