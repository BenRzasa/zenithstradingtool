import React from "react";

const PinlistToggle = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            title="Pinlist"
            aria-label="Pinlist"
            style={{
                position: "fixed",
                bottom: "0",
                left: "0",
                background: "var(--background-color)",
                color: "var(--switch-outline)",
                border: "2px solid var(--switch-outline)",
                width: "2em",
                height: "2em",
                fontSize: "27px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: "10001",
            }}
        >
            <i className="fas fa-thumbtack"></i>
        </button>
    );
};

export default PinlistToggle;
