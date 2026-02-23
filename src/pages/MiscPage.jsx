/*
 * Zenith's Trading Tool - An external website created for Celestial Caverns
 * Copyright (C) 2026 - Ben Rzasa
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
*/

import React, { useState, useContext } from "react";

import NavBar from "../components/NavBar";

import { MiscContext } from "../context/MiscContext";
import { useSearchFilters } from "../data/SearchFilters";
import { CharmIcons } from "../data/CharmIcons";

import charmPerks from "../data/CharmPerks";
import missingIcon from "../images/misc/Missing_Texture.png";

import "../styles/MiscPage.css";

function MiscPage() {
    const { oreValsDict } = useContext(MiscContext);
    const searchFilters = useSearchFilters(oreValsDict);
    const [copiedFilter, setCopiedFilter] = useState(null);

    function setColor (elementId, color) {
        document.getElementById(elementId).style.color = color;
        return color;
    };

    // Copy the search filter to the clipboard
    const copyFilter = (filterText, titlePart) => {
        navigator.clipboard
            .writeText(filterText)
            .then(() => {
                console.log("Filter copied:", filterText);
                setColor(`search-filter-${titlePart}`, "lightgreen");
                setCopiedFilter(filterText);
                setTimeout(() => {
                    setColor(`search-filter-${titlePart}`, "var(--text-color)");
                    setCopiedFilter(null);
                }, 2000);
            })
            .catch((err) => {
                console.error("Failed to copy:", err);
            });
    };

    /* Generate CSS class name for ore gradient */
    const getOreClassName = (oreName) => {
        return `color-template-${oreName.toLowerCase().replace(/ /g, "-")}`;
    };

    // Array of cards - can be expanded with new content and customized
    // with different gradients if necessary (PER CARD)
    // Each has an id, title (header) and customizable content
    const cards = [
        {
            // Search filters
            id: "card1",
            title:
            "Search Filters",
            content: (
                <div 
                    className="col-container"
                    style={{gap: "0px"}} 
                >
                    {searchFilters.map((category, index) => {
                        // Split at the first colon
                        const colonIndex = category.indexOf(":");
                        const titlePart = category.substring(0, colonIndex + 1);
                        const itemsPart = category.substring(colonIndex + 1);

                        return (
                            <p key={index} id={`search-filter-${titlePart}`}>
                                <button
                                    className="copy-filter-btn"
                                    id="misc"
                                    onClick={() =>
                                        copyFilter(category.substring(category.indexOf(":") + 2), titlePart)
                                    }
                                    title="Copy filters"
                                >
                                <i class="fas fa-clipboard"></i>
                                </button>
                                <strong>{titlePart}</strong>
                                {itemsPart}
                            </p>
                        );
                    })}
                </div>
            ),
        },
        {
            id: "card2",
            title: "Charms",
            content: (
                <table className="table-wrapper" id="misc">
                    <thead>
                        <tr>
                            <th>Charm Name</th>
                            <th>Charm Perk</th>
                        </tr>
                    </thead>
                    <tbody>
                        {charmPerks.map((charm) => (
                            <tr key={charm.name}>
                                <td
                                    className={`name-column ${getOreClassName(charm.ore)}`}
                                    data-text={charm.name}
                                    style={{ padding: "5px"}}
                                >
                                    {CharmIcons[charm.name.replace(/ /g, "_")] ? (
                                        <img
                                            src={CharmIcons[charm.name.replace(/ /g, "_")]}
                                            alt={`${charm.name} icon`}
                                            className="ore-icon"
                                            id={`${charm.name}-icon`}
                                            onError={(e) => {
                                                console.error(`Missing icon for: ${charm.name}`);
                                                e.target.style.display = "none";
                                            }}
                                        />
                                    ) : (
                                            <span>
                                                <img
                                                    src={missingIcon}
                                                    alt="Missing icon"
                                                    className="ore-icon"
                                                    loading="lazy"
                                                />
                                            </span>
                                        )}
                                    {charm.name}
                                </td>
                                <td style={{paddingLeft: "5px", borderBottom: "2px solid var(--switch-outline)"}}>{charm.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ),
        },
    ];

    return (
        <div className="page-wrapper" style={{}}>
            <h1>Miscellaneous Items</h1>
            <h2>Drop suggestions in my thread in the discord!</h2>
            <div className="row-container" style={{justifyContent: "flex-start"}}>
                {cards.map((card) => (
                    <div key={card.id} id={card.id} className="card">
                        <div id={card.id} className="card-interior">
                            <h3>{card.title}</h3>
                            {card.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MiscPage;
