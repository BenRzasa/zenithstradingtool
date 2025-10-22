import React from "react";
const ValueButtons = ({ valueMode, setValueMode }) => {
  const valueButtons = [
    {
      mode: "zenith",
      className: "color-template-torn-fabric",
      label: "Zenith's Values",
    },
    {
      mode: "nan",
      className: "color-template-diamond",
      label: "NAN's Values",
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
        <div
          className="box-button"
          style={{
            width: "8vw",
          }}
          key={mode}
        >
          <button
            onClick={() => setValueMode(mode)}
            className={valueMode === mode ? className : ""}
          >
            <span>{label}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ValueButtons;
