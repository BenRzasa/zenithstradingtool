import React, { useContext } from "react";
import { OreNames } from "../components/OreNames";
import "../styles/RareTracker.css";
import { Link } from "react-router-dom";
import { johnValsDict } from '../components/JohnVals';
import { nanValsDict } from '../components/NANVals';
import "../styles/AllGradients.css";

function RareTracker() {
    return (
        <div className="rare-finds">
            <h1>Track Your Rare Ore Finds Here!</h1>
        </div>
    );
}

export default RareTracker;

