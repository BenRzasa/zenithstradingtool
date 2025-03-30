import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CSVContext } from '../context/CSVContext';
import { TradeContext } from '../context/TradeContext';
import { johnValsDict } from '../components/JohnVals';
import { nanValsDict } from '../components/NANVals';
import "../styles/MiscPage.css";
import "../styles/AllGradients.css";

function MiscPage() {
    const dropdowns = [
        {
            id: "dropdown1",
            title: "First Dropdown",
            items: [
                "This is the first item in the first dropdown",
                "Second item content goes here",
                "Third item with some sample text"
            ]
        },
        {
            id: "dropdown2",
            title: "Second Dropdown",
            items: [
                "Information for the second dropdown's first item",
                "More details about this section",
                "Additional content can go here"
            ]
        },
        {
            id: "dropdown3",
            title: "Third Dropdown",
            items: [
                "Final dropdown's content starts here",
                "Example text for demonstration",
                "Last item in the dropdown list"
            ]
        }
    ];

    return (
        <div className="misc-page">
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/valuechart">Value Chart</Link></li>
                    <li><Link to="/tradetool">Trade Tool</Link></li>
                    <li><Link to="/csvloader">CSV Loader</Link></li>
                </ul>
            </nav>

            <div className="dropdowns-container">
                {dropdowns.map((dropdown) => (
                    <div key={dropdown.id} className="dropdown">
                        <input
                            hidden=""
                            className="sr-only"
                            name={dropdown.id}
                            id={dropdown.id}
                            type="checkbox"
                        />
                        <label
                            aria-label="dropdown scrollbar"
                            htmlFor={dropdown.id}
                            className="trigger"
                        >
                            {dropdown.title}
                        </label>

                        <ul className="list webkit-scrollbar" role="list" dir="auto">
                            {dropdown.items.map((item, index) => (
                                <li key={index} className="listitem" role="listitem">
                                    <article className="article">{item}</article>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MiscPage;