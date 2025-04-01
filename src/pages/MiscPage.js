import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CSVContext } from '../context/CSVContext';
import { TradeContext } from '../context/TradeContext';
import { johnValsDict } from '../components/JohnVals';
import { nanValsDict } from '../components/NANVals';
import "../styles/MiscPage.css";
import "../styles/AllGradients.css";
import searchFilters from '../components/SearchFilters';

function MiscPage() {
    const { csvData, isJohnValues, setIsJohnValues } = useContext(CSVContext);

    const toggleJohnVals = (enableJohn) => {
        setIsJohnValues(enableJohn); // true for John, false for NAN
    };

    const copyFilter = (filterText) => {
        navigator.clipboard.writeText(filterText)
            .then(() => {

                console.log('Filter copied:', filterText);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
    };

    // Get the appropriate dictionary based on mode
    const currentDict = isJohnValues ? johnValsDict : nanValsDict;

    // Flatten all ore arrays from all categories into one array
    const allOres = Object.values(currentDict).flat();

    // Calculate and sort ores by number of NVs
    const sortedOres = allOres
        .map(ore => {
        const inventory = csvData[ore.name] || 0;
        const nvValue = ore.baseValue * 100;
        const numNVs = nvValue > 0 ? inventory / nvValue : 0;
        
        return {
            ...ore,  // Include all original properties
            numNVs,
            inventory,
            nvValue
        };
        })
        .sort((a, b) => a.numNVs - b.numNVs);

    const cards = [
        {
            id: "card1",
            title: "Search Filters",
            content: (
                <div className="search-filters">
                    {searchFilters.map((category, index) => {
                        // Split at the first colon while preserving the arrow
                        const colonIndex = category.indexOf(':') + 2;
                        const arrowPart = category.substring(0, category.indexOf(' ') + 1); // Gets "➜ "
                        const titlePart = category.substring(category.indexOf(' ') + 1, colonIndex);
                        const itemsPart = category.substring(colonIndex);

                        return (
                            <p key={index}>
                                {arrowPart}
                                <button
                                    className="copy-btn"
                                    onClick={() => copyFilter(itemsPart)}
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
            link: 'link1'
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
                        onClick={() => toggleJohnVals(true)}
                        className={isJohnValues ? "color-template-rhylazil" : ""}
                    >
                        <span>John Values</span>
                    </button>
                    </div>
                    <div className="box-button">
                    <button 
                        onClick={() => toggleJohnVals(false)}
                        className={isJohnValues === false ? "color-template-diamond" : ""}
                    >
                        <span>NAN Values</span>
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
            link: "/link2"
        },
        {
            id: "card3",
            title: "Third Card",
            content: "Final card content with the same stylish hover animations.",
            link: "/link3"
        }
    ];

    return (
        <div className="misc-page">
            <nav className="misc-nav">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/valuechart">Value Chart</Link></li>
                    <li><Link to="/tradetool">Trade Tool</Link></li>
                    <li><Link to="/csvloader">CSV Loader</Link></li>
                </ul>
            </nav>

            <div className="cards-container">
                {cards.map((card) => (
                    <div key={card.id} className="card">
                        <div className="card2">
                            <h3>{card.title}</h3>
                            {card.content}
                            <Link to={card.link} className="card-link">
                                More Stats
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MiscPage;