import React from 'react';
import { Link } from 'react-router-dom';
import { CSVContext } from '../context/CSVContext';
import { TradeContext } from '../context/TradeContext';
import { johnValsDict } from '../components/JohnVals';
import { nanValsDict } from '../components/NANVals';
import "../styles/MiscPage.css";
import "../styles/AllGradients.css";
import searchFilters from '../components/SearchFilters';

function MiscPage() {

    const copyFilter = (filterText) => {
        navigator.clipboard.writeText(filterText)
            .then(() => {

                console.log('Filter copied:', filterText);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
    };

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
            link: "/materials"
        },
        {
            id: "card2",
            title: "Second Card",
            content: "Content for the second card goes here. Check out the gradient border.",
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
                                Learn More
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MiscPage;