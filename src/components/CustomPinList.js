import React, { useContext } from "react";

import { MiscContext } from "../context/MiscContext";
import { TradeContext } from "../context/TradeContext";
import { OreNames } from "../data/OreNames";

import "../styles/CustomPinList.css";

const CustomPinList = ({ isOpen, onClose }) => {
  return (
    <div className={`pinlist-container ${isOpen ? "open" : ""}`}>
      Custom Pinlist Placeholder
    </div>
  );
};

export default CustomPinList;
