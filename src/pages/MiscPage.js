
import React from "react";

import NavBar from "../components/NavBar";

import searchFilters from "../data/SearchFilters";
import charmPerks from "../data/CharmPerks";
import { CharmIcons } from "../data/CharmIcons";
import missingIcon from "../images/ore-icons/Missing_Texture.webp";

import "../styles/AllGradients.css";
import "../styles/MiscPage.css";

function MiscPage() {
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

  /* Generate CSS class name for ore gradient */
  const getOreClassName = (oreName) => {
    return `color-template-${oreName.toLowerCase().replace(/ /g, '-')}`;
  };

  // Array of cards - can be expanded with new content and customized
  // with different gradients if necessary (PER CARD)
  // Each has an id, title (header) and customizable content
  const cards = [
    {
      // Search filters
      id: "card1",
      title: "Search Filters (Click the Icon to Copy & Paste in your inventory search bar)",
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
    },
    {
      id: "card3",
      title: "Charms (Ordered by Usefulness)",
      content:
        <div className="charms-box">
          <table className="charms-table">
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
                  style={{padding:"5px"}}
                >
                  {CharmIcons[charm.name.replace(/ /g, '_')] ? (
                    <img
                      src={CharmIcons[charm.name.replace(/ /g, '_')]}
                      alt={`${charm.name} icon`}
                      className="ore-icon"
                      id={`${charm.name}-icon`}
                      onError={(e) => {
                        console.error(`Missing icon for: ${charm.name}`);
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
                  {charm.name}
                </td>
                <td className="description-column">
                  {charm.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>,
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
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default MiscPage;
