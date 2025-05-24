/* ZTT | Miscellaneous info page
  - Will contain various helful sections and miscellaneous info
  that the average user & more serious player will find useful
  - Includes, but not limited to:
    - Rare grind strategies
    - Normal ore grind strategies
    - Various statistics about the user's inventory
    - Copyable search filters for use in-game
*/

// This comment was added on my Arch Linux WSL2 environment.
import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import { MiscContext } from "../context/MiscContext";

import NavBar from "../components/NavBar";

import searchFilters from "../data/SearchFilters";
import emblemPerks from "../data/EmblemPerks";
import { oreIcons } from "../data/oreIcons";
import missingIcon from "../images/ore-icons/Missing_Texture.webp";

import "../styles/AllGradients.css";
import "../styles/MiscPage.css";

function MiscPage() {
  // Grab the data, john boolean, and function from CSV context
  const {
    csvData,
    valueMode,
    setValueMode,
    currentDict
  } = useContext(MiscContext);

  // Copy the search filter to the clipboard
  const copyFilter = (filterText) => {
    navigator.clipboard
      .writeText(filterText)
      .then(() => {
        console.log("Filter copied:", filterText);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  // Flatten all ore arrays from all categories into one array
  const allOres = Object.values(currentDict).flat();

  // Calculate and sort ores by number of NVs
  const sortedOres = allOres
    .map((ore) => {
      const inventory = csvData[ore.name] || 0;
      const nvValue = ore.baseValue * 100;
      const numNVs = nvValue > 0 ? inventory / nvValue : 0;
      // Return the ore objects, number of NVs per ore,
      // number in the inventory, and value per NV (unused for now,
      // but could be used later)
      return {
        ...ore,
        numNVs,
        inventory,
        nvValue,
      };
    })
    .sort((a, b) => a.numNVs - b.numNVs);

  /* Generate CSS class name for ore gradient */
  const getOreClassName = (oreName) => {
    return `color-template-${oreName.toLowerCase().replace(/ /g, '-')}`;
  };

  // Array of cards - can be expanded with new content and customized
  // with different gradients if necessary (PER CARD)
  // Each has an id, title (header) and customizable content
  const cards = [
    {
      id: "card1",
      title: "Search Filters",
      content: (
        <div className="search-filters">
          {searchFilters.map((category, index) => {
            // Split at the first colon
            const colonIndex = category.indexOf(":");
            const titlePart = category.substring(0, colonIndex + 1);
            const itemsPart = category.substring(colonIndex + 1);

            return (
                <p key={index}>
                    <button
                        className="copy-btn"
                        onClick={() => copyFilter(category.substring(category.indexOf(":") + 2))}
                        title="Copy filters"
                    >
                        ⎘
                    </button>
                    <strong>{titlePart}</strong>
                    {itemsPart}
                </p>
            );
        })}
        </div>
      ),
      link: "link1",
    },
    {
      id: "card2",
      title: "Ores by Number of NVs (Least to Most)",
      content: (
        <div className="numNV">
          {/* Mode selector buttons */}
          <div className="mode-selector">
            <div className="box-button">
              <button
                onClick={() => setValueMode('john')}
                className={valueMode === 'john' ? "color-template-pout" : ""}
              >
                <span>John Values</span>
              </button>
            </div>
            <div className="box-button">
              <button
                onClick={() => setValueMode('nan')}
                className={
                  valueMode === 'nan' ? "color-template-diamond" : ""
                }
              >
                <span>NAN Values</span>
              </button>
            </div>
            <div className="box-button">
              <button
                onClick={() => setValueMode('custom')}
                className={
                  valueMode === 'custom' ? "color-template-havicron" : ""
                }
              >
                <span>Custom</span>
              </button>
            </div>
          </div>

          {/* Ore list */}
          <div className="ore-list">
            {sortedOres.map((ore, index) => (
              <div key={index} className="ore-item">
                <span className="ore-name">{ore.name}</span>
                <div className="ore-stats">
                  <span>NVs: {ore.numNVs.toFixed(2)}</span>
                  <span> Inv: {ore.inventory.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      link: "/link2",
    },
    {
      id: "card3",
      title: "Useful Emblems",
      content:
        <div className="emblems-box">
          <table className="emblems-table">
            <thead>
            <tr>
              <th>Ore Name</th>
              <th>Emblem Perk</th>
            </tr>
          </thead>
          <tbody>
            {emblemPerks.map((emblem) => (
              <tr key={emblem.name}>
                {/* Name column with gradient and icon */}
                <td className={`name-column ${getOreClassName(emblem.name)}`} data-text={emblem.name}>
                  {oreIcons[emblem.name.replace(/ /g, '_')] ? (
                    <img
                      src={oreIcons[emblem.name.replace(/ /g, '_')]}
                      alt={`${emblem.name} icon`}
                      className="ore-icon"
                      loading="lazy"
                      onError={(e) => {
                        console.error(`Missing icon for: ${emblem.name}`);
                        e.target.style.display = 'none';
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
                  {emblem.name}
                </td>
                {/* Description column */}
                <td className="description-column">
                  {emblem.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>,
      link: "/link3",
    },
  ];

  return (
    <div>
    <NavBar />
    <div className="misc-page">
      <div className="cards-container">
        {cards.map((card) => (
          <div key={card.id} className="card">
            <div className="card2">
              <h3>{card.title}</h3>
              {card.content}
              <Link to={card.link} className="card-link">
                Placeholder Link
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default MiscPage;
