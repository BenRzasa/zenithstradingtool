import React from 'react';
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
  // Mapped to avoid more redundant code
  // Key is the mode, template has the mode number,
  // Class name (gradient template) & label (text)
  return (
    <div
      className="val-button-container"
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {valueModeButtons.map(({ mode, className, label }) => (
        <div className="box-button" key={mode}>
          <button
            onClick={() => setCurrentMode(mode)}
            className={currentMode === mode ? className : ""}
          >
            <span>{label}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ValueModeSelector;
