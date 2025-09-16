import React from "react";

const PinlistToggle = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        title: "pinlist toggle",
        scale: "1.25",
        position: "fixed",
        top: "20px",
        left: "20px",
        background: "var(--background-color)",
        color: "var(--switch-outline)",
        border: "2.25px solid var(--switch-outline)",
        borderRadius: "12px",
        width: "40px",
        height: "40px",
        fontSize: "25px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "10001",
      }}
    >
      {/*
    <img
      src={settingIcon}
      alt="Settings toggle"
      loading="lazy"
    ></img>
    */}
      <i className="fas fa-thumbtack"></i>
    </button>
  );
};

export default PinlistToggle;
